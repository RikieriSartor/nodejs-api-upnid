const paypal = require('paypal-rest-sdk')

paypal.configure({
  'mode': process.env.PAYMENT_MODE,
  'client_id': process.env.PAYMENT_CLIENT_ID,
  'client_secret': process.env.PAYMENT_CLIENT_SECRET
})

class PaymentController {
  async pay (req, res) {
    const { items } = req.body
    const { amount } = req.body

    const createPaymentJSON = {
      'intent': 'sale',
      'payer': {
        'payment_method': 'paypal'
      },
      'redirect_urls': {
        'return_url': process.env.PAYMENT_RETURN_URL,
        'cancel_url': process.env.PAYMENT_CANCEL_URL
      },
      'transactions': [{
        'item_list': {
          'items': items
        },
        'amount': amount
      }]
    }

    paypal.payment.create(createPaymentJSON, function (error, payment) {
      if (error) {
        return res.status(500).send({ message: `Internal server error (1). ${error}` })
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            return res.status(200).send({ id: payment.id, paymentRedirectLink: payment.links[i].href })
          }
        }
      }
    })
  }

  async success (req, res) {
    const payerId = req.query.PayerID
    const paymentId = req.query.paymentId
    // const token = req.query.token

    // buscar pagamento pelo token e gerar a venda (mudar o nome desse
    // controller para PayPalController e utilizar o PaymentController para
    // registrar os dados no mongodb?)

    const ExecutePaymentJSON = {
      'payer_id': payerId,
      'transactions': [{
        'amount': {
          'currency': 'BRL',
          'total': '55.00'
        }
      }]
    }

    paypal.payment.execute(paymentId, ExecutePaymentJSON, function (error, payment) {
      if (error) {
        return res.status(500).send({ message: `Internal server error (2). ${error.response}` })
      } else {
        return res.status(200).send(JSON.stringify(payment))
      }
    })
  }

  async cancel (req, res) {
    return res.status(400).send({ message: 'Payment canceled.', token: req.query.token ? req.query.token : 'N/I' })
  }
}

module.exports = new PaymentController()

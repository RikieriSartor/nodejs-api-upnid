const paypal = require('paypal-rest-sdk')

paypal.configure({
  'mode': process.env.PAYMENT_MODE,
  'client_id': process.env.PAYMENT_CLIENT_ID,
  'client_secret': process.env.PAYMENT_CLIENT_SECRET
})

class PaymentController {
  async pay (req, res) {
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
          'items':
          [
            {
              'name': 'Red Sox Hat',
              'sku': '001',
              'price': '25.00',
              'currency': 'BRL',
              'quantity': 1
            },
            {
              'name': 'Red Sox Hat 2',
              'sku': '002',
              'price': '15.00',
              'currency': 'BRL',
              'quantity': 2
            }
          ]
        },
        'amount': {
          'currency': 'BRL',
          'total': '55.00'
        },
        'description': 'Hat for the best team ever'
      }]
    }

    paypal.payment.create(createPaymentJSON, function (error, payment) {
      if (error) {
        return res.status(500).send({ message: `Erro ao gerar pagamento. ${error}` })
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            return res.status(200).send({ paymentRedirectLink: payment.links[i].href })
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
        console.log(error)
        return res.status(500).send({ message: `Erro ao executar o pagamento. ${error.response}` })
      } else {
        return res.status(200).send(JSON.stringify(payment))
      }
    })
  }

  async cancel (req, res) {
    return res.status(400).send({ message: 'Pagamento cancelado.', token: req.query.token ? req.query.token : 'N/I' })
  }
}

module.exports = new PaymentController()

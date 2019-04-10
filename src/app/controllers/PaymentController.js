const paypal = require('paypal-rest-sdk')

paypal.configure({
  'mode': 'sandbox',
  'client_id': 'AQz1MLBi75dDIEmw-qa2XteJG-G_l_3CfNq0QmfjCjEc9lSTKbtS0cz4oIq7XciWD6UOSyIPNKqYzilN',
  'client_secret': 'EERdy4_8TArOTM2fXyNDHMEaxwXV1MxuPiCIv0ImMRkf9ltZ2bMyLe_0yu6IBNU-Pww11vX36rxnmz2k'
})

class PaymentController {
  async pay (req, res) {
    const createPaymentJSON = {
      'intent': 'sale',
      'payer': {
        'payment_method': 'paypal'
      },
      'redirect_urls': {
        'return_url': 'http://localhost:3000/success',
        'cancel_url': 'http://localhost:3000/cancel'
      },
      'transactions': [{
        'item_list': {
          'items': [{
            'name': 'Red Sox Hat',
            'sku': '001',
            'price': '25.00',
            'currency': 'BRL',
            'quantity': 1
          }]
        },
        'amount': {
          'currency': 'BRL',
          'total': '25.00'
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

    const ExecutePaymentJSON = {
      'payer_id': payerId,
      'transactions': [{
        'amount': {
          'currency': 'BRL',
          'total': '25.00'
        }
      }]
    }

    paypal.payment.execute(paymentId, ExecutePaymentJSON, function (error, payment) {
      if (error) {
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

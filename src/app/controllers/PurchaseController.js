const Purchase = require('../models/Purchase')
const PayPal = require('paypal-rest-sdk')

PayPal.configure({
  'mode': process.env.PAYMENT_MODE,
  'client_id': process.env.PAYMENT_CLIENT_ID,
  'client_secret': process.env.PAYMENT_CLIENT_SECRET
})

class PurchaseController {
  async index (req, res) {
    const filters = {}
    try {
      const purchases = await Purchase.paginate(filters, {
        populate: ['products'],
        page: req.params.page || 1,
        limit: process.env.DEFAULT_PAGE_LIMIT ? parseInt(process.env.DEFAULT_PAGE_LIMIT) : 20,
        sort: '-createdAt'
      })
      return res.json(purchases)
    } catch (error) {
      return res.status(500).send({ message: `Internal server error. ${error}` })
    }
  }

  async show (req, res) {
    try {
      const purchase = await Purchase.findById(req.params.id).populate('products')
      if (!purchase) {
        return res.status(404).send({ message: 'Purchase not found.' })
      }
      return res.json(purchase)
    } catch (error) {
      return res.status(500).send({ message: `Internal server error. ${error}` })
    }
  }

  async store (req, res) {
    try {
      const purchase = await Purchase.create(req.body) // tratar N produtos + token (vem do front?)
      return res.json(purchase)
    } catch (error) {
      return res.status(500).send({ message: `Internal server error. ${error}` })
    }
  }

  async destroy (req, res) {
    try {
      const purchase = await Purchase.findByIdAndDelete(req.params.id)
      if (!purchase) {
        return res.status(404).send({ message: 'Purchase not found.' })
      }
      return res.send(purchase)
    } catch (error) {
      return res.status(500).send({ message: `Internal server error. ${error}` })
    }
  }

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

    PayPal.payment.create(createPaymentJSON, function (error, payment) {
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
    const token = req.query.token

    const purchase = await Purchase.find({ token })

    if (!purchase) {
      return res.status(404).send({ message: 'Invalid token. Purchase not found.' })
    }

    const ExecutePaymentJSON = {
      'payer_id': payerId,
      'transactions': [{
        'amount': {
          'currency': 'BRL',
          'total': purchase[0].amount.toFixed(2)
        }
      }]
    }

    PayPal.payment.execute(paymentId, ExecutePaymentJSON, async function (error, payment) {
      if (error) {
        return res.status(500).send({ message: `Internal server error (2). ${error.response}` })
      } else {
        const updatedPurchase = await Purchase.findOneAndUpdate({ _id: purchase[0]._id }, { status: 'approved' }, { new: true })
        return res.status(200).send(updatedPurchase)
      }
    })
  }

  async cancel (req, res) {
    const token = req.query.token

    const purchase = await Purchase.find({ token })

    if (!purchase) {
      return res.status(404).send({ message: 'Invalid token. Purchase not found.' })
    }

    const updatedPurchase = await Purchase.findOneAndUpdate({ _id: purchase[0]._id }, { status: 'canceled' }, { new: true })
    return res.status(200).send({ updatedPurchase })
  }
}

module.exports = new PurchaseController()

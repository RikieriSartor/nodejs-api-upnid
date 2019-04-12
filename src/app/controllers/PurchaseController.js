const Purchase = require('../models/Purchase')

class PurchaseController {
  async index (req, res) {
    const filters = {}
    try {
      if (req.query.amount_min || req.query.amount_max) {
        filters.amount = {}
        if (req.query.amount_min) {
          filters.amount.$gte = req.query.amount_min
        }
        if (req.query.amount_max) {
          filters.amount.$lte = req.query.amount_max
        }
      }

      const purchases = await Purchase.paginate(filters, {
        page: req.params.page || 1,
        limit: process.env.DEFAULT_PAGE_LIMIT ? parseInt(process.env.DEFAULT_PAGE_LIMIT) : 20,
        populate: ['product'],
        sort: '-createdAt'
      })

      return res.json(purchases)
    } catch (e) {
      return res.status(500).send({ message: 'Internal server error.' })
    }
  }

  async show (req, res) {
    try {
      const purchase = await Purchase.findById(req.params.id).populate(['product'])
      if (!purchase) {
        return res.status(400).send({ message: 'Purchase not found.' })
      }
      return res.json(purchase)
    } catch (e) {
      return res.status(500).send({ message: 'Internal server error.' })
    }
  }

  async store (req, res) {
    try {
      const purchase = await Purchase.create(req.body)
      return res.json(purchase)
    } catch (e) {
      return res.status(500).send({ message: 'Internal server error.' })
    }
  }

  async success (req, res) {
  }

  async cancel (req, res) {
  }
}

module.exports = new PurchaseController()

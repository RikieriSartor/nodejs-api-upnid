const Product = require('../models/Product')

class PaymentController {
  async index (req, res) {
    const filters = {}
    try {
      if (req.query.price_min || req.query.price_max) {
        filters.price = {}
        if (req.query.price_min) {
          filters.price.$gte = req.query.price_min
        }
        if (req.query.price_max) {
          filters.price.$lte = req.query.price_max
        }
      }

      if (req.query.name) {
        filters.name = new RegExp(req.query.name, 'i')
      }

      const products = await Product.paginate(filters, {
        page: req.params.page || 1,
        limit: process.env.DEFAULT_PAGE_LIMIT ? parseInt(process.env.DEFAULT_PAGE_LIMIT) : 20,
        sort: '-createdAt'
      })

      return res.json(products)
    } catch (error) {
      return res.status(500).send({ message: `Internal server error. ${error}` })
    }
  }

  async show (req, res) {
    try {
      const product = await Product.findById(req.params.id)

      if (!product) {
        return res.status(404).send({ message: 'Product not found.' })
      }

      return res.json(product)
    } catch (error) {
      return res.status(500).send({ message: `Internal server error. ${error}` })
    }
  }

  async store (req, res) {
    try {
      const product = await Product.create(req.body)
      return res.json(product)
    } catch (error) {
      return res.status(500).send({ message: `Internal server error. ${error}` })
    }
  }

  async update (req, res) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      )
      return res.json(product)
    } catch (error) {
      return res.status(500).send({ message: `Internal server error. ${error}` })
    }
  }

  async destroy (req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id)
      if (!product) {
        return res.status(404).send({ message: 'Product not found.' })
      }
      return res.send(product)
    } catch (error) {
      return res.status(500).send({ message: `Internal server error. ${error}` })
    }
  }
}

module.exports = new PaymentController()

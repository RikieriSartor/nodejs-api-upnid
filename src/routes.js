const express = require('express')
const validate = require('express-validation')

const routes = express.Router()

const CorreiosController = require('./app/controllers/CorreiosController')
const PaypalController = require('./app/controllers/PaymentController')
const ProductController = require('./app/controllers/ProductController')
const PurchaseController = require('./app/controllers/PurchaseController')

const validators = require('./app/validators')

routes.post('/freigth', CorreiosController.freigth)

routes.post('/pay', PaypalController.pay)
routes.get('/success', PaypalController.success)
routes.get('/cancel', PaypalController.cancel)

routes.get('/products', ProductController.index)
routes.get('/products/:id', ProductController.show)
routes.post('/products', validate(validators.Product), ProductController.store)
routes.put('/products', validate(validators.Product), ProductController.update)
routes.delete('/products/:id', ProductController.destroy)

routes.get('/purchases', PurchaseController.index)
routes.get('/purchases/:id', PurchaseController.show)
routes.post('/purchases', validate(validators.Purchase), PurchaseController.store)

module.exports = routes

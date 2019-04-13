const express = require('express')
const validate = require('express-validation')

const routes = express.Router()

const CorreiosController = require('./app/controllers/CorreiosController')
const ProductController = require('./app/controllers/ProductController')
const PurchaseController = require('./app/controllers/PurchaseController')

const validators = require('./app/validators')

routes.post('/freigth', CorreiosController.freigth)

routes.get('/products', ProductController.index)
routes.get('/products/:id', ProductController.show)
routes.post('/products', validate(validators.Product), ProductController.store)
routes.put('/products/:id', validate(validators.Product), ProductController.update)
routes.delete('/products/:id', ProductController.destroy)

routes.get('/purchases', PurchaseController.index)
routes.get('/purchases/:id', PurchaseController.show)
routes.post('/purchases', validate(validators.Purchase), PurchaseController.store)

routes.post('/pay', PurchaseController.pay)
routes.get('/success', PurchaseController.success)
routes.get('/cancel', PurchaseController.cancel)

module.exports = routes

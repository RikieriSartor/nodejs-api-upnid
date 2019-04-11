const express = require('express')

const routes = express.Router()

const CorreiosController = require('./app/controllers/CorreiosController')
const PaypalController = require('./app/controllers/PaymentController')

// Frete
routes.post('/freigth', CorreiosController.freigth)

// Pagamentos
routes.post('/pay', PaypalController.pay)
routes.get('/success', PaypalController.success)
routes.get('/cancel', PaypalController.cancel)

module.exports = routes

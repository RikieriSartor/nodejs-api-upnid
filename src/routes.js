const express = require('express')

const routes = express.Router()

const CorreiosController = require('./app/controllers/CorreiosController')
const PaymentController = require('./app/controllers/PaymentController')

// Frete
routes.post('/freigth', CorreiosController.freigth)

// Pagamentos
routes.post('/pay', PaymentController.pay)
routes.get('/success', PaymentController.success)
routes.get('/cancel', PaymentController.cancel)

module.exports = routes

const express = require('express')

const routes = express.Router()

const CorreiosController = require('./app/controllers/CorreiosController')

routes.get('/frete', CorreiosController.frete)

module.exports = routes

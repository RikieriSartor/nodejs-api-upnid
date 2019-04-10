const express = require('express')

const routes = express.Router()

routes.get('/', (req, res) => {
  res.send('Welcome home!')
})

module.exports = routes

/* eslint-disable no-undef */
const request = require('supertest')
const address = process.env.URL_TEST ? process.env.URL_TEST : 'http://localhost'

var _id = null

test('get /products', () => {
  return request(address)
    .get('/products')
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.docs).toBeInstanceOf(Array)
    }).catch(fail)
})

test('get /products?page=1&price_min=0&price_max=999&name=Test', () => {
  return request(address)
    .get('/products')
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.docs).toBeInstanceOf(Array)
    }).catch(fail)
})

test('get 404 /products/:fake_id', () => {
  return request(address)
    .get('/products/5ce124b49eec0f252e900eeb')
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

test('get 500 /products/:wrong_id', () => {
  return request(address)
    .get('/products/fake_id')
    .then(response => {
      expect(response.status).toBe(500)
    }).catch(fail)
})

test('post /products', () => {
  return request(address)
    .post('/products')
    .send({
      name: 'Product name',
      description: 'Product description',
      price: 99.99,
      imageURL: 'https://fakeurlimage.com/product.jpg',
      weight: 5,
      height: 10,
      width: 15,
      diameter: 20,
      length: 25
    }).then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.name).toBe('Product name')
      expect(response.body.description).toBe('Product description')
      expect(response.body.price).toBe(99.99)
      expect(response.body.imageURL).toBe('https://fakeurlimage.com/product.jpg')
      expect(response.body.weight).toBe(5)
      expect(response.body.height).toBe(10)
      expect(response.body.width).toBe(15)
      expect(response.body.diameter).toBe(20)
      expect(response.body.length).toBe(25)
      _id = response.body._id
    }).catch(fail)
})

test('get /products/:id', () => {
  return request(address)
    .get(`/products/${_id}`)
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.name).toBe('Product name')
      expect(response.body.description).toBe('Product description')
      expect(response.body.price).toBe(99.99)
      expect(response.body.imageURL).toBe('https://fakeurlimage.com/product.jpg')
      expect(response.body.weight).toBe(5)
      expect(response.body.height).toBe(10)
      expect(response.body.width).toBe(15)
      expect(response.body.diameter).toBe(20)
      expect(response.body.length).toBe(25)
    }).catch(fail)
})

test('put /products', () => {
  return request(address)
    .put(`/products/${_id}`)
    .send({
      name: 'New product name',
      description: 'New product description',
      price: 199.99,
      imageURL: 'https://fakeurlimage.com/new_product.jpg',
      weight: 10,
      height: 15,
      width: 20,
      diameter: 25,
      length: 30
    }).then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.name).toBe('New product name')
      expect(response.body.description).toBe('New product description')
      expect(response.body.price).toBe(199.99)
      expect(response.body.imageURL).toBe('https://fakeurlimage.com/new_product.jpg')
      expect(response.body.weight).toBe(10)
      expect(response.body.height).toBe(15)
      expect(response.body.width).toBe(20)
      expect(response.body.diameter).toBe(25)
      expect(response.body.length).toBe(30)
    }).catch(fail)
})

test('delete /products/:id', () => {
  return request(address)
    .delete(`/products/${_id}`)
    .then(response => {
      expect(response.status).toBe(200)
    }).catch(fail)
})

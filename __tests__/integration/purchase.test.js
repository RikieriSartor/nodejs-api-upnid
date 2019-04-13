/* eslint-disable no-undef */
const request = require('supertest')
const address = process.env.URL_TEST ? process.env.URL_TEST : 'http://localhost'

var _id = null

test('get /purchases', () => {
  return request(address)
    .get('/purchases')
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.docs).toBeInstanceOf(Array)
    }).catch(fail)
})

test('get /purchases?page=1', () => {
  return request(address)
    .get('/purchases?page=1')
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.docs).toBeInstanceOf(Array)
    }).catch(fail)
})

test('get 404 /purchases/:fake_id', () => {
  return request(address)
    .get('/purchases/5ce124b49eec0f252f900eeb')
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

test('get 500 /purchases/:wrong_id', () => {
  return request(address)
    .get('/purchases/fake_id')
    .then(response => {
      expect(response.status).toBe(500)
    }).catch(fail)
})

test('post /purchases', () => {
  return request(address)
    .post('/purchases')
    .send({
      products: [{ _id: '5cb124b49eec0f252e900eeb' }],
      zipcode: '88845000',
      freight: 5.45,
      amount: 45.45,
      token: `EC-${Math.random()}-FAKE-TOKEN`
    }).then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.products).toBeDefined()
      expect(response.body.zipcode).toBe('88845000')
      expect(response.body.freight).toBe(5.45)
      expect(response.body.amount).toBe(45.45)
      expect(response.body.token).toBeDefined()
      _id = response.body._id
    }).catch(fail)
})

test('get /purchases/:id', () => {
  return request(address)
    .get(`/purchases/${_id}`)
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.products).toBeDefined()
      expect(response.body.zipcode).toBe('88845000')
      expect(response.body.amount).toBe(45.45)
      expect(response.body.token).toBeDefined()
    }).catch(fail)
})

test('delete /purchases/:id', () => {
  return request(address)
    .delete(`/purchases/${_id}`)
    .then(response => {
      expect(response.status).toBe(200)
    }).catch(fail)
})

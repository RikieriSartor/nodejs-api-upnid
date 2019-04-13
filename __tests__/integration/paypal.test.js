/* eslint-disable no-undef */
const request = require('supertest')
const address = process.env.URL_TEST ? process.env.URL_TEST : 'http://localhost:3000'

jest.setTimeout(30000)

test('post /pay', () => {
  return request(address)
    .post('/pay')
    .send({
      items: [
        {
          name: 'Red Sox Hat',
          sku: '5cafdfde206c9114a8b111f6',
          price: 25.00,
          currency: 'BRL',
          quantity: 1
        }
      ],
      amount: {
        currency: 'BRL',
        total: 25.00
      }
    }).then(response => {
      expect(response.status).toBe(200)
    }).catch(fail)
})

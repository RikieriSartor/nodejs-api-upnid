/* eslint-disable no-undef */
const request = require('supertest')
const address = process.env.URL_TEST ? process.env.URL_TEST : 'http://localhost'

test('post /freigth', () => {
  return request(address)
    .post('/freigth')
    .send({
      nCdServico: 40010,
      sCepOrigem: '27110120',
      sCepDestino: '88845000',
      nVlPeso: 30,
      nVlComprimento: 30,
      nVlAltura: 30,
      nVlLargura: 30,
      nVlDiametro: 30
    }).then(response => {
      expect(response.status).toBe(200)
    }).catch(fail)
})

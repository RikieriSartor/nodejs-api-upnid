const Correios = require('node-correios')
const correios = new Correios()

/**
 * nCdServico: 40010 SEDEX Varejo
 *             40215 SEDEX 10 Varejo
 *             41106 PAC Varejo
 */

class CorreiosController {
  async frete (req, res) {
    const args = {
      nCdFormato: 1,
      nCdServico: req.body.nCdServico ? req.body.nCdServico : '41106,40010',
      sCepOrigem: req.body.sCepOrigem ? req.body.sCepOrigem : '27110120',
      sCepDestino: req.body.sCepDestino,

      nVlPeso: req.body.nVlPeso,
      nVlAltura: req.body.nVlAltura,
      nVlLargura: req.body.nVlLargura,
      nVlDiametro: req.body.nVlDiametro,
      nVlComprimento: req.body.nVlComprimento
    }

    correios.calcPrecoPrazo(args)
      .then(result => {
        if (result[0]['MsgErro'] && result[0]['MsgErro'].trim() !== '') {
          return res.status(400).send({ message: result[0]['MsgErro'] })
        }
        res.json(result)
      }).catch(error => {
        return res.status(500).send({ message: `Erro de execução interna. ${error}` })
      })
  }
}

module.exports = new CorreiosController()

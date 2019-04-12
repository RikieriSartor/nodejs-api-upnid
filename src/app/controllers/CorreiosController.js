const Correios = require('node-correios')
const correios = new Correios()

class CorreiosController {
  async freigth (req, res) {
    const args = {
      nCdFormato: 1,
      nCdServico: req.body.nCdServico ? req.body.nCdServico : process.env.CD_SERVICO,
      sCepOrigem: req.body.sCepOrigem ? req.body.sCepOrigem : process.env.CEP_ORIGEM,
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
        return res.status(500).send({ message: `Internal server error. ${error}` })
      })
  }
}

module.exports = new CorreiosController()

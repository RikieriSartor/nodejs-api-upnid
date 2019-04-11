class PaymentController {
  async index (req, res) {
  }

  async store (req, res) {
    // invoca o metodo pay recebendo URL para pagamento e o token gerado para armazenar na venda
    // cria registro da venda
  }

  async success (req, res) {
  }

  async cancel (req, res) {
  }
}

module.exports = new PaymentController()

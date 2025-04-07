const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

// Função para pegar o histórico de movimentações
async function mostrarHistorico() {
  try {
    const dbpath = path.resolve(__dirname, 'estoque.db');
    const db = await open({
      filename: dbpath,
      driver: sqlite3.Database
    });

    // Consultar a tabela Historico
    const historico = await db.all(`SELECT 
    Funcionario.Nome AS nome_funcionario,
    Produto.Nome_produto AS nome_produto,
    Historico.quantidade,
    Historico.acao,
    Historico.data_movimentacao
FROM 
    Historico
JOIN 
    Funcionario ON Historico.id_funcionario = Funcionario.ID
JOIN 
    Produto ON Historico.id_produto = Produto.id_produto;`);
    console.log(' Movimentações na Tela:', historico);
    await db.close();
    return historico;
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }
}

module.exports = mostrarHistorico;
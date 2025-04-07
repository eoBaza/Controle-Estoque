const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');

async function ExportarHistorico() {
    try {
      const dbpath = path.resolve(__dirname, 'estoque.db');
      const db = await open({
        filename: dbpath,
        driver: sqlite3.Database
      });
  
      const rows = await db.all(`
        SELECT 
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
            Produto ON Historico.id_produto = Produto.id_produto
      `);
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Historico de Movimentações');
  
      worksheet.columns = [
        { header: 'Nome Funcionário', key: 'nome_funcionario', width: 30 },
        { header: 'Nome Produto', key: 'nome_produto', width: 30 },
        { header: 'Quantidade', key: 'quantidade', width: 15 },
        { header: 'Ação', key: 'acao', width: 20 },
        { header: 'Data Movimentação', key: 'data_movimentacao', width: 25 }
      ];
  
      // Adicionar as linhas ao Excel
      rows.forEach(row => {
        const formattedDate = new Date(row.data_movimentacao).toLocaleDateString('pt-BR');
        worksheet.addRow({
          nome_funcionario: row.nome_funcionario,
          nome_produto: row.nome_produto,
          quantidade: row.quantidade,
          acao: row.acao,
          data_movimentacao: formattedDate
        });
      });
  
      // Definir o caminho do arquivo Excel
      const filePath = path.resolve(__dirname, 'Historico_Movimentacoes.xlsx');
  
      // Gerar o arquivo Excel
      await workbook.xlsx.writeFile(filePath);
  
      console.log(`Arquivo Excel gerado em: ${filePath}`);
  
      await db.close();
  
      // Retorna apenas o caminho do arquivo gerado
      return filePath;  // Retornando o caminho do arquivo
  
    } catch (error) {
      console.error("Erro ao exportar o histórico", error);
      return null;  // Em caso de erro, retorna null
    }
  }
  

module.exports = ExportarHistorico;

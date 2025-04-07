const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function verificarUsuario(nome) {
  let db;
  try {
    const dbpath = path.resolve(__dirname, 'estoque.db')
    const db = await open({
      filename: dbpath,
      driver: sqlite3.Database
    });
    await db.exec('BEGIN TRANSACTION;');

    const row = await db.get('SELECT ID FROM Funcionario WHERE Nome = ?', [nome]);
    if (row){
      console.log('Usuário encontrado:', row.ID);
      //Inserir conexao na tabela sessao
      await db.run('INSERT INTO Sessao (Id_funcionario) VALUES (?)', [row.ID]);
      await db.exec('COMMIT;');
      
      console.log('sessao Registrada para o funcionario:', row.ID);
      return true;
    }else {
      await db.exec('ROLLBACK;');
      return false;
    }
  } catch (error) {
    console.error('Erro ao consultar banco:', error);
    
    
    if (db) {
      await db.exec('ROLLBACK;');
    }
    throw error;
  } finally {
    
    if (db) {
      await db.close();
    }
  }
}

module.exports = verificarUsuario;

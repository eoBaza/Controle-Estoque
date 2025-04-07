const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function RetiraProduto(Id_produto, quantidade) {
    try{
            const dbpath = path.resolve(__dirname, 'estoque.db')
                const db = await open({
                  filename: dbpath,
                  driver: sqlite3.Database
                }); 
                console.log('Id_produto recebido:', Id_produto);

                const rows = await db.get('Select Quantidade from Produto where Id_produto = ?', [Id_produto]);
                console.log("Quantidade do produto:", rows);
                if (rows) {
                    const quantidade_atual = (rows.Quantidade || 0) - Number(quantidade);

                    await db.run('UPDATE Produto SET Quantidade = ? WHERE Id_produto = ?', [quantidade_atual, Id_produto]);
                    console.log("Quantidade do produto atualizada:", quantidade_atual);
                }else{
                    console.log("Produto Nao encontrado");
                }
                await db.close();
                
            }catch (error){
                console.error("Erro ao abrir o banco de dados", error);
                throw error;
            }


}
module.exports = RetiraProduto;
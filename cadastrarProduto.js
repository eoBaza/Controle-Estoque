const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function cadastrarProduto(nome,caracteristica,quantidade) {
    try{
        const dbpath = path.resolve(__dirname, 'estoque.db')
                    const db = await open({
                      filename: dbpath,
                      driver: sqlite3.Database
                    }); 
        await db.run(
            'insert into Produto (Nome_produto, Caracteristica_produto, Quantidade) Values (?,?,?)',[nome, caracteristica, quantidade]
        );  
        console.log('Produto Cadastrado com Sucesso!');
        await db.close()
        return { success: true, message: 'Produto cadastrado com Sucesso!'};
    }catch(error){
        console.error("Erro ao cancelar o Produto: ", error);
        return { success:false, message: 'Erro ao cadastrar o produto' };
    }
}
module.exports = cadastrarProduto;
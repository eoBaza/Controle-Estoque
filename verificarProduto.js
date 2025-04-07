const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function MostrarProduto() {
    try{
        const dbpath = path.resolve(__dirname, 'estoque.db')
            const db = await open({
              filename: dbpath,
              driver: sqlite3.Database
            }); 
        const rows = await db.all('SELECT * FROM PRODUTO')
        console.log(' Produtos na Tela:', rows);

        await db.close();
        return rows;
    } catch (error){
        console.error("Erro a mostrar o produto na tela" , error);
        return [];
    }
}

module.exports = MostrarProduto;

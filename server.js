const express = require('express');
const cors = require('cors');
const verificarUsuario = require('./verificarUser'); 
const MostrarProduto = require('./verificarProduto');
const cadastrarProduto = require('./cadastrarProduto');
const mostrarHistorico = require('./historico');
const ExportarHistorico = require('./ExportarHistorico');
const EntradaProduto = require('./EntradaProduto');
const RetiraProduto = require('./RetiraProduto');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


app.post('/verificarUser', async (req, res) => { // Tornar a função assíncrona
  const { nome } = req.body;
  console.log('Nome recebido:', nome); // Adicionando um log no console do site

  try {
    // Aguardando a execução da função assíncrona
    const success = await verificarUsuario(nome);
    
    if (success) {
      console.log('Usuário encontrado');
      return res.json({ success: true, message: 'Usuário encontrado' });
    } else {
      console.log('Usuário não encontrado');
      return res.json({ success: false, message: 'Usuário não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao verificar o usuário:', err); // Logando o erro
    return res.status(500).json({ success: false, message: 'Erro ao verificar usuário' });
  }
});

app.get('/verificarProduto', async (req, res) => {
  try {
    const produtos = await MostrarProduto();
    res.json(produtos); // Agora retorna só o array
  } catch (err) {
    console.error('Erro ao buscar os produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar os produtos' });
  }
});

app.post('/cadastrarProduto', async (req, res) => {
  const { nome, caracteristica, quantidade } = req.body;
  console.log('Recebendo novo Produto: ', req.body);

  if(!nome || !caracteristica || !quantidade){
    return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios!' });
  } try {
    const resultado = await cadastrarProduto(nome, caracteristica, quantidade);
    if (resultado.success) {
      return res.json({ success: true, message: 'Produto cadastrado com sucesso' });
    } else {
      return res.status(500).json({ success: false, message: 'Erro ao cadastrar produto' });
    }
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    res.status(500).json({ success: false, message: 'Erro ao cadastrar produto' });
  }

});

app.get('/historico', async(req, res) => {
  try {
    const historico = await mostrarHistorico(); // Função que busca os históricos do banco de dados
    res.json(historico); // Retorna os dados em formato JSON
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});
app.get('/exportar-historico', async (req, res) => {
  try {
    // Chama a função de exportação e gera o Excel
    const filePath = await ExportarHistorico(); // Agora espera o caminho do arquivo gerado

    // Verifica se o arquivo foi gerado corretamente
    if (!filePath) {
      return res.status(500).json({ success: false, message: 'Erro ao gerar o Excel' });
    }

    // Envia o arquivo Excel para o frontend
    res.download(filePath, 'Historico_Movimentacoes.xlsx', (err) => {
      if (err) {
        console.error('Erro ao enviar o arquivo:', err);
        res.status(500).json({ success: false, message: 'Erro ao enviar o arquivo' });
      }
    });
  } catch (error) {
    console.error('Erro ao gerar o Excel:', error);
    res.status(500).json({ success: false, message: 'Erro ao gerar o Excel' });
  }
});
app.post('/EntradaProduto', async (req, res) => {
  try {
    let { Id_produto, quantidade } = req.body;
    quantidade = Number(quantidade); 
    // Verificar se o ID e quantidade são válidos
    if (!Id_produto || !quantidade || quantidade <= 0) {
      return res.status(400).json({ error: 'ID do produto e quantidade são obrigatórios e a quantidade deve ser maior que 0.' });
    }

    // Chama a função para registrar a entrada do produto
    await EntradaProduto(Id_produto, quantidade);
    return res.json({ message: "Entrada registrada com sucesso!" });
  } catch (err) {
    console.error('Erro ao registrar a entrada do produto:', err);
    return res.status(500).json({ error: 'Erro ao registrar a entrada do produto.' });
  }
});
app.post('/RetiraProduto', async (req, res) => {
  try {
    let { Id_produto, quantidade } = req.body;
    quantidade = Number(quantidade); 
    // Verificar se o ID e quantidade são válidos
    if (!Id_produto || !quantidade || quantidade <= 0) {
      return res.status(400).json({ error: 'ID do produto e quantidade são obrigatórios e a quantidade deve ser maior que 0.' });
    }

    // Chama a função para registrar a entrada do produto
    await RetiraProduto(Id_produto, quantidade);
    return res.json({ message: "Retirada registrada com sucesso!" });
  } catch (err) {
    console.error('Erro ao registrar a Retirada do produto:', err);
    return res.status(500).json({ error: 'Erro ao registrar a Retirada do produto.' });
  }
});

// Iniciar o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

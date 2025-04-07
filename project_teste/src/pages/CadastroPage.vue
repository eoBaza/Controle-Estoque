<template>
    <div>
            <q-input v-model="nome" label="Nome do Produto" class="q-mb-md" />
            <q-input v-model="caracteristica" label="Característica" class="q-mb-md" />
            <q-input v-model="quantidade" label="Quantidade" type="number" class="q-mb-md" />

            <q-btn @click="cadastrarProduto" label="Cadastrar" color="primary" class="q-mr-md" />
            <q-btn @click="$router.push('/HomePage')" label="Voltar" color="negative" />
        </div>
</template>
<script>
import axios from 'axios';
export default {
    data (){
        return {
            nome: '',
            caracteristica: '',
            quantidade: '',
        };
    },
    methods: {
        async cadastrarProduto() {
            try {
                const response = await axios.post('http://localhost:3000/cadastrarProduto', {
                    nome: this.nome,
                    caracteristica: this.caracteristica,
                    quantidade: this.quantidade,
                });

                console.log('Resposta do backend:', response.data);

                if (response.data.success) {
                    console.log('Produto cadastrado com sucesso');
                    this.$router.push('/HomePage');
                } else {
                    console.log('Erro ao cadastrar o produto');
                }
            } catch (error) {
                console.error("Erro ao cadastrar o produto:", error);
            }
        },
    },
}</script>
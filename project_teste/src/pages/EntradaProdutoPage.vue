
<template>
    <q-page>
        <div class="q-pa-md">
            <q-form @submit="handleEntrada" v-if="produtosOptions.length > 0">
                    <q-select
                        v-model="Id_produto"
                        :options="produtosOptions"
                        option-value="value"
                        option-label="label"
                        label="Escolha o Produto"
                        filled
                        emit-value
                    />
                    <q-input
                        v-model="quantidade"
                        label="Quantidade"
                        type="number"
                        min="1"
                        filled
                        :disable="!Id_produto"
                    />
                    <q-btn label="Registrar Entrada" color="primary" type="submit" />
                    <q-btn @click="$router.push('/HomePage')" label="Voltar" color="red"/>
                </q-form>
        </div>
    </q-page>
</template>
<script>
import { ref } from 'vue';  
import axios from 'axios';
import { useQuasar } from 'quasar';
export default{
    name: 'EntradaProdutoPage',
    setup(){
        const $q = useQuasar();
        const Id_produto = ref(null);
        const quantidade = ref(null);
        const produtosOptions = ref([]);

        const fetchProdutos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/verificarProduto');
                console.log('Resposta da API:', response.data);
                produtosOptions.value = response.data.map((produto) => ({
                    label: produto.Nome_produto,
                    value: produto.Id_produto
                }));
            } catch (error) {
                console.error('Erro ao buscar os produtos:', error);
                alert('Erro ao carregar os produtos. Tente novamente mais tarde.');
            }
        };

        fetchProdutos();
        const handleEntrada = async () => {
            console.log('Id_produto selecionado:', Id_produto.value);
            console.log('Quantidade inserida:', quantidade.value);
    if (!Id_produto.value) {
        alert('Por favor, selecione um produto.');
        return;
    }

    if (!quantidade.value || quantidade.value <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    try {
        const payload = {
            Id_produto: Id_produto.value,
            quantidade: quantidade.value
        };
        console.log('Payload enviado:', payload);

        await axios.post('http://localhost:3000/EntradaProduto', payload);

        Id_produto.value = null;
        quantidade.value = null;

        $q.notify({
            message: 'Entrada do produto realizada!',
            color: 'green',
            position: 'top',
        });
    } catch (error) {
        console.error('Erro ao registrar a entrada:', error);
        $q.notify({
            message: 'Não foi possível registrar a entrada do produto!',
            color: 'red',
            position: 'top',
        });
    }
};
        return {
            Id_produto,
            quantidade,
            produtosOptions,
            handleEntrada
        };
    }
}

</script>

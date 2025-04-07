<template>
  <q-page>

     <div class="q-pa-md">
    <q-input
      v-model="search"
      label="Pesquisar Produto pelo Id, Nome..."
      outlined
      dense
      clearable
      class="search-bar"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>

    <div class="q-pa-md">
    <q-table
    v-if="produtorows.length > 0"   
    style="height: 400px"
    flat
    bordered
    title="Produtos"
    :rows="filteredProdutos"
    :columns="produtocolumns"
    row-key="Id_produto"
    virtual-scroll
    v-model:pagination="produtopagination"
    :rows-per-page-options="[0]"
    >
    </q-table>
  </div>


    <div style="display: flex; flex-direction: row; justify-content: space-between; margin: 10px;">
    <q-btn @click="$router.push('/CadastroPage')" label="Cadastrar" color="primary" />
    <q-btn @click="$router.push('/EntradaProdutoPage')" label="Entrada" color="primary"/>
    <q-btn @click="$router.push('/RetiradaProdutoPage')" label="Saida" color="primary"/>
    </div>

    <div class="q-pa-md">
      <div>
        <q-btn icon="calendar_month" color="primary"  @click="showCalendar = true" />
        <q-popup-proxy v-model="showCalendar" transition-show="scale" transition-hide="scale">
          <q-date v-model="model" range mask="YYYY-MM-DD" @update:model-value="showCalendar = false" />
        </q-popup-proxy>
      </div>

      
      <q-table
      v-if="historicorows.length > 0"  
      style="height: 400px"
      flat
      bordered
      title="Histórico"
      :rows="filteredHistorico"
      :columns="historicoColumns"
      row-key="Id_historico"
      virtual-scroll
      v-model:pagination="historicopagination"
      :rows-per-page-options="[5, 10, 15]"
      >
        <template v-slot:body-cell-acao="props">
          <q-td :props="props" :style="getAcaoColor(props.row.acao)">
            {{ props.row.acao }}
          </q-td>
        </template>
      </q-table>
      
      <q-btn
       label="Gerar Arquivo Excel do Historico"
        color="primary"
        icon="archive"
        @click="gerarExcelHistorico"/>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { computed } from 'vue';

export default {
  name: 'HomePage',
  setup() {
    const model = ref(null);
    const showCalendar = ref(false);
    const produtorows = ref([]);
    const historicorows = ref([]);
    const search = ref('');

    const produtocolumns = [
      { name: 'Id_produto', label: 'ID', field: 'Id_produto', sortable: true },
      { name: 'Nome_produto', label: 'Nome', field: 'Nome_produto', sortable: true },
      { name: 'Caracteristica_produto', label: 'Característica', field: 'Caracteristica_produto', sortable: true },
      { name: 'Quantidade', label: 'Quantidade', field: 'Quantidade', sortable: true }
    ];
    const historicoColumns = [
      { name: 'nome_funcionario', label: 'Funcionario', field: 'nome_funcionario', sortable: true },
      { name: 'nome_produto', label: 'Produto', field: 'nome_produto', sortable: true },
      { name: 'acao', label: 'ação', field: 'Acao', sortable: true },
      { name: 'quantidade', label: 'Quantidade', field: 'quantidade', sortable: true },
      { name: 'Data_Movimentacao', label: 'Data_Movimentacao', field: 'data_movimentacao', sortable: true }
    ];
    const produtopagination = ref({
      sortBy: 'Nome_produto',
      descending: false,
      page: 1,
      rowsPerPage: 5
    });
    const historicopagination = ref({
      sortBy: 'Data',
      descending: true,
      page: 1,
      rowsPerPage: 5
    });

    const filteredProdutos = computed(() => {
  if (!search.value) {
    return produtorows.value; // Retorna todos os produtos se não houver pesquisa
  }

  // Filtra os produtos com base no ID ou no nome
  return produtorows.value.filter((produto) => {
    const searchTerm = search.value.toLowerCase();
    return (
      produto.Id_produto.toString().includes(searchTerm) || // Filtra pelo ID
      produto.Nome_produto.toLowerCase().includes(searchTerm) // Filtra pelo nome
    );
  });
});
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/verificarProduto');
        produtorows.value = response.data; // Recebe um array direto da API
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    const fectHistorico = async () => {
      try {
        const response = await axios.get('http://localhost:3000/historico');
        historicorows.value = response.data; // Recebe um array direto da API
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
      }
    };
    const filteredHistorico = computed(() => {
  if (!model.value) {
    return historicorows.value; // Retorna todos os registros se nenhuma data for selecionada
  }

  if (typeof model.value === 'string') {
    // Filtro para um único dia
    const selectedDate = new Date(model.value).toISOString().split('T')[0];
    return historicorows.value.filter((historico) => {
      const dataMovimentacao = new Date(historico.data_movimentacao).toISOString().split('T')[0];
      return dataMovimentacao === selectedDate;
    });
  }

  if (model.value.from && model.value.to) {
    // Filtro para um intervalo de datas
    const fromDate = new Date(model.value.from);
    const toDate = new Date(model.value.to);
    return historicorows.value.filter((historico) => {
      const dataMovimentacao = new Date(historico.data_movimentacao);
      return dataMovimentacao >= fromDate && dataMovimentacao <= toDate;
    });
  }

  return historicorows.value; // Caso nenhuma condição seja atendida
});

    const getAcaoColor = (acao) => {
      console.log('Ação',acao);
      let textColor = '';
      switch (acao) {
        case 'Cadastro':
          textColor = { color: 'blue' };
          break;
        case 'Entrada':
          textColor = { color: 'green' };
          break;
        case 'Retirada':
          textColor = { color: 'red' };
          break;
        default:
          textColor = { color: 'white' };
          break;
      }
      return textColor;
    };

    
    const gerarExcelHistorico = async () => {
  try {
    const response = await axios.get('http://localhost:3000/exportar-historico', {
      responseType: 'blob'  // Isso é importante para que o arquivo seja tratado corretamente como binário
    });

    // Cria um link de download para o arquivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Historico_Movimentacoes.xlsx');  // Nome do arquivo que será baixado
    document.body.appendChild(link);
    link.click();

    // Limpeza
    link.remove();
    window.URL.revokeObjectURL(url);

    console.log('Excel gerado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar o Excel:', error);
  }
};
      


    onMounted(() => {
      fetchProdutos();
      fectHistorico();
      
    });

    return {
      produtorows,
      historicorows,
      produtocolumns,
      historicoColumns,
      produtopagination,
      historicopagination,
      getAcaoColor,
      model,
      showCalendar,
      gerarExcelHistorico,
      search,
      filteredProdutos,
      filteredHistorico ,
    };
  }
};
</script>

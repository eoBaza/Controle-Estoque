<template>
  <q-page>
    <q-input
      v-model="nome"
      label="Digite seu nome"
      :dense="true"
      autofocus
    />
    <q-btn @click="verificarLogin" label="Login" color="primary" />
  </q-page>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nome: '',
    };
  },
  methods: {
    async verificarLogin() {
      try {
        const response = await axios.post('http://localhost:3000/verificarUser', {
          nome: this.nome,
        });

        console.log('Resposta do backend:', response.data); // Log da resposta
        if (response.data.success) {
          console.log('Usuário encontrado');
          // Usando Notify para mostrar a notificação
          this.$q.notify({
            message: 'Usuário encontrado!',
            color: 'green',
            position: 'top',
          });
          this.$router.push('/HomePage'); // Redireciona para a HomePage
        } else {
          console.log('Usuário não encontrado');
          this.$q.notify({
            message: 'Usuário não encontrado!',
            color: 'red',
            position: 'top',
          });
        }
      } catch (error) {
        console.error('Erro ao verificar o usuário', error); // Log do erro
        this.$q.notify({
          message: 'Erro ao verificar o usuário!',
          color: 'red',
          position: 'top',
        });
      }
    },
  },
};
</script>
  
<style scoped>
</style>

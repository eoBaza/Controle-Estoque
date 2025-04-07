<template>
  <q-layout view="hHh lpR fFf">
      <q-header elevated>
          <q-toolbar>
              <q-toolbar-title>
                  Controle-Estoque
              </q-toolbar-title>
          </q-toolbar>
      </q-header>

      <q-page-container>
        <router-view/>
      </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainHomePage',
};
</script>

<style scoped>

</style>

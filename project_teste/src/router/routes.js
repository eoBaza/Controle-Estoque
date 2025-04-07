const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Aqui você está apontando para a página de login, não mais para o IndexPage
      { path: '', component: () => import('pages/LoginPage.vue') }
    ]
  },
  {
    path: '/HomePage',
    component: () => import('layouts/MainHomePage.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') }
    ]
  },
  {
    path: '/CadastroPage',
    component: () => import('layouts/MainCadastroPage.vue'),
    children: [
      { path: '', component: () => import('src/pages/CadastroPage.vue') }
    ]
  },
  {
    path: '/EntradaProdutoPage',
    component: () => import('layouts/MainEntradaPage.vue'),
    children: [
      { path: '', component: () => import('src/pages/EntradaProdutoPage.vue') }
    ]
  },
  {
    path: '/RetiradaProdutoPage',
    component: () => import('layouts/MainRetiradaPage.vue'),
    children: [
      { path: '', component: () => import('src/pages/RetiradaProdutoPage.vue') }
    ]
  },

  // Rota de erro (deve ser deixada no final)
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;

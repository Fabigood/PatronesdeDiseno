import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import AdminLayout from '../views/AdminLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import Clientes from '../views/Clientes.vue'
import RegistrarCompra from '../views/RegistrarCompra.vue'
import ClientePerfil from '../views/ClientePerfil.vue'
import Recompensas from '../views/Recompensas.vue'
import CatalogoRegalos from '../views/CatalogoRegalos.vue'
import Estadisticas from '../views/Estadisticas.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    redirect: '/admin/dashboard',
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'clientes', component: Clientes },
      { path: 'clientes/:id', component: ClientePerfil },
      { path: 'registrar-compra', component: RegistrarCompra },
      { path: 'recompensas', component: Recompensas },
      { path: 'catalogo-regalos', component: CatalogoRegalos },
      { path: 'estadisticas', component: Estadisticas }
    ]
  },
  { path: '/clientes', redirect: '/admin/clientes' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/admin/dashboard')
  } else {
    next()
  }
})

export default router

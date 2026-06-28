<template>
  <div class="admin-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">F</div>
        <div>
          <strong>Fidelización</strong>
          <small>Panel interno</small>
        </div>
      </div>

      <nav class="menu">
        <RouterLink to="/admin/dashboard">Panel principal</RouterLink>
        <RouterLink to="/admin/clientes">Clientes</RouterLink>
        <RouterLink to="/admin/registrar-compra">Registrar compra</RouterLink>
        <RouterLink to="/admin/recompensas">Recompensas</RouterLink>
        <RouterLink to="/admin/catalogo-regalos">Catálogo de regalos</RouterLink>
        <RouterLink to="/admin/estadisticas">Estadísticas</RouterLink>
      </nav>

      <button class="logout" type="button" @click="logout">Cerrar sesión</button>
    </aside>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminLayout',
  methods: {
    logout() {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

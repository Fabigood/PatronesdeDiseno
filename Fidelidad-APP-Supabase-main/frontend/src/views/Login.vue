<template>
  <main class="login-page">
    <section class="login-card">
      <div class="login-info">
        <h1>Fidelización</h1>
        <p>Administra las recompensas y el programa de fidelización de tu local</p>
      </div>

      <form class="login-form" @submit.prevent="login">
        <h2>Iniciar sesión</h2>
        <p>Acceso administrativo del local</p>

        <label>Usuario</label>
        <input v-model="username" placeholder="admin" autocomplete="username" />

        <label>Contraseña</label>
        <input
          v-model="password"
          placeholder="••••••••"
          type="password"
          autocomplete="current-password"
        />

        <button class="primary-btn full" type="submit" :disabled="loading">
          {{ loading ? 'Validando...' : 'Entrar al sistema' }}
        </button>

        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </section>
  </main>
</template>

<script>
import api from '../services/api'

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
      loading: false
    }
  },
  methods: {
    async login() {
      this.error = ''
      this.loading = true

      try {
        const res = await api.post('/auth/login', {
          username: this.username,
          password: this.password
        })

        sessionStorage.setItem('token', res.data.token)
        this.$router.push('/admin/dashboard')
      } catch (err) {
        this.error = 'Usuario o contraseña incorrectos'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
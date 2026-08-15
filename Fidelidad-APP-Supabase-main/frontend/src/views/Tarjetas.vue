<template>
  <section class="page fade-in">
    <div class="page-head">
      <div>
        <p class="eyebrow">Fidelización</p>
        <h1>Tarjetas enviadas</h1>
      </div>
    </div>

    <article class="panel-card table-card">
      <div class="table-head">
        <h2>Historial de envíos</h2>
        <input v-model="filtro" class="search" placeholder="Buscar por cliente o correo..." />
      </div>

      <div v-if="cargando" class="helper-text">Cargando tarjetas…</div>
      <div v-else-if="error" class="alert-error">⚠ {{ error }}</div>
      <div v-else-if="!tarjetasFiltradas.length" class="helper-text">
        {{ tarjetas.length ? 'No se encontraron tarjetas para esa búsqueda.' : 'Todavía no se envió ninguna tarjeta de fidelidad.' }}
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Correo</th>
            <th>Nivel</th>
            <th>Puntos al enviar</th>
            <th>Fecha de envío</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tarjetasFiltradas" :key="t.id">
            <td>
              <strong class="cliente-link" @click="$router.push('/admin/clientes/' + t.clienteId)">{{ t.nombre }}</strong>
            </td>
            <td>{{ t.email }}</td>
            <td><span class="badge" :class="nivelClass(t.nivel)">{{ t.nivel }}</span></td>
            <td>{{ t.puntos }} pts</td>
            <td>{{ formatFechaHora(t.fechaEnvio) }}</td>
          </tr>
        </tbody>
      </table>
    </article>
  </section>
</template>

<script>
import { listarTarjetasEnviadas, nivelClass } from '../data/fidelidadStore'

export default {
  name: 'Tarjetas',
  data() {
    return {
      filtro: '',
      tarjetas: [],
      cargando: true,
      error: ''
    }
  },
  computed: {
    tarjetasFiltradas() {
      const term = this.filtro.trim().toLowerCase()
      if (!term) return this.tarjetas
      return this.tarjetas.filter(t => (t.nombre + ' ' + t.email).toLowerCase().includes(term))
    }
  },
  async mounted() {
    try {
      this.tarjetas = await listarTarjetasEnviadas()
    } catch (err) {
      this.error = err?.response?.data?.error || 'No se pudo cargar el historial de tarjetas'
    } finally {
      this.cargando = false
    }
  },
  methods: {
    nivelClass,
    formatFechaHora(value) {
      if (!value) return 'Sin datos'
      const fecha = new Date(value)
      return fecha.toLocaleString('es', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>

<style scoped>
.cliente-link {
  cursor: pointer;
  color: inherit;
}
.cliente-link:hover {
  text-decoration: underline;
}
.alert-error {
  background: #fdecea;
  border: 1px solid #e74c3c;
  color: #c0392b;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.875rem;
}
</style>

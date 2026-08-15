<template>
  <section class="page fade-in" v-if="cliente">
    <div class="client-header">
      <div class="avatar big">{{ iniciales(cliente.nombre) }}</div>
      <div>
        <h1>{{ cliente.nombre }}</h1>
        <p>{{ cliente.email }}</p>
      </div>
      <span class="status" :class="cliente.estado === 'Activo' ? 'ok' : 'warn'">{{ cliente.estado }}</span>
      <button class="primary-btn" :disabled="enviando" @click="enviarTarjetaCliente">
        {{ enviando ? 'Enviando…' : 'Enviar tarjeta' }}
      </button>
      <button @click="verTarjeta">Vista previa</button>
    </div>
    <p v-if="mensajeTarjeta" class="tarjeta-mensaje" :class="{ error: errorTarjeta }">{{ mensajeTarjeta }}</p>

    <TarjetaPreviewModal
      :visible="previewVisible"
      :html="previewHtml"
      :cargando="previewCargando"
      :error="previewError"
      @close="previewVisible = false"
    />

    <div class="stats-grid four">
      <article class="stat-card"><span>Puntos acumulados</span><strong>{{ cliente.puntos }}</strong></article>
      <article class="stat-card"><span>Nivel interno</span><strong>{{ cliente.nivel }}</strong></article>
      <article class="stat-card"><span>Compras totales</span><strong>{{ cliente.totalCompras }}</strong></article>
      <article class="stat-card"><span>Prob. regreso</span><strong>{{ cliente.probabilidadRetorno }}%</strong></article>
    </div>

    <div class="dashboard-grid">
      <article class="panel-card">
        <h2>Análisis de comportamiento</h2>
        <div class="info-list">
          <p><span>Frecuencia de compra</span><strong>{{ cliente.frecuencia }}</strong></p>
          <p><span>Intervalo promedio</span><strong>{{ cliente.intervalo || 'Sin datos' }} días</strong></p>
          <p><span>Desviación actual</span><strong :class="cliente.desviacion > 0 ? 'text-danger' : ''">{{ cliente.desviacion }}%</strong></p>
          <p><span>Última compra</span><strong>{{ cliente.ultimaCompra }}</strong></p>
          <p><span>Próxima esperada</span><strong>{{ cliente.proximaCompra }}</strong></p>
        </div>
      </article>

      <article class="panel-card table-card">
        <h2>Historial de compras</h2>
        <table>
          <thead><tr><th>Fecha</th><th>Monto</th><th>Puntos</th></tr></thead>
          <tbody>
            <tr v-for="compra in compras" :key="compra.id">
              <td>{{ formatDate(compra.fecha) }}</td>
              <td>${{ Number(compra.monto).toFixed(2) }}</td>
              <td>{{ Math.floor(compra.monto) }} pts</td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>
  </section>
</template>

<script>
import { cargarDatos, getCliente, analizarCliente, comprasOrdenadas, formatDate, enviarTarjeta, previsualizarTarjetaCliente } from '../data/fidelidadStore'
import TarjetaPreviewModal from '../components/TarjetaPreviewModal.vue'

export default {
  name: 'ClientePerfil',
  components: { TarjetaPreviewModal },
  data() {
    return {
      enviando: false,
      mensajeTarjeta: '',
      errorTarjeta: false,
      previewVisible: false,
      previewHtml: '',
      previewCargando: false,
      previewError: ''
    }
  },
  mounted() {
    cargarDatos()
  },
  computed: {
    clienteBase() {
      return getCliente(this.$route.params.id)
    },
    cliente() {
      return this.clienteBase ? analizarCliente(this.clienteBase) : null
    },
    compras() {
      return this.clienteBase ? comprasOrdenadas(this.clienteBase).slice().reverse() : []
    }
  },
  methods: {
    formatDate,
    iniciales(nombre) {
      return String(nombre).split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase()
    },
    async enviarTarjetaCliente() {
      this.enviando = true
      this.mensajeTarjeta = ''
      this.errorTarjeta = false
      try {
        await enviarTarjeta(this.cliente.id)
        this.mensajeTarjeta = `Tarjeta enviada a ${this.cliente.email}`
      } catch (err) {
        this.errorTarjeta = true
        this.mensajeTarjeta = err?.response?.data?.error || 'No se pudo enviar la tarjeta de fidelidad'
      } finally {
        this.enviando = false
      }
    },
    async verTarjeta() {
      this.previewVisible = true
      this.previewCargando = true
      this.previewError = ''
      this.previewHtml = ''
      try {
        this.previewHtml = await previsualizarTarjetaCliente(this.cliente.id)
      } catch (err) {
        this.previewError = err?.response?.data?.error || 'No se pudo cargar la vista previa'
      } finally {
        this.previewCargando = false
      }
    }
  }
}
</script>

<style scoped>
.tarjeta-mensaje {
  margin: -8px 0 16px;
  color: #1e8449;
  font-size: 0.875rem;
}
.tarjeta-mensaje.error {
  color: #c0392b;
}
</style>

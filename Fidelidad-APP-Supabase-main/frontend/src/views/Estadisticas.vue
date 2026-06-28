<template>
  <section class="page fade-in">
    <div class="page-head">
      <div><p class="eyebrow">Analítica</p><h1>Estadísticas</h1></div>
    </div>

    <div class="stats-grid">
      <article class="stat-card"><span>Retención estimada</span><strong>{{ retornoPromedio }}%</strong></article>
      <article class="stat-card"><span>Promedio recompra</span><strong>{{ promedioRecompra }} días</strong></article>
      <article class="stat-card danger"><span>Clientes en riesgo</span><strong>{{ clientesRiesgo }}</strong></article>
      <article class="stat-card"><span>Regalos entregados</span><strong>{{ regalosEntregados }}</strong></article>
    </div>

    <article class="panel-card table-card">
      <h2>Indicadores por cliente</h2>
      <table>
        <thead><tr><th>Cliente</th><th>Nivel</th><th>Frecuencia</th><th>Prob. regreso</th><th>Estado</th></tr></thead>
        <tbody>
          <tr v-for="c in clientes" :key="c.id">
            <td>{{ c.nombre }}</td>
            <td><span class="badge" :class="nivelClass(c.nivel)">{{ c.nivel }}</span></td>
            <td>{{ c.frecuencia }}</td>
            <td>{{ c.probabilidadRetorno }}%</td>
            <td><span class="status" :class="c.estado === 'Activo' ? 'ok' : 'warn'">{{ c.estado }}</span></td>
          </tr>
        </tbody>
      </table>
    </article>
  </section>
</template>

<script>
import { cargarDatos, getClientesAnalizados, nivelClass } from '../data/fidelidadStore'

export default {
  name: 'Estadisticas',
  mounted() {
    cargarDatos()
  },
  computed: {
    clientes() {
      return getClientesAnalizados()
    },
    retornoPromedio() {
      if (!this.clientes.length) return 0
      return Math.round(this.clientes.reduce((t, c) => t + c.probabilidadRetorno, 0) / this.clientes.length)
    },
    promedioRecompra() {
      const intervalos = this.clientes.map(c => c.intervalo).filter(Boolean)
      if (!intervalos.length) return 0
      return (intervalos.reduce((t, x) => t + x, 0) / intervalos.length).toFixed(1)
    },
    clientesRiesgo() {
      return this.clientes.filter(c => c.estado !== 'Activo').length
    },
    regalosEntregados() {
      return this.clientes.reduce((t, c) => t + (c.recompensasEntregadas?.length || 0), 0)
    }
  },
  methods: { nivelClass }
}
</script>

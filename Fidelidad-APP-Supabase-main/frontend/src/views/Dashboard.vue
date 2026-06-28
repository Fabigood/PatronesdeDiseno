<template>
  <section class="page fade-in">
    <div class="page-head">
      <div>
        <p class="eyebrow">Resumen interno</p>
        <h1>Panel principal</h1>
      </div>
      <span class="date-pill">{{ fechaActual }}</span>
    </div>

    <div class="stats-grid">
      <article class="stat-card"><span>Clientes totales</span><strong>{{ clientes.length }}</strong></article>
      <article class="stat-card"><span>Compras registradas</span><strong>{{ totalCompras }}</strong></article>
      <article class="stat-card danger"><span>En riesgo</span><strong>{{ clientesRiesgo.length }}</strong></article>
      <article class="stat-card"><span>Prob. retorno prom.</span><strong>{{ retornoPromedio }}%</strong></article>
    </div>

    <div class="dashboard-grid">
      <article class="panel-card">
        <h2>Distribución por nivel interno</h2>
        <div class="level-row" v-for="nivel in niveles" :key="nivel.nombre">
          <span class="badge" :class="nivel.clase">{{ nivel.nombre }}</span>
          <div class="bar"><i :style="{ width: nivel.porcentaje + '%' }"></i></div>
          <strong>{{ nivel.total }}</strong>
        </div>
      </article>

      <article class="panel-card">
        <h2>Clientes en riesgo</h2>
        <div class="risk-row" v-for="c in clientesRiesgo" :key="c.id">
          <strong>{{ c.nombre }}</strong>
          <span>{{ c.probabilidadRetorno }}% retorno</span>
        </div>
        <p v-if="!clientesRiesgo.length" class="soft-link">No hay clientes en riesgo.</p>
      </article>
    </div>

    <article class="panel-card table-card">
      <h2>Últimas compras registradas</h2>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Puntos</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="compra in ultimasCompras" :key="compra.key">
            <td>{{ compra.cliente }}</td>
            <td>${{ compra.monto.toFixed(2) }}</td>
            <td>{{ compra.fecha }}</td>
            <td>{{ Math.floor(compra.monto) }} pts</td>
            <td><span class="status" :class="compra.estado === 'Activo' ? 'ok' : 'warn'">{{ compra.estado }}</span></td>
          </tr>
        </tbody>
      </table>
    </article>
  </section>
</template>
<script>
import { cargarDatos, getClientesAnalizados, nivelClass, formatDate } from '../data/fidelidadStore'

export default {
  name: 'Dashboard',
  mounted() {
    cargarDatos()
  },
  computed: {
    fechaActual() {
      return new Date().toLocaleDateString('es-EC')
    },
    clientes() {
      return getClientesAnalizados()
    },
    totalCompras() {
      return this.clientes.reduce((total, c) => total + c.totalCompras, 0)
    },
    retornoPromedio() {
      if (!this.clientes.length) return 0
      return Math.round(this.clientes.reduce((t, c) => t + c.probabilidadRetorno, 0) / this.clientes.length)
    },
    clientesRiesgo() {
      return this.clientes.filter(c => c.estado !== 'Activo')
    },
    niveles() {
      const base = ['Bronce', 'Plata', 'Oro']
      return base.map(nombre => {
        const total = this.clientes.filter(c => c.nivel === nombre).length
        return { nombre, total, clase: nivelClass(nombre), porcentaje: this.clientes.length ? Math.round((total / this.clientes.length) * 100) : 0 }
      })
    },
    ultimasCompras() {
      return this.clientes.flatMap(c => c.compras.map(compra => ({
        key: `${c.id}-${compra.id}`,
        cliente: c.nombre,
        monto: Number(compra.monto),
        fechaISO: compra.fecha,
        fecha: formatDate(compra.fecha),
        estado: c.estado
      }))).sort((a, b) => new Date(b.fechaISO) - new Date(a.fechaISO)).slice(0, 6)
    }
  }
}
</script>
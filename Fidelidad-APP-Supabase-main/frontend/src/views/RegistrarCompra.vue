<template>
  <section class="page fade-in">
    <div class="page-head">
      <div>
        <p class="eyebrow">Transacciones</p>
        <h1>Registrar compra</h1>
      </div>
    </div>

    <div class="two-cols">
      <article class="panel-card form-card">
        <h2>Datos de la compra</h2>

        <!-- ── Selector de cliente (Requisito 2: dropdown con búsqueda, no input FK) ── -->
        <label>Cliente <span class="required-mark">*</span></label>

        <!-- Campo de búsqueda para filtrar el dropdown -->
        <input
          v-model="busquedaCliente"
          class="search-inline"
          placeholder="Buscar cliente por nombre o correo…"
          @input="clienteId = null"
        />

        <select v-model.number="clienteId" size="5" class="select-list">
          <option v-if="clientesFiltrados.length === 0" disabled value="">Sin resultados</option>
          <option
            v-for="c in clientesFiltrados"
            :key="c.id"
            :value="c.id"
          >
            {{ c.nombre }} — {{ c.email }}
          </option>
        </select>

        <p class="helper-text" v-if="!clienteId">Busca y selecciona un cliente de la lista.</p>

        <template v-if="clienteId">
          <label>Monto ($)</label>
          <input v-model.number="monto" type="number" min="0" step="0.01" placeholder="0.00" />

          <label>Fecha</label>
          <input v-model="fecha" type="date" />

          <div class="points-preview">
            <span>Puntos a generar</span>
            <strong>{{ puntosGenerados }} pts</strong>
          </div>

          <div class="actions-row">
            <button class="primary-btn" @click="registrar">Registrar compra</button>
            <button class="ghost-btn" @click="limpiar">Limpiar</button>
          </div>
        </template>
      </article>

      <article class="panel-card profile-card" v-if="cliente">
        <h2>Perfil del cliente</h2>
        <div class="profile-head">
          <div class="avatar">{{ iniciales(cliente.nombre) }}</div>
          <div>
            <h3>{{ cliente.nombre }}</h3>
            <p>{{ cliente.email }}</p>
          </div>
          <span class="status" :class="cliente.estado === 'Activo' ? 'ok' : 'warn'">{{ cliente.estado }}</span>
        </div>

        <div class="info-list">
          <p><span>Nivel interno</span><strong><em class="badge" :class="nivelClass(cliente.nivel)">{{ cliente.nivel }}</em></strong></p>
          <p><span>Puntos acumulados</span><strong>{{ cliente.puntos }} pts</strong></p>
          <p><span>Frecuencia</span><strong>{{ cliente.frecuencia }}</strong></p>
          <p><span>Última compra</span><strong>{{ cliente.ultimaCompra }}</strong></p>
          <p><span>Próxima esperada</span><strong>{{ cliente.proximaCompra }}</strong></p>
          <p><span>Probabilidad de regreso</span><strong>{{ cliente.probabilidadRetorno }}%</strong></p>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { HOY, cargarDatos, getClientesAnalizados, registrarCompra, nivelClass } from '../data/fidelidadStore'

export default {
  name: 'RegistrarCompra',
  data() {
    return {
      clienteId: null,
      busquedaCliente: '',
      monto: null,
      fecha: HOY
    }
  },
  mounted() {
    cargarDatos()
  },
  computed: {
    clientes() {
      return getClientesAnalizados()
    },
    clientesFiltrados() {
      const term = this.busquedaCliente.trim().toLowerCase()
      if (!term) return this.clientes
      return this.clientes.filter(c =>
        (c.nombre + ' ' + c.email).toLowerCase().includes(term)
      )
    },
    cliente() {
      return this.clientes.find(c => c.id === this.clienteId) || null
    },
    puntosGenerados() {
      return this.monto > 0 ? Math.floor(this.monto) : 0
    }
  },
  methods: {
    nivelClass,
    iniciales(nombre) {
      return String(nombre).split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase()
    },
    async registrar() {
      if (!this.monto || this.monto <= 0 || !this.clienteId) return
      await registrarCompra(this.clienteId, this.monto, this.fecha)
      this.monto = null
    },
    limpiar() {
      this.monto = null
      this.fecha = HOY
      this.clienteId = null
      this.busquedaCliente = ''
    }
  }
}
</script>

<style scoped>
.required-mark {
  color: #e74c3c;
  font-size: 0.85em;
  margin-left: 2px;
}
.search-inline {
  width: 100%;
  margin-bottom: 6px;
  padding: 7px 10px;
  border: 1px solid var(--border, #ddd);
  border-radius: 6px;
  font-size: 0.9rem;
}
.select-list {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--border, #ddd);
  padding: 4px;
  font-size: 0.9rem;
  margin-bottom: 10px;
}
.select-list option {
  padding: 6px 8px;
}
</style>

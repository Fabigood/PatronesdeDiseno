<template>
  <section class="page fade-in">
    <div class="page-head">
      <div>
        <p class="eyebrow">Gestión</p>
        <h1>Clientes</h1>
      </div>
      <button class="primary-btn" @click="nuevo">Nuevo cliente</button>
    </div>

    <div class="crud-grid">
      <article class="panel-card form-card">
        <h2>{{ editando ? 'Editar cliente' : 'Registrar cliente' }}</h2>

        <label>Nombre</label>
        <input
          v-model="form.nombre"
          placeholder="Nombre completo"
          :class="{ 'input-error': errores.nombre }"
          @input="errores.nombre = ''"
        />
        <p class="field-error" v-if="errores.nombre">{{ errores.nombre }}</p>

        <label>Correo electrónico <span class="required-mark">*</span></label>
        <input
          v-model="form.email"
          placeholder="correo@email.com"
          :class="{ 'input-error': errores.email }"
          @input="errores.email = ''"
        />
        <p class="field-error" v-if="errores.email">{{ errores.email }}</p>

        <p class="helper-text">
          El correo es un dato sensible único por cliente. Será validado en el servidor antes de guardarse.
        </p>

        <div v-if="errorGeneral" class="alert-error">⚠ {{ errorGeneral }}</div>

        <div class="actions-row">
          <button class="primary-btn" @click="guardar" :disabled="guardando">
            {{ guardando ? 'Guardando…' : (editando ? 'Actualizar' : 'Agregar') }}
          </button>
          <button class="ghost-btn" v-if="editando" @click="cancelar">Cancelar</button>
        </div>
      </article>

      <article class="panel-card table-card">
        <div class="table-head">
          <h2>Listado de clientes</h2>
          <input v-model="filtro" class="search" placeholder="Buscar..." />
        </div>

        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Puntos</th>
              <th>Nivel interno</th>
              <th>Prob. retorno</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in clientesFiltrados" :key="c.id">
              <td><strong>{{ c.nombre }}</strong></td>
              <td>{{ c.email }}</td>
              <td>{{ c.puntos }} pts</td>
              <td><span class="badge" :class="nivelClass(c.nivel)">{{ c.nivel }}</span></td>
              <td><strong>{{ c.probabilidadRetorno }}%</strong></td>
              <td class="row-actions">
                <button @click="$router.push('/admin/clientes/' + c.id)">Ver</button>
                <button @click="editar(c)">Editar</button>
                <button class="delete" @click="eliminar(c.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>
  </section>
</template>

<script>
import { cargarDatos, getClientesAnalizados, guardarCliente, eliminarCliente, nivelClass } from '../data/fidelidadStore'

export default {
  name: 'Clientes',
  data() {
    return {
      filtro: '',
      form: { id: null, nombre: '', email: '' },
      editando: null,
      guardando: false,
      errores: { nombre: '', email: '' },
      errorGeneral: ''
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
      const term = this.filtro.trim().toLowerCase()
      if (!term) return this.clientes
      return this.clientes.filter(c => (c.nombre + ' ' + c.email + ' ' + c.nivel).toLowerCase().includes(term))
    }
  },
  methods: {
    nivelClass,
    async guardar() {
      this.errores = { nombre: '', email: '' }
      this.errorGeneral = ''

      if (!this.form.nombre.trim()) {
        this.errores.nombre = 'El nombre es obligatorio'
        return
      }
      if (!this.form.email.trim()) {
        this.errores.email = 'El correo es obligatorio'
        return
      }

      this.guardando = true
      try {
        await guardarCliente({ ...this.form })
        this.cancelar()
      } catch (err) {
        const data = err?.response?.data
        if (data) {
          if (data.campo === 'email') {
            this.errores.email = data.error
          } else if (data.campo === 'nombre') {
            this.errores.nombre = data.error
          } else {
            this.errorGeneral = data.error || 'Error al guardar el cliente'
          }
        } else {
          this.errorGeneral = 'No se pudo conectar con el servidor'
        }
      } finally {
        this.guardando = false
      }
    },
    editar(c) {
      this.editando = c.id
      this.form = { id: c.id, nombre: c.nombre, email: c.email }
      this.errores = { nombre: '', email: '' }
      this.errorGeneral = ''
    },
    async eliminar(id) {
      if (!confirm('¿Eliminar este cliente?')) return
      await eliminarCliente(id)
    },
    cancelar() {
      this.editando = null
      this.form = { id: null, nombre: '', email: '' }
      this.errores = { nombre: '', email: '' }
      this.errorGeneral = ''
    },
    nuevo() {
      this.cancelar()
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
.input-error {
  border-color: #e74c3c !important;
  background: #fff5f5 !important;
}
.field-error {
  color: #e74c3c;
  font-size: 0.8rem;
  margin: -6px 0 6px;
}
.alert-error {
  background: #fdecea;
  border: 1px solid #e74c3c;
  color: #c0392b;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.875rem;
  margin-bottom: 10px;
}
</style>

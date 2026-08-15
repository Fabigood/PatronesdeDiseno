<template>
  <div v-if="visible" class="tarjeta-modal-overlay" @click.self="$emit('close')">
    <div class="tarjeta-modal-box">
      <button class="tarjeta-modal-close" type="button" @click="$emit('close')">✕</button>
      <div v-if="cargando" class="tarjeta-modal-loading">Cargando vista previa…</div>
      <div v-else-if="error" class="tarjeta-modal-error">⚠ {{ error }}</div>
      <iframe
        v-else
        :srcdoc="html"
        class="tarjeta-modal-frame"
        title="Vista previa de tarjeta de fidelidad"
        sandbox=""
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TarjetaPreviewModal',
  props: {
    visible: { type: Boolean, default: false },
    html: { type: String, default: '' },
    cargando: { type: Boolean, default: false },
    error: { type: String, default: '' }
  },
  emits: ['close']
}
</script>

<style scoped>
.tarjeta-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}
.tarjeta-modal-box {
  position: relative;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
}
.tarjeta-modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}
.tarjeta-modal-frame {
  width: 100%;
  height: 560px;
  border: none;
  display: block;
}
.tarjeta-modal-loading,
.tarjeta-modal-error {
  padding: 40px 24px;
  text-align: center;
  color: #555;
}
.tarjeta-modal-error {
  color: #c0392b;
}
</style>

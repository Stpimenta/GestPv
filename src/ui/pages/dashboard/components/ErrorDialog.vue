<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
  message: string
  header?: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const isVisible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit('update:visible', val)
})
</script>

<template>
  <Dialog v-model:visible="isVisible" modal :header="header ?? 'Erro'" :style="{ width: '25rem' }">

    <div class="error-dialog-content">
      <i class="pi pi-exclamation-circle error-icon"></i>
      <p class="error-message">{{ message }}</p>
    </div>

    <div class="error-dialog-div-btn">
      <Button
        type="button"
        severity="danger"
        label="Entendi"
        @click="isVisible = false"
      />
    </div>

  </Dialog>
</template>

<style scoped>
.error-dialog-content {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.error-icon {
  font-size: 2rem;
  color: #ff7878;
}

.error-message {
  font-size: 1.2rem;
}

.error-dialog-div-btn {
  margin-top: 1.2rem;
  display: flex;
  justify-content: end;
}
</style>

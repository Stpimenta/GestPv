<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  label: {
    type: String,
    default: 'Selecione seus arquivos'
  }
})

const emit = defineEmits(['update:modelValue'])

const files = ref([...props.modelValue])

function onSelect(event) {
  const selected = Array.from(event.target.files).map(file => ({
    file,
    name: file.name,
    size: file.size,
    preview: URL.createObjectURL(file)
  }))

  files.value.push(...selected)
  emit('update:modelValue', files.value)
}

function removeFile(index) {
  URL.revokeObjectURL(files.value[index].preview)
  files.value.splice(index, 1)
  emit('update:modelValue', files.value)
}

function formatSize(size) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
</script>



<template>
  <div class="file-input">
    <label class="drop-area">
      <input
        type="file"
        multiple
        :accept="accept"
        hidden
        @change="onSelect"
      />

      <i class="pi pi-cloud-upload"></i>
      <p>{{ label }}</p>
    </label>

    <div v-if="files.length" class="file-list">
      <div
        v-for="(file, index) in files"
        :key="file.name + index"
        class="file-item"
      >
        <img :src="file.preview" />

        <div class="info">
          <span class="name">{{ file.name }}</span>
          <span class="size">{{ formatSize(file.size) }}</span>
        </div>

        <button
          type="button"
          class="remove-btn"
          @click="removeFile(index)"
          aria-label="Remover arquivo"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.file-input {
  width: 100%;
}

.drop-area {
  border: 2px dashed #cfcfcf;
  border-radius: 8px;
  padding: 32px;
  cursor: pointer;
  transition: border-color 0.2s;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.drop-area:hover {
  border-color: #888787;
}

.drop-area i {
  font-size: 42px;
  color: var(--p-primary-color);
}

.drop-area p {
  margin: 0;
  font-size: 14px;
  color: var(--p-primary-color);
}

.file-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-item img {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 4px;
}

.file-item .info {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  flex: 1;
}

.file-item .name {
  font-weight: 600;
}

.file-item .size {
  color: #777;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #d9534f;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.remove-btn:hover {
  color: #a71d2a;
}
</style>

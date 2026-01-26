<script setup>
import { ref, onMounted } from 'vue'

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
  },

  existingImages: {
    type: Array,
    default: () => []
  },

  maxSizeMb: {
    type: Number,
    default: 2
  },
  maxFiles: {
    type: Number,
    default: 5
  }
})

defineExpose({
  clear
});

const emit = defineEmits(['update:modelValue'], ['remove-existing']);

const internalFiles = ref([]);
const errorMessage = ref('');

function onSelect(event) {
  const inputFiles = Array.from(event.target.files)
  const maxSizeBytes = props.maxSizeMb * 1024 * 1024

  errorMessage.value = ''

  if (props.modelValue.length + inputFiles.length > props.maxFiles) {
    errorMessage.value = `Você pode selecionar no máximo ${props.maxFiles} arquivos`
    event.target.value = ''
    return
  }

  const acceptedFiles = []

  for (const file of inputFiles) {
    if (file.size > maxSizeBytes) {
      errorMessage.value = `O arquivo "${file.name}" excede ${props.maxSizeMb} MB`
      continue
    }

    acceptedFiles.push(file)

    internalFiles.value.push({
      file,
      name: file.name,
      size: file.size,
      preview: file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : null
    })
  }

  if (acceptedFiles.length) {
    emit('update:modelValue', [...props.modelValue, ...acceptedFiles])
  }

  event.target.value = ''
}

function removeFile(index) {
  const removed = internalFiles.value[index]

  if (removed.preview) {
    URL.revokeObjectURL(removed.preview)
  }

  internalFiles.value.splice(index, 1)

  const newFiles = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', newFiles)
}

function formatSize(size) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function clear() {
  internalFiles.value.forEach(f => {
    if (f.preview) URL.revokeObjectURL(f.preview)
  })

  internalFiles.value = []
  errorMessage.value = ''

  emit('update:modelValue', [])
}

//exist Image
const removeExisting = (image) => {
  emit('remove-existing', image.id)
}

const getFileType = (url) => {

  if (!url)
    return

  const ext = url.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'doc';

  return 'other';
};

</script>



<template>
  <div class="file-input">
    <label class="drop-area">
      <input type="file"  accept="image/*,.pdf,.doc,.docx" capture="environment" hidden @change="onSelect" />

      <i class="pi pi-cloud-upload"></i>
      <p>{{ label }}</p>
    </label>

    <!-- Preview arquivos novos -->
    <div v-if="internalFiles.length" class="file-list">
      <div v-for="(file, index) in internalFiles" :key="file.name + index" class="file-item">
        <img v-if="file.preview || file.type?.startsWith('image')" :src="file.preview || URL.createObjectURL(file)" />
        <i v-else class="pi pi-file"></i>

        <div class="info">
          <span class="name">{{ file.name }}</span>
          <span class="size">{{ formatSize(file.size) }}</span>
        </div>

        <button type="button" class="remove-btn" @click="removeFile(index)">✕</button>
      </div>
    </div>

    <!-- Preview imagens existentes -->
    <div v-if="props.existingImages.length" class="file-list">
      <div v-for="image in props.existingImages" :key="image.id" class="file-item">
        <img v-if="getFileType(image.url) == 'image'" :src="image.presignedUrl" />

        <i v-else class="pi pi-file"></i>

        <div class="info">
          <span class="name">{{ image.url || 'Imagem' }}</span>
        </div>

        <button type="button" class="remove-btn" @click="removeExisting(image)">✕</button>
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

.error {
  margin-top: 8px;
  font-size: 13px;
  color: #d9534f;
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

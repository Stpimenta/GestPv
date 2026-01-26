<script setup>
import { computed, onMounted, ref } from 'vue'
import { boolean } from 'zod'

const props = defineProps({
    wallet: String,
    value: Number,
})

const formattedValue = computed(() => {
  if (props.value == null) return ''

  const sign = props.value < 0 ? '-' : '' 
  const valueBR = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Math.abs(props.value)) 

  return `${sign} ${valueBR}`
})

const dynamicColor = computed(() => {
  if (props.value == null) return '#27c76a' 
  return props.value < 0 ? '#FF4D40' : '#23E072' 
})


</script>


<template>
    <div class="wallet-card">
        <span class="bar" :style="{ backgroundColor: dynamicColor}"></span>

        <div class="wallet-div-actions">


            <i class="pi pi-wallet" :style="{ fontSize: '1.5rem', color: dynamicColor, }"></i>

            <div class="card-actions">
                <Button  icon="pi pi-pencil" severity="secondary" rounded @click="$emit('edit')" />
            </div>

        </div>

        <p class="p-wallet-name">{{ wallet }}</p>

        <div class="div-wallet-value">
            <p class="p-balance-label">Saldo Atual</p>
            <p class="p-balance" :style="{color: dynamicColor}">
                {{ formattedValue }}
            </p>
        </div>

    </div>
</template>


<style scoped>

.wallet-card {
    position: relative;
    background-color: var(--bg-surface);
    width: 300px;
    height: 200px;
    padding: 30px 16px 16px 20px;
    border-radius: 12px 12px 12px 12px;

    transition: none !important;
    justify-content: center;
    align-items: center;
}

.wallet-div-actions {
    display: flex;
    justify-content: space-between;
    height: 3rem;
    margin-bottom: 0.5rem;
    align-items: center;
}

.p-wallet-name {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

.div-wallet-value {
    display: flex;
    gap:0.2rem;
    flex-direction: column;
}

.p-balance-label {
  color: var(--text-muted);
}

.p-balance{
     font-size: 1.3rem;
}

.bar {
    position: absolute;
    left: 0;
    top: 1px;
    width: 100%;
    height: 8px;
    border-radius: 16px 16px 0 0;
}


</style>

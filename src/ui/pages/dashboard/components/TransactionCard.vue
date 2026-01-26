<script setup>
import { computed } from 'vue'
import { boolean } from 'zod'

const props = defineProps({
  name: String,
  description: String,
  wallet: String,
  date: String,
  value: Number,
  hyphen: boolean,

  barColor: {
    type: String,
    default: '#2ebb68',
  },
})

const formattedValue = computed(() => {
  if (props.value == null) return '-'

  const sign = props.hyphen ? '-' : '+'

  const valueBR = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Math.abs(props.value))

  return `${sign} ${valueBR}`
})

</script>


<template>
  <div class="expenses-card">
    <span class="bar" :style="{ backgroundColor: barColor }"></span>
    <div class="expenses-div-actions-wallet">

      <div class="card-actions">
        <Button icon="pi pi-eye" severity="secondary" rounded @click="$emit('view')" />
        <Button icon="pi pi-trash" severity="secondary" rounded @click="$emit('delete')" />
      </div>

      <h6 :style="{ color: barColor }">{{ type }}</h6>
      <h5>{{ description }}</h5>

      <p class="wallet-div">{{ wallet }}</p>
    </div>


    <div class="expenses-div-data-value">
      <div class="div-icon-date">
        <i class="pi pi-calendar"></i>
        <p>{{ date }}</p>
      </div>

      <p :style="{ color: barColor }" class="p-value">
        {{ formattedValue }}
      </p>
    </div>

   
    
  </div>
</template>


<style scoped>
.div-icon-date {
  display: flex;
  gap: 5px;
  align-items: center;
  opacity: 0.65;
}

.wallet-div {
  opacity: 0.65;
  font-size: 15px;
}

.p-value {
  color: #27c76a;
  font-weight: 700;
  font-size: 18px;
}

.expenses-card {
  position: relative;
  background-color: var(--bg-surface);
  width: 300px;
  height: 140px;
  padding: 16px 16px 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .08);
  transition: none !important;
  justify-content: center;
  align-items: center;
}

.expenses-div-actions-wallet{
  display: flex;
  flex-direction: column;
  height: 80px;
}

.expenses-div-data-value {
  display: flex;
  justify-content: space-between;
  height: 30px;
}





/* side bar */
.bar {
  position: absolute;
  left: 0;
  top: 0;
  width: 7px;
  height: 100%;
  border-radius: 12px 0 0 12px;
}

.expenses-card h6 {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  color: #27c76a;
}

.expenses-card h5 {
  margin: 4px 0 12px;
  font-size: 16px;
}

.expenses-card p {
  margin: 4px 0;
}

/* actions */
.card-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s ease;


  background-color: var(--bg-surface);
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
  
}

.expenses-card:hover .card-actions {
  opacity: 1;
  pointer-events: auto;
}
</style>

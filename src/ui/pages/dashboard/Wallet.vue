<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import WalletCard from './components/WalletCard.vue'
import WalletEntryDialog from './components/WalletEntryDialog.vue'
import { useWalletStore } from '@/stores';
import { useConfirm } from "primevue/useconfirm";
import debounce from "lodash-es/debounce";
import ErrorDialog from './components/ErrorDialog.vue';



const useConfirmDialog = useConfirm();
const walletStore = useWalletStore();

//default query | FILTER
const showFilters = ref(false);

const query = ref({
  descricao: '',
  idCaixa: undefined,
  initialDate: null,
  finalDate: null,
});

//clear | FILTER
const onClearFilter = async () => {
  query.value = {
    descricao: '',
    idCaixa: undefined,
    initialDate: null,
    finalDate: null,
  }
}

// watch for query | FILTER
watch(
  () => [
    query.value.descricao,
    query.value.idCaixa,
    query.value.initialDate,
    query.value.finalDate,
  ],
  () => {
    debouncedFilter();
  }
);

//scroll observer
const sentinel = ref(null);
let observer;

//onMounter
onMounted(async () => {
  // |PAGE
  await walletStore.fetchWallets();

});

// Error |ERROR MODAL
const EDvisible = ref(false)
const EDerror = ref('')

watch(
  () => walletStore.error,
  (error) => {
    if (error) {
      EDvisible.value = true;
      EDerror.value = error;
      walletStore.error = "";
    }
  }
)



//ADD WALLET DIALOG || EDIT
const visibleEntryDialog = ref(false);
const editingId = ref(null);

const openCreate = () => {
  editingId.value = null
  visibleEntryDialog.value = true
}

const openEdit = (id) => {
  editingId.value = id
  visibleEntryDialog.value = true
}


//DETAILS DIALOG
const visibleDetailsDialog = ref(false);
const detailsId = ref(null);

const openDetails = (id) => {
  detailsId.value = id
  visibleDetailsDialog.value = true
}

</script>

<template>

  <div class="main-div">

    <div class="title">
      <h2>Caixas</h2>
      <Button @click="openCreate()" type="button" label="Novo Caixa" icon="pi pi-plus" />
    </div>

    <!-- loading -->
    <div class="loading" v-if="walletStore.loading">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <!-- content -->
    <div class="content">
      <WalletCard v-for="item in walletStore.data || []" :key="item.id" 
        :wallet="item.nome"
        :value="item.valorTotal"
        @edit="openEdit(item.id)" 
       />
    </div>

  </div>


  <WalletEntryDialog
  v-model:visible="visibleEntryDialog"
  :editId="editingId"
  :title="editingId ? 'Editar Caixa' : 'Novo Caixa'"
  />

  <ErrorDialog v-model:visible="EDvisible" :message="EDerror" />

  


</template>


<style scoped>

.main-div {

  display: flex;
  flex: 1;
  max-width: 70rem;
  flex-direction: column;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;

}

.title {
  display: flex;
  width: 100%;
  height: 2rem;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.content {
  transition: all 0.2s ease;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-bottom: 1rem;
  overflow-y: auto;
}

.loading {
  display: flex;
  align-items: center;
  height: 100%;
}

.sentinel {
  height: 1px;
}

</style>

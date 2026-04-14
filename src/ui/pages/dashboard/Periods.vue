<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import PeriodCard from './components/PeriodCard.vue'
import PeriodEntryDialog from './components/PeriodEntryDialog.vue'
import PeriodDetailsDialog from './components/PeriodDetailsDialog.vue'
import { useWalletStore } from '@/stores';
import { useBlockedPeriodsStore } from '@/stores';
import { useConfirm } from "primevue/useconfirm";
import debounce from "lodash-es/debounce";
import ErrorDialog from './components/ErrorDialog.vue';
import { formatters } from '@/utils/formatters';


const useConfirmDialog = useConfirm();
const walletStore = useWalletStore();
const blockedPeriodsStore = useBlockedPeriodsStore();

//default query | FILTER
const showFilters = ref(false);

const query = ref({
  filterDate: null
});

//filter | FILTER
const onFilterChange = async () => {
  observer?.disconnect();
  expen();
  await blockedPeriodsStore.fetchBlockedPeriods(query.value)
  observer?.observe(sentinel.value);
};

//debounce | FILTER
const debouncedFilter = debounce(onFilterChange, 500);

//clear | FILTER
const onClearFilter = async () => {
  query.value = {
    filterDate: null
  }
}

//scroll observer
const sentinel = ref(null);
let observer;

//onMounter
onMounted(async () => {
  // |PAGE
  await blockedPeriodsStore.fetchBlockedPeriods();

});

// Error |ERROR MODAL
const EDvisible = ref(false)
const EDerror = ref('')

watch(
  () => blockedPeriodsStore.error,
  (error) => {
    if (error) {
      EDvisible.value = true;
      EDerror.value = error;
      blockedPeriodsStore.error = "";
    }
  }
)

//ADD BLOCK DIALOG || EDIT
const visibleEntryDialog = ref(false);
const editingId = ref(null);

const openCreate = () => {
  editingId.value = null;
  visibleEntryDialog.value = true;
}

const openEdit = (id) => {
  editingId.value = id;
  visibleEntryDialog.value = true;
}

//DETAILS DIALOG
const visibleDetailsDialog = ref(false);
const blockedPeriod = ref(null);

const openDetails = (item) => {
  blockedPeriod.value = item;
  visibleDetailsDialog.value = true;
}

</script>

<template>

  <div class="main-div">

    <div class="title">
      <h2>Fechamentos</h2>
      <Button @click="openCreate()" type="button" label="Fechamento" icon="pi pi-plus" />
    </div>

    <!-- loading -->
    <div class="loading" v-if="blockedPeriodsStore.loading">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <!-- content -->
    <div class="content">

      <PeriodCard v-for="item in blockedPeriodsStore.data?.items || []" :key="item.id"  :createdBy="item.blockedBy.nome"
        :description="item.description" :initialDate="formatters.dateBRL(item.startDate)" :finalDate="formatters.dateBRL(item.endDate)"
        :isBlocked="item.isBlocked" @details="() => openDetails(item)" />

    </div>

  </div>


  <PeriodEntryDialog v-model:visible="visibleEntryDialog" :editId="editingId"
    :title="editingId ? 'Editar Período' : 'Fechar Período'" />

  <PeriodDetailsDialog
    v-model:visible="visibleDetailsDialog"
    :blockedPeriod="blockedPeriod"
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
  gap: 1rem;

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

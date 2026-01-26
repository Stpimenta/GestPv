<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import TransactionCard from './components/TransactionCard.vue'
import ExpensesEntryDialog from './components/ExpenseEntryDialog.vue'
import { useWalletStore } from '@/stores';
import { useExpenseStore } from '@/stores/storeExpenses';
import { useConfirm } from "primevue/useconfirm";
import debounce from "lodash-es/debounce";
import ErrorDialog from './components/ErrorDialog.vue';
import ExpenseDetailsDialog from './components/ExpenseDetailsDialog.vue';


const useConfirmDialog = useConfirm();
const expenseStore = useExpenseStore();
const walletStore = useWalletStore();

//default query | FILTER
const showFilters = ref(false);

const query = ref({
  descricao: '',
  idCaixa: undefined,
  initialDate: null,
  finalDate: null,
});

//filter | FILTER
const onFilterChange = async () => {
  observer?.disconnect();
  expenseStore.resetExpenses();
  await expenseStore.fetchExpenses(query.value)
  observer?.observe(sentinel.value);
};

//debounce | FILTER
const debouncedFilter = debounce(onFilterChange, 500);

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
  await expenseStore.resetExpenses();
  await expenseStore.fetchExpenses(query.value)
  await walletStore.fetchWallets();

  //observer
  observer = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting) {
        expenseStore.fetchExpenses(query.value);
      }
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }
  );

  if (sentinel.value) {
    observer.observe(sentinel.value);
  }

});

// Error |ERROR MODAL
const EDvisible = ref(false)
const EDerror = ref('')

watch(
  () => expenseStore.error,
  (error) => {
    if (error) {
      EDvisible.value = true;
      EDerror.value = error;
      expenseStore.error = "";
    }
  }
)

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

//ADD EXPENSE DIALOG || EDIT
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

//DELETE DIALOG
const confirmRemove = (item) => {
  useConfirmDialog.require({
    message: `Deseja deletar "${item.descricao}"?`,
    header: 'Zona Perigosa',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'SIm',
      severity: 'danger'
    },
    accept: async () => {
      await expenseStore.deleteExpense(item);
    },
    reject: () => {

    }
  });
};

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
      <h2>Saídas</h2>
      <Button @click="openCreate()" type="button" label="Nova Saída" icon="pi pi-plus" />
    </div>

    <!-- ToolBar -->
    <div class="tool-bar-wrapper">
      <div class="tool-bar">

        <div class="search-input">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText class="full-width" v-model="query.descricao" placeholder="Search" />
          </IconField>
        </div>


        <Button type="button" label="Filtros Avançados" icon="pi pi-filter" @click="showFilters = !showFilters" />
        <!-- Filters-->
        <div v-if="showFilters" class="filter-bar">
          <Calendar v-model="query.initialDate" placeholder="Data início" dateFormat="dd/mm/yy" class="" />
          <Calendar v-model="query.finalDate" placeholder="Data fim" dateFormat="dd/mm/yy" class="" />
          <Select v-model="query.idCaixa" :options="walletStore.data" optionLabel="nome" optionValue="id"
            placeholder="Caixa" :loading="walletStore.loading" class="filter-field" />
          <Button label="Limpar" @click="onClearFilter" severity="danger" variant="text" class="filter-field" />
        </div>
      </div>

    </div>



    <div class="loading" v-if="expenseStore.loading && expenseStore.data == null">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <!-- content -->
    <div class="content">
      <TransactionCard v-for="item in expenseStore.data?.items || []" :key="item.id" :type="'despesa'"
        :description="item.descricao" :wallet="item.caixa"
        :date="new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })" :value="item.valor"
        :barColor="'#ea5455'" :hyphen="true" @edit="openEdit(item.id)" @delete="confirmRemove(item)" 
        @view="openDetails(item.id)"/>
    </div>

    <div class="" v-if="expenseStore.loading && expenseStore.data != null">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <div ref="sentinel" class="sentinel"></div>
  </div>


  <ExpensesEntryDialog
  v-model:visible="visibleEntryDialog"
  :editId="editingId"
  :title="editingId ? 'Editar Saída' : 'Nova Saída'"
  />
  <ErrorDialog v-model:visible="EDvisible" :message="EDerror" />
  <ConfirmDialog></ConfirmDialog>
  
  <ExpenseDetailsDialog
    v-model:visible="visibleDetailsDialog"
    :detailsId="detailsId"
    @edit="openEdit"
  />

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
}

.tool-bar-wrapper {
  width: 100%;
  background-color: var(--bg-surface);
  border-radius: 1rem;
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.tool-bar {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

}


.tool-bar Button {
  height: 2rem;
}

.search-input {
  width: 80%;
  margin-right: 1rem;
}

.full-width {
  width: 100%;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  margin-top: 0.5rem;
  justify-content: center;
  border-top: 0.2px solid var(--border-subtle);

}

.filter-field {
  width: 190px;
}

.content {
  transition: all 0.2s ease;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-bottom: 1rem;
  /*scroll*/
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

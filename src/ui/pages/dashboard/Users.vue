<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import TransactionCard from './components/TransactionCard.vue'
import ExpensesEntryDialog from './components/UserEntryDialog.vue'
import { useWalletStore } from '@/stores';
import { useExpenseStore } from '@/stores/storeExpenses';
import { useMemberStore } from '@/stores/storeMember';
import { useConfirm } from "primevue/useconfirm";
import debounce from "lodash-es/debounce";
import ErrorDialog from './components/ErrorDialog.vue';
import UserDetailsDialog from './components/UserDetailsDialog.vue';
import UserCard from './components/UserCard.vue';
import { EnumRole, roleMap } from './../../../api/memberApi';

const useConfirmDialog = useConfirm();
const expenseStore = useExpenseStore();
const walletStore = useWalletStore();

const memberStore = useMemberStore();

//default query | FILTER
const showFilters = ref(false);

const query = ref({
  nome: '',
  token: undefined,
});

//filter | FILTER
const onFilterChange = async () => {
  observer?.disconnect();
  memberStore.resetMembers();
  await memberStore.fetchMembers(query.value);
  observer?.observe(sentinel.value);
};

//debounce | FILTER
const debouncedFilter = debounce(onFilterChange, 500);

//clear | FILTER
const onClearFilter = async () => {
  query.value = {
    nome: '',
    token: undefined,
  }
}

// watch for query | FILTER
watch(
  () => [query.value.nome, query.value.token],
  () => {
    debouncedFilter();
  }
);

//scroll observer
const sentinel = ref(null);
let observer;

//onMounter
onMounted(async () => {

  // GET  PAGE
  await memberStore.resetMembers();
  await memberStore.fetchMembers(query.value);

  //observer
  observer = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting) {
        memberStore.fetchMembers(query.value);
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
  () => memberStore.error,
  (error) => {
    if (error) {
      EDvisible.value = true;
      EDerror.value = error;
      memberStore.error = '';
    }
  }
);




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
    message: `Deseja deletar "${item.nome}"?`,
    header: 'Zona Perigosa',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Sim',
      severity: 'danger'
    },
    accept: async () => {
      // se houver service de delete, chamar aqui
      // await memberService.delete(member.id);
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
      <h2>Usuários</h2>
      <Button @click="openCreate()" type="button" label="Novo Usuário" icon="pi pi-plus" />
    </div>

    <!-- ToolBar -->
    <div class="tool-bar-wrapper">
      <div class="tool-bar">

        <div class="search-input">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText class="full-width" v-model="query.nome" placeholder="Search" />
          </IconField>
        </div>


        <!-- <Button type="button" label="Filtros Avançados" icon="pi pi-filter" @click="showFilters = !showFilters" /> -->
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

    <div class="content">

      <UserCard v-for="member in memberStore.data?.items || []" :key="member.id" :name="member.nome"
        :email="member.email" :token="member.tokenContribuicao" :role="roleMap[member.role]"
        :avatarLabel="member.nome[0]" @details="() => openDetails(member.id)" @delete="() => confirmRemove(member)" />
      <!-- <UserCard :name="'Sergio Aasdasda Sasdadasdsaasdasda asdadas'" :email="'padrao20240715085309@ibpv.com'" :token="'abc123'"
        :role="'Administrador'" :avatarLabel="'S'" @details="() => console.log('Abrindo detalhes')"
        @delete="() => console.log('Remover usuário')" /> -->
    </div>


    <div ref="sentinel" class="sentinel"></div>
  </div>


  <ExpensesEntryDialog v-model:visible="visibleEntryDialog" :editId="editingId"
    :title="editingId ? 'Editar Saída' : 'Novo Membro'" />
  <ErrorDialog v-model:visible="EDvisible" :message="EDerror" />
  <ConfirmDialog></ConfirmDialog>

  <UserDetailsDialog v-model:visible="visibleDetailsDialog" :detailsId="detailsId" @edit="openEdit" />

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
  overflow-y: auto;
  width: 100%;
}

.loading {
  display: flex;
  align-items: center;
  height: 100%;
}

.sentinel {
  height: 1px;
}

.body-card {
  min-height: 6rem;
  width: 70%;
  display: flex;
  flex-wrap: wrap;
  background-color: var(--bg-surface);
  border-radius: 0.8rem;
  padding: 1rem;
  gap: 1rem;
}

.card-informations {

  width: 65%;
  display: flex;
  align-items: center;

}

.div-card-buttons {

  display: flex;
  align-items: center;
  justify-content: end;
  gap: 1rem;
  width: 30%;

}

.card-buttons {
  height: 2rem;
}

.card-avatar {
  margin-right: 1rem;
}

.card-name-function {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.4rem;
  align-items: center;
}

.card-email-token {
  display: flex;
  gap: 1rem;
}

.card-token {
  display: flex;
  gap: 0.2rem;
}

.card-function {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  padding: 0.25rem 0.6rem;
  border-radius: 999px;

  background: rgba(161, 127, 219, 0.1);
  border: 1px solid rgb(144, 106, 211, 0.1);
}

.card-function i {
  font-size: 0.75rem;
  color: #8f52f0;
}

.card-function p {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  color: #8f52f0;
  letter-spacing: 0.3px;
}


.p-name {
  font-size: 1.2rem;
  font-weight: 580;


}

.muted {
  color: var(--text-muted);
}


@media (max-width: 1024px) {
  .body-card {
    width: 90%;
  }



}

@media (max-width: 640px) {
  .body-card {
    width: 100%;
  }

  .div-card-buttons {
    width: 100%;
  }

  /* .p-name {
    font-size: 1.2rem;
    font-weight: 580;

    max-width: 10rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  } */
}
</style>

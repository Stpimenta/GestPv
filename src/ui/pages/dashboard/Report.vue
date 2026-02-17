<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import TransactionCard from './components/TransactionCard.vue'
import { formatters } from '../../../utils/formatters';

import { useWalletStore } from '@/stores';
import { useFinancialReportStore } from '@/stores';

import { useConfirm } from "primevue/useconfirm";
import debounce from "lodash-es/debounce";
import ErrorDialog from './components/ErrorDialog.vue';



const useConfirmDialog = useConfirm();
const walletStore = useWalletStore();
const reportStore = useFinancialReportStore();

//default query | FILTER
const showFilters = ref(false);

const query = ref({
  walletId: null,
  date: null,
});

//filter | FILTER
const onFilterChange = async () => {

  if (!query.value.date || !query.value.walletId) {
    return
  }

  const date = new Date(query.value.date);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const walletId = query.value.walletId;
  await reportStore.fetchMonthlyReport(walletId, year, month);
  reportMonth.value = date;

  // console.log(reportStore.data);

};

//debounce | FILTER
const debouncedFilter = debounce(onFilterChange, 500);

// watch for query | FILTER
watch(
  () => [
    query.value.walletId,
    query.value.date
  ],
  () => {
    debouncedFilter();
  }
);

//ordering | FILTER
const order = ref({
  displayType: 0,
  isDescending: false
})

const displayOrderingOptions = [
  { label: 'Descrição', value: 0 },
  { label: 'Token', value: 1 }
]

watch(
  () => [
    order.value.displayType,
    order.value.isDescending
  ],
  () => {
    reportStore.invertListOrder()
  }
);


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


//format
const reportMonth = ref(null);
const previousMonthLabel = computed(() => {



  if (!reportMonth.value) return ''

  const date = new Date(reportMonth.value)
  date.setMonth(date.getMonth() + 1)

  return date
    .toLocaleDateString('pt-BR', { month: 'long' })
    .toUpperCase()
})

const currentMonthLabel = computed(() => {
  if (!reportMonth.value) return ''

  const date = new Date(reportMonth.value)

  return date
    .toLocaleDateString('pt-BR', { month: 'long' })
    .toUpperCase()
})


//downloading pdf reports

const downloadMonthlyReport = async () => {
  const walletId = query.value.walletId
  const date = new Date(query.value.date);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const pdfBlob = await reportStore.fetchMonthlyReportPdf(walletId, year, month);
  if (!pdfBlob) return;

  const url = window.URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Relatorio_${walletId}_${month}_${year}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const downloadMonthlySummary = async () => {

  const walletId = query.value.walletId
  const date = new Date(query.value.date);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const pdfBlob = await reportStore.fetchMonthlySummaryPdf(year, month);
  if (!pdfBlob) return;

  const url = window.URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Resumo_Saldos_${month}_${year}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};


//onMounter
const fetchCurrentMonth = async () => {
  if (walletStore.data.length < 2) return;

  const secondWallet = walletStore.data[1];
  const today = new Date();

  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  query.value.walletId = secondWallet.id;
  query.value.date = today;

  reportMonth.value = today;
};

onMounted(async () => {
  await walletStore.fetchWallets();
  await fetchCurrentMonth();
});


</script>

<template>

  <div class="main-div">

    <div class="title">
      <h2>Relatorio</h2>

      <div class="title-buttons">
        <Button @click="downloadMonthlyReport()" type="button" label="Relatório" icon="pi pi-download"
          :loading="reportStore.downloadingLoading" />

        <Button @click="downloadMonthlySummary()" type="button" label="Resumo" icon="pi pi-download"
          :loading="reportStore.downloadingLoading" />
      </div>

    </div>

    <!-- ToolBar -->
    <div class="tool-bar-wrapper">
      <div class="tool-bar">

        <div class="filter-bar">

          <div class="filter-bar-center">
            <DatePicker placeholder="Data" v-model="query.date" view="month" dateFormat="mm/yy" />
            <Select v-model="query.walletId" :options="walletStore.data" optionLabel="nome" optionValue="id"
              placeholder="Caixa" :loading="walletStore.loading" class="filter-field" />
            <Button type="button" label="Ordenação" :icon="order.isDescending ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
              @click="order.isDescending = !order.isDescending" />
            <!-- <Button type="button" label="Filtros Avançados" icon="pi pi-filter" @click="showFilters = !showFilters" /> -->
          </div>

        </div>

        <!-- orders -->
        <div v-if="showFilters" class="ordering-bar">

          <Select v-model="order.displayType" :options="displayOrderingOptions" optionLabel="label" optionValue="value"
            placeholder="Ordenação" class="filter-field" />

          <Button type="button" label="Ordenação" :icon="order.isDescending ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
            @click="order.isDescending = !order.isDescending" />

        </div>

      </div>

    </div>


    <div v-if="reportStore.data && !reportStore.loading" class="container-cards">

      <div class="card">
        <div>
          <p class="card-label">ENTRADAS</p>
          <p class="card-value" style="color: #23E072">
            {{ formatters.currencyBRL(reportStore.data.totalMonthlyContributions) }}
          </p>
        </div>
        <i class="pi pi-arrow-circle-up card-icon" style="color: #23E072"></i>
      </div>

      <div class="card">
        <div>
          <p class="card-label">SAIDAS</p>
          <p class="card-value" style="color: #FF4D40">
            {{ formatters.currencyBRL(reportStore.data.totalMonthlyExpenses) }}
          </p>
        </div>
        <i class="pi pi-arrow-circle-up card-icon" style="color: #FF4D40"></i>
      </div>

      <div class="card">
        <div>
          <p class="card-label">SALDO PARA {{ currentMonthLabel }}</p>
          <p class="card-value" style="color: #68B6FF">
            {{
              formatters.currencyBRL(
                reportStore.data.contributions?.length > 0
                  ? reportStore.data.balancePreviousMonth
                  : 0
              )
            }}
          </p>
        </div>
        <i class="pi pi-calendar card-icon" style="color: #68B6FF"></i>
      </div>

      <div class="card">
        <div>
          <p class="card-label">SALDO TOTAL</p>
          <p class="card-value" style="color: #5275E8">
            {{
              formatters.currencyBRL(
                reportStore.data.contributions?.length > 0
                  ? reportStore.data.balanceAtMonth
                  : 0
              )
            }}

          </p>
        </div>
        <i class="pi pi-chart-line card-icon" style="color: #1E40AF"></i>
      </div>

      <div class="card">
        <div>
          <p class="card-label">SALDO PARA {{ previousMonthLabel }}</p>
          <p class="card-value" style="color: #f59e0b">
            {{
              formatters.currencyBRL(
                reportStore.data.contributions?.length > 0
                  ? reportStore.data.balanceAtNextMonth
                  : 0
              )
            }}
          </p>
        </div>
        <i class="pi pi-calendar-plus card-icon" style="color: #f59e0b"></i>
      </div>

    </div>




    <div v-if="reportStore.data && !reportStore.loading" class="div-data-table">
      <h3>Entradas</h3>


      <DataTable :value="reportStore.data.contributions" scrollable scrollHeight="300px" stripedRows>

        <template #empty>
          <div style="text-align: center; padding: 1rem;">
            Sem entradas no período.
          </div>
        </template>


        <Column header="Descrição">
          <template #body="slotProps">
            {{
              slotProps.data.descricao && slotProps.data.descricao.trim() !== ""
                ? slotProps.data.descricao
                : slotProps.data.tokenMembro
            }}
          </template>
        </Column>



        <Column header="Data">
          <template #body="slotProps">
            {{ formatters.dateBRL(slotProps.data.data) }}
          </template>
        </Column>


        <Column header="Valor">
          <template #body="slotProps">
            <div style="text-align: right; color: #23E072;">
              {{ formatters.currencyBRL(slotProps.data.valor) }}
            </div>
          </template>
        </Column>
      </DataTable>


      <br />
      <br />

      <h3>Saídas</h3>
      <DataTable :value="reportStore.data.expenses" scrollable scrollHeight="300px" stripedRows>

        <template #empty>
          <div style="text-align: center; padding: 1rem;">
            Sem saídas no período.
          </div>
        </template>

        <Column header="Descrição">
          <template #body="slotProps">
            {{
              slotProps.data.descricao?.trim()
                ? slotProps.data.descricao
                : "-"
            }}
          </template>
        </Column>

        <Column header="Data">
          <template #body="slotProps">
            {{ formatters.dateBRL(slotProps.data.data) }}
          </template>
        </Column>

        <Column header="Valor">
          <template #body="slotProps">
            <div style="text-align: right; color: #ff4d4f;">
              {{ formatters.currencyBRL(slotProps.data.valor) }}
            </div>
          </template>
        </Column>

      </DataTable>


    </div>

    <div class="loading" v-if="reportStore.loading">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <ErrorDialog v-model:visible="EDvisible" :message="EDerror" />

  </div>




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

.title-buttons {
  display: flex;
  gap: 0.5rem;
  margin-left: 0.5rem;

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

.filter-bar {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.5rem;
}

.filter-bar-center {
  grid-column: 2;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-bar-button {
  grid-column: 3;
  justify-self: end;
  margin-right: 1rem;
}

.full-width {
  width: 100%;
}

.ordering-bar {
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

.loading {
  display: flex;
  align-items: center;
  height: 100%;
}


.container-cards {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  background-color: var(--bg-surface);
  border-radius: 0.6rem;

  height: 6rem;
  width: 16rem;

  padding: 1rem;


  display: flex;
  position: relative;

}

.card-label {
  color: var(--text-muted);
}

.card-value {
  font-size: 1.7rem;
}

.card-icon {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  font-size: 1.2rem;
}


.div-data-table {
  margin-top: 1rem;
  display: flex;
  width: 100%;
  flex-direction: column;
}

.div-report-resume {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;

}

.div-report-resume p {
  margin: 0;
}
</style>

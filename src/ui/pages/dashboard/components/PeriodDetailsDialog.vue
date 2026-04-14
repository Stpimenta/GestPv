<script setup>
import { reactive, ref, watch, computed } from 'vue';
import { z } from 'zod';
import { usePrimeVue } from 'primevue/config';
import FileInput from './FileInput.vue'
import { useToast } from 'primevue';
import { useEarnedStore } from '@/stores';
import { useWalletStore } from '@/stores';
import { userAuthStore } from '@/stores';
import { useBlockedPeriodsStore } from '@/stores';
import debounce from "lodash-es/debounce";
import TokenSelectorDialog from './TokenSelectorDialog.vue';
import { formatters } from '@/utils/formatters';

const walletStore = useWalletStore();
const earnedStore = useEarnedStore();
const authStore = userAuthStore();
const blockedPeriodsStore = useBlockedPeriodsStore();

const props = defineProps({
    visible: { type: Boolean, required: true },
    title: { type: String, default: 'Detalhes' },
    blockedPeriod: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['update:visible', 'update:detailsId',])
const hasPosted = ref(false);


// // form items
// const form = reactive({
//     valor: null,
//     descricao: '',
//     data: null,
//     idCaixa: null,
//     tokenMembro: '',
//     urlEnvelope: '',
//     images: [{}],
// });


// //init form 
// const initForm = () => {

//     const data = earnedStore.earnedDetail;
//     if (!data) return;
//     const d = new Date(data.data);
//     form.data = new Date(
//         d.getUTCFullYear(),
//         d.getUTCMonth(),
//         d.getUTCDate()
//     );
//     form.valor = data.valor ?? null;
//     form.descricao = data.descricao ?? '';
//     form.idCaixa = data.idCaixa ?? null;
//     form.tokenMembro = data.tokenMembro ?? '';
//     form.urlEnvelope = data.urlEnvelope ?? '';
//     form.images = data.images;

// };


//open
watch(
    () => props.visible,
    async (isOpen) => {
        // if (isOpen) {

        //     await earnedStore.fetchEarnedById(props.detailsId)
        //     initForm();

        // }

        console.log(props.blockedPeriod)
    }
)


// // closeModal
// watch(
//     () => props.visible,
//     (val) => {
//         if (!val)
//             closeDialog();
//     }
// );

// const closeDialog = () => {

//     if (props.visible) {
//         emit('update:visible', false);
//     }

// }

// // onedit
// // const onEdit = (id) => {
// //     closeDialog();
// //     emit('edit', id)
// // }




const lockColor = computed(() =>
    props.blockedPeriod?.isBlocked ? '#ea5455' : '#4EC772'
);

/*progress*/

const activeUnlocks = computed(() =>
    props.blockedPeriod?.pendingUnlocks?.filter(x => x.isActive) || []
);

const totalRequired = computed(() => 2);

const approvedCount = computed(() => activeUnlocks.value.length);

const progressPercent = computed(() => {
    if (!totalRequired.value) return 0;

    return (approvedCount.value / totalRequired.value) * 100;
});


/* unlock status*/

const userId = computed(() =>
  Number(authStore.credentials?.sid)
);

const hasRequestedUnlock = computed(() =>
  props.blockedPeriod?.pendingUnlocks?.some(
    x =>
      x.blockUserId === userId.value &&
      x.isActive
  ) || false
);

const currentUserActiveUnlock = computed(() =>
  props.blockedPeriod?.pendingUnlocks?.some(
    x =>
      x.blockUserId === userId.value &&
      x.isActive
  ) || false
);

const canBlock = computed(() =>
    activeUnlocks.value.length >= 2
);

/*request unlock*/

const requestUnlock = async () => {
  if (!props.blockedPeriod?.id) return;

  const success = await blockedPeriodsStore.requestUnlock(props.blockedPeriod.id);

  if (!success) return;

  emit('update:visible', false);
  blockedPeriodsStore.resetBlockedPeriods();
  await blockedPeriodsStore.fetchBlockedPeriods();

};

/*request block*/

const reblock = async () => {
  if (!props.blockedPeriod?.id) return;

  const success = await blockedPeriodsStore.reblock(props.blockedPeriod.id);

  if (!success) return;

  emit('update:visible', false);

  blockedPeriodsStore.resetBlockedPeriods();
  await blockedPeriodsStore.fetchBlockedPeriods();
};


</script>

<template>

    <!-- form -->
    <Dialog :visible="visible" modal :header="title" :style="{ width: '30vw' }"
        :breakpoints="{ '720px': '90vw', '460px': '100vw' }" @update:visible="emit('update:visible', $event)">


        <template #header>
            <div class="div-header">
                <i class="pi pi-lock" :style="{ color: lockColor }" />

                <!-- <div class="div-header-desc">
                    <span class="bold ellipsis" v-if="!earnedStore.detailsLoading">{{ form.descricao ? form.descricao :
                        form.tokenMembro }}</span>
                    <span class="" v-if="!earnedStore.detailsLoading">{{ `${props.detailsId}` }}</span>
                </div> -->

            </div>
        </template>

        <!-- <div v-if="earnedStore.detailsLoading" class="loading-wrapper">
            <i class="pi pi-spin pi-spinner"></i>
        </div> -->

        <div>
            <div class="container-details">

                <div class="period-date">

                    <i class="pi pi-calendar"></i>

                    <div>
                        <p class="period-title">
                            Periodo Bloqueado
                        </p>

                        <p class="period-label">
                            {{ formatters.dateBRL(blockedPeriod.startDate) }} -
                            {{ formatters.dateBRL(blockedPeriod.endDate) }}
                        </p>
                    </div>
                </div>


                <div class="period-description">

                    <p>Descrição</p>


                    <p class="value">
                        {{ blockedPeriod.description ?? "Sem informação" }}
                    </p>

                </div>




                <div class="period-unlock-bar">

                    <div class="period-unlock-bar-title">
                        <p>Progresso</p>
                        <p>{{ approvedCount }}/{{ totalRequired }}</p>
                    </div>

                    <div class="progress-container">
                        <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
                    </div>

                    <div class="div-unlock-by" v-for="item in activeUnlocks" :key="item.id">
                        <i class="pi pi-check-circle"></i>
                        <p>{{ item.blockedUser.nome }}</p>
                    </div>

                </div>

                <div class="div-button-options">

                
                    <Button v-if="canBlock" class="period-unlock-button" label="Bloquear" severity="warn"
                        icon="pi pi-lock" @click="reblock"/>

            
                    <Button v-else-if="hasRequestedUnlock" class="period-unlock-button" label="Você já aprovou"
                        severity="secondary" icon="pi pi-lock-open" disabled />

                   
                    <Button v-else class="period-unlock-button" label="Solicitar Desbloqueio" severity="danger"
                        icon="pi pi-lock-open" @click="requestUnlock" />

                </div>



                <!-- <div class="details-card">

                    <p class="details-label">
                        Caixa
                    </p>
                  
                </div>


                <div class="details-card">

                    <p class="details-label">
                        Data
                    </p>
                   
                </div> -->

                <!-- <div v-if="form.tokenMembro && form.descricao" class="details-card">

                    <p class="details-label">
                        Token Membro
                    </p>
                   

                </div> -->


            </div>

        </div>


        <!-- btns -->
        <div class="btn-row">
            <!-- <Button type="submit" @click="onEdit(props.detailsId)" label="Editar" icon="pi pi-pencil"
                severity="secondary" class="exit-button" :disabled="earnedStore.detailsLoading" /> -->
            <Button type="submit" @click="closeDialog" label="Fechar" severity="primary" class="exit-button"
                :disabled="earnedStore.detailsLoading" />
        </div>

    </Dialog>


</template>



<style scoped>
.container-details {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.div-header {
    display: flex;
    align-items: center;
    gap: 1rem;

}

.div-header i {
    font-size: 2rem;
}

.div-header-desc {
    display: flex;
    flex-direction: column;
}

.bold {
    font-size: 1.5rem;
    font-weight: 600px;
}

.ellipsis {
    max-width: 360px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}


.period-date {

    background-color: rgba(255, 99, 132, 0.08);
    border: 1px solid rgba(255, 99, 132, 0.2);
    border-radius: 8px;

    width: 20rem;
    height: 5rem;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    padding: 1rem;

}

.period-date i {

    font-size: 1.5rem;
    color: #ea5455;

}

.period-title {
    font-size: 1rem;
    font-weight: 600;
    color: #ea5455;
}

.period-label {
    font-size: 1.3rem;
    font-weight: 600;
}



.period-description {

    /* background-color: rgba(255, 99, 132, 0.08);
    border: 1px solid rgba(255, 99, 132, 0.2);
    border-radius: 8px; */

    width: 20rem;
    /* height: 5rem; */

    display: flex;
    flex-direction: column;

    gap: 1rem;



}

.period-description p {

    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text-muted);



}


.period-description .value {
    font-size: 0.9rem;

    background-color: var(--surface-elevated);
    border: 1px solid var(--surface-border);

    border-radius: 6px;
    padding: 0.5rem;
    height: 6rem;
    overflow-y: auto;

    white-space: normal;
    word-break: break-word;
}


.period-unlock-bar {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.period-unlock-bar-title {
    width: 20rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
}

/* barra */
.progress-container {
    width: 100%;
    height: 6px;
    background-color: var(--p-primary-800);
    border-radius: 999px;
    overflow: hidden;
}

.progress-fill {
    /* 1/2 */
    height: 100%;
    background-color: var(--p-primary-400);
    transition: width 0.3s ease;
}


.step {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--surface-border);
}


.period-unlock-button {
    width: 15rem;
}

.div-unlock-by {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.div-unlock-by i {
    color: #66e566;
}

.text-muted {
    color: var(--text-muted);
}

.div-button-options {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
}

.btn-row {
    display: flex;
    justify-content: end;
    gap: 1rem;
}


.loading-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4rem;
}

.loading-wrapper i {
    font-size: 2rem;
    color: var(--p-primary-800);
}
</style>
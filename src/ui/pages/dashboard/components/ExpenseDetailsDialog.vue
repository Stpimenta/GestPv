<script setup>
import { reactive, ref, watch, computed } from 'vue';
import { z } from 'zod';
import { usePrimeVue } from 'primevue/config';
import FileInput from './FileInput.vue';
import { useToast } from 'primevue';
import { useExpenseStore } from '@/stores';
import { useWalletStore } from '@/stores';
import debounce from "lodash-es/debounce";


const walletStore = useWalletStore();
const expenseStore = useExpenseStore();

const props = defineProps({
    visible: { type: Boolean, required: true },
    title: { type: String, default: 'Detalhes' },
    detailsId: {
        type: Number,
        default: null
    }
});

const emit = defineEmits(['update:visible', 'update:detailsId', 'edit'])
const hasPosted = ref(false);


// form items
const form = reactive({
    valor: null,
    descricao: '',
    numeroFiscal: '',
    idCaixa: null,
    data: '',
    images: [],

});

const getFileType = (file) => {
    const ext = file.url?.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'doc';

    return 'other';
};

//init form 
const initForm = async () => {

    const data = expenseStore.expenseUpdate;
    const d = new Date(data.data);
    form.data = new Date(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate()
    );
    form.valor = data.valor ?? null;
    form.descricao = data.descricao ?? '';
    form.idCaixa = data.idCaixa ?? null;
    form.urlComprovante = data.urlComprovante ?? '';
    form.numeroFiscal = data.numeroFiscal ?? '';
    form.images = data.images ? [...data.images] : [];
};

//open
watch(
    () => props.visible,
    async (isOpen) => {
        if (isOpen) {

            await expenseStore.fetchExpenseById(props.detailsId)
            initForm();

        }
    }
)

// closeModal
watch(
    () => props.visible,
    (val) => {
        if (!val)
            closeDialog();
    }
);

const closeDialog = () => {
    if (props.visible) {
        emit('update:visible', false);
    }
}

// onedit
const onEdit = (id) => {
    closeDialog();
    emit('edit', id)
}

//get wallet name
const walletName = computed(() => {
    const wallet = walletStore.data.find(
        w => w.id === form.idCaixa
    )
    return wallet ? wallet.nome : '-'
})

//formatDate
const formatDate = (value) => {
    if (!value) return '-'

    const date = new Date(value)

    if (isNaN(date.getTime())) return '-'

    return new Intl.DateTimeFormat('pt-BR').format(date)
}

</script>

<template>



    <!-- expense details -->
    <Dialog :visible="visible" modal :header="title" :style="{ width: '40vw' }"
        :breakpoints="{ '720px': '90vw', '460px': '100vw' }" @update:visible="emit('update:visible', $event)">


        <template #header>

            <div class="div-header">

                <i class="pi pi-arrow-circle-down" style="color: #ea5455;"></i>

                <div class="div-header-desc">
                    <span v-if="!expenseStore.detailsLoading" class="bold ellipsis">
                        {{ form.descricao }}
                    </span>
                    <span v-if="!expenseStore.detailsLoading" class="">{{ `${props.detailsId}` }}</span>
                </div>

            </div>

        </template>



        <div v-if="expenseStore.detailsLoading" class="loading-wrapper">
            <i class="pi pi-spin pi-spinner"></i>
        </div>

        <div v-else>
            <div class="container-details">

                <div class="details-card">

                    <p class="details-label">
                        Valor
                    </p>

                    <p class="details-cash">
                        {{ `- ${new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(form.valor)}` }}
                    </p>

                </div>

                <div class="details-card">
                    <p class="details-label">
                        Caixa
                    </p>
                    <p class="details-info">
                        {{ walletName }}
                    </p>
                </div>


                <div class="details-card">

                    <p class="details-label">
                        Data
                    </p>
                    <p class="details-info">
                        {{ formatDate(form.data) }}
                    </p>

                </div>

                <div v-if="form.numeroFiscal" class="details-card">

                    <p class="details-label">
                        Numero Fiscal
                    </p>
                    <p class="details-info">
                        {{ form.numeroFiscal }}
                    </p>

                </div>

            </div>

            <!-- Carousel -->
            <Carousel v-if="form.images.length" :value="form.images" :numVisible="1" :numScroll="1">
                <template #item="slotProps">
                    <div class="carousel-item-center">

                        <!-- IMG -->
                         <a v-if="getFileType(slotProps.data) === 'image'" :href="slotProps.data.presignedUrl"
                            target="_blank" rel="noopener" class="image-link">
                            <img :src="slotProps.data.presignedUrl" class="carousel-image" />
                        </a>

                        <!-- PDF -->
                        <div v-else-if="getFileType(slotProps.data) === 'pdf'" class="pdf-preview">
                            <div class="pdf-icon">
                                <i class="pi pi-file-pdf"></i>
                                <a :href="slotProps.data.presignedUrl" target="_blank" rel="noopener">
                                    Abrir PDF
                                </a>
                            </div>
                            <p>{{ slotProps.data.url }}</p>
                        </div>

                        <!-- DOC -->
                        <div v-else-if="getFileType(slotProps.data) === 'doc'" class="pdf-preview">
                            <div class="pdf-icon">
                                <i class="pi pi-file-word"></i>
                                <a :href="slotProps.data.presignedUrl" download target="_blank" rel="noopener">
                                    Baixar documento
                                </a>
                            </div>
                            <p>{{ slotProps.data.url }}</p>
                        </div>

                        <!-- OUTROS -->
                        <div v-else class="file-preview">
                            <i class="pi pi-file"></i>
                            <a :href="slotProps.data.presignedUrl" download target="_blank">
                                Baixar arquivo
                            </a>
                        </div>

                    </div>
                </template>
            </Carousel>

        </div>

        <!-- btns -->
        <div class="btn-row">
            <Button type="submit" @click="onEdit(props.detailsId)" label="Editar" icon="pi pi-pencil"
                severity="secondary" class="exit-button" :disabled="expenseStore.detailsLoading" />
            <Button type="submit" @click="closeDialog" label="Fechar" severity="primary" class="exit-button"
                :disabled="expenseStore.detailsLoading" />
        </div>


    </Dialog>


</template>


<style scoped>
.container-details {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
    justify-content: center;
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

.details-card {
    background-color: rgba(0, 123, 255, 0.08);
    border: 1px solid rgba(0, 123, 255, 0.2);
    border-radius: 8px;

    width: 12rem;
    height: 5rem;

    display: flex;
    justify-content: center;
    flex-direction: column;

    padding: 1rem;
}

.details-label {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-muted);
}

.details-cash {

    font-size: 1.3rem;
    font-weight: 600;
    color: #ea5455;

}

.details-info {
    max-width: 100%;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: anywhere;

    font-size: 1.1rem;
    font-weight: 600;
}

.image-carousel {
    margin: 1rem 0;
}

.carousel-item {
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.carousel-image {
    max-height: 200px;
    max-width: 100%;
    object-fit: contain;
    border-radius: 8px;
}

.image-link {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: zoom-in;
}

.btn-row {
    display: flex;
    justify-content: end;
    gap: 1rem;
}

.carousel-item-center {
    width: 100%;
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.carousel-image {
    max-width: 80%;
    max-height: 100%;
    object-fit: contain;
}

.pdf-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    flex-direction: column;
    text-align: center;
}

.pdf-preview i {
    font-size: 2rem;
}

.pdf-icon {
    display: flex;
    justify-content: center;
    align-items: center;
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
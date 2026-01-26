<script setup>

import { reactive, ref, watch } from 'vue';
import { z } from 'zod';
import { usePrimeVue } from 'primevue/config';
import FileInput from './FileInput.vue'
import { useToast } from 'primevue';
import { useWalletStore } from '@/stores';
import debounce from "lodash-es/debounce";



const walletStore = useWalletStore();

const props = defineProps({
    visible: { type: Boolean, required: true },
    title: { type: String, default: 'Novo Caixa' },
    editId: {
        type: Number,
        default: null
    }
});

const emit = defineEmits(['update:visible', 'update:editId']);

const hasPosted = ref(false);

//toast
const toast = useToast();

// form items
const form = reactive({
    nome: '',
});

// File Input
const fileInputRef = ref(null)
const files = ref([]);

const initForm = async () => {

    const data = walletStore.walletUpdate;
    form.nome = data.nome;

};

//open
watch(
    () => props.visible,
    async (isOpen) => {
        if (isOpen) {
            if (props.editId) {
                await walletStore.fetchWalletById(props.editId);
                initForm();
            }
        }
    }
)

// Errors
const errors = reactive({
    nome: '',
});

const clearError = (field) => {
    errors[field] = '';
};

// schema
const schema = z.object({
  nome: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(1, 'Nome é obrigatório')
    .max(20, 'Nome não pode ter mais de 20 caracteres'),
})

// closeModal
watch(
    () => props.visible,
    (val) => {
        if (!val)
            closeDialog();
    }
);

//clearDialog
const clearDialog = () => {
   
    form.nome = '';
    clearError('nome');
    if (props.editId) {
        emit('update:editId', null)
    }
};


const closeDialog = () => {

    if (props.visible) {
        emit('update:visible', false);
    }

    clearDialog();

    if (hasPosted.value) {
     
        walletStore.clearWallets();
        walletStore.fetchWallets();
        hasPosted.value = false;
    }
}

// submit Form
const debouncedCreateLoading = ref(false);
const setDebouncedLoading = debounce((val) => {
    debouncedCreateLoading.value = val;
}, 200);

watch(
    () => walletStore.createLoading,
    (val) => {
        setDebouncedLoading(val);
    },
    { immediate: true }
);

const onSubmit = async () => {
    Object.keys(errors).forEach(key => {
        errors[key] = ''
    });

    const result = schema.safeParse(form);

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        errors.nome = fieldErrors.nome?.[0] || '';
        return;
    }



    const payload = {
        ...form,
    };

    const isEdit = !!props.editId;
    const success = isEdit
        ? await walletStore.updateWallet(payload)
        : await walletStore.createWallet(payload);


    if (success) {
        if (isEdit) {
            toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Editado com Sucesso',
                life: 3000
            });
            hasPosted.value = true;
            closeDialog();
            return;
        }

        toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Salvo com Sucesso',
            life: 3000
        });
        hasPosted.value = true;
        clearDialog();
    }

};



</script>

<template>

    <Dialog :visible="visible" modal :header="title" :style="{ width: '30rem' }"
        @update:visible="emit('update:visible', $event)">

        <div class="form-wrapper" :class="{ loading: debouncedCreateLoading }">

            <div class="form">
                <div>
                    <InputText v-model="form.nome" placeholder="Nome" @input="clearError('nome')"
                        class="form-field" />
                    <Message v-if="errors.nome" severity="error" size="small" variant="simple">
                        {{ errors.nome }}
                    </Message>
                </div>
                  <!-- btns -->
                <div class="btn-row">
                    <Button @click="closeDialog" type="submit" label="Cancelar" severity="secondary"
                        class="exit-button" />
                    <Button @click="onSubmit" type="submit" label="Enviar" severity="primary" class="send-button" />
                </div>
            </div>

            <div v-if="debouncedCreateLoading" class="loading-overlay">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>

        </div>
    </Dialog>




</template>



<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-field {
    width: 100%;
}

.form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.form-row-field {
    width: 48%;

}

.btn-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.exit-button {
    width: 35%;
}

.send-button {
    width: 55%;
}

.form-wrapper {
    position: relative;
}

.form-wrapper.loading .form {
    opacity: 0.5;
    pointer-events: none;
}

.loading-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
    z-index: 10;
}
</style>
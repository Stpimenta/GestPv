<script setup>

import { reactive, ref, watch } from 'vue';
import { z } from 'zod';
import { usePrimeVue } from 'primevue/config';
import FileInput from './FileInput.vue'
import { useToast } from 'primevue';
import { useExpenseStore } from '@/stores/storeExpenses';
import { useWalletStore } from '@/stores';
import debounce from "lodash-es/debounce";


const expenseStore = useExpenseStore();
const walletStore = useWalletStore();

const props = defineProps({
    visible: { type: Boolean, required: true },
    title: { type: String, default: 'Nova Saída' },
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
    valor: null,
    descricao: '',
    numeroFiscal: '',
    idCaixa: null,
    data: '',
    urlComprovante: ' ',
    images: [],
});

// File Input
const fileInputRef = ref(null)
const files = ref([]);

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
    
    form.images = data.images;

};

//open
watch(
    () => props.visible,
    async (isOpen) => {
        if (isOpen) {
            if (props.editId) {
                await expenseStore.fetchExpenseById(props.editId);
                initForm();
            }
        }
    }
)

// Errors
const errors = reactive({
    valor: '',
    descricao: '',
    numeroFiscal: '',
    idCaixa: '',
    data: '',
    urlComprovante: '',
});

const clearError = (field) => {
    errors[field] = '';
};

// schema
const schema = z.object({
    valor: z
        .number()
        .nullable()
        .refine(v => v !== null, { message: 'Valor é obrigatório' })
        .refine(v => v !== null && v >= 0.01, { message: 'Valor deve ser maior que zero' }),


    descricao: z
        .string({ required_error: 'Descrição é obrigatória' })
        .min(1, 'Descrição é obrigatória'),

    idCaixa: z
        .number({ invalid_type_error: 'Caixa é obrigatória' })
        .nullable()
        .refine(v => v !== null, { message: 'Caixa é obrigatória' }),

    data: z
        .union([z.date(), z.string(), z.null()])
        .refine(v => v !== null && v !== '', { message: 'Data é obrigatória' })
        .refine(v => {
            const date = v instanceof Date ? v : new Date(v);
            return !isNaN(date.getTime());
        }, { message: 'Data inválida' })
        .refine(v => {
            const date = v instanceof Date ? v : new Date(v);
            return date <= new Date();
        }, { message: 'Data não pode estar no futuro' }),

    numeroFiscal: z
        .string()
        .optional(),

    urlComprovante: z
        .string()
        .optional(),
});

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
    form.valor = null;
    form.descricao = '';
    form.numeroFiscal = '';
    form.data = '';
    form.urlComprovante = ' ';
    fileInputRef.value?.clear();

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
        hasPosted.value = false;
        expenseStore.resetExpenses();
        expenseStore.fetchExpenses();
    }
}

// submit Form
const debouncedCreateLoading = ref(false);
const setDebouncedLoading = debounce((val) => {
    debouncedCreateLoading.value = val;
}, 200);

watch(
    () => expenseStore.createLoading,
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
        errors.valor = fieldErrors.valor?.[0] || '';
        errors.descricao = fieldErrors.descricao?.[0] || '';
        errors.numeroFiscal = fieldErrors.numeroFiscal?.[0] || '';
        errors.idCaixa = fieldErrors.idCaixa?.[0] || '';
        errors.data = fieldErrors.data?.[0] || '';
        errors.urlComprovante = fieldErrors.urlComprovante?.[0] || '';
        return;
    }



    const payload = {
        ...form,
        value: Number(form.value),
        files: ' ',
    };

    const isEdit = !!props.editId;

    // console.log(payload);

    const success = isEdit
        ? await expenseStore.updateExpense(payload, files.value)
        : await expenseStore.createExpense(payload, files.value);


    if (success) {
        if (isEdit) {
            toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Registro editado',
                life: 3000
            });
            hasPosted.value = true;
            closeDialog();
            return;
        }

        toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Registro salvo',
            life: 3000
        });
        hasPosted.value = true;
        clearDialog();
    }

};


// exist image
const onRemoveExisting = (id) => {
    form.images = form.images.filter(img => img.id !== id);
    console.log(form.images);
}

</script>

<template>
    <Dialog :visible="visible" modal :header="title" :style="{ width: '30rem' }"
        @update:visible="emit('update:visible', $event)">

        <div class="form-wrapper" :class="{ loading: debouncedCreateLoading }">
            <div class="form">

                <div>
                    <InputNumber @input="clearError('valor')" v-model="form.valor" mode="currency" currency="BRL"
                        locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" placeholder="R$ 0,00"
                        class="form-field" />
                    <Message v-if="errors.valor" severity="error" size="small" variant="simple">
                        {{ errors.valor }}
                    </Message>
                </div>


                <div>
                    <InputText v-model="form.descricao" placeholder="Descrição" @input="clearError('descricao')"
                        class="form-field" />
                    <Message v-if="errors.descricao" severity="error" size="small" variant="simple">
                        {{ errors.descricao }}
                    </Message>
                </div>


                <div>
                    <InputText v-model="form.numeroFiscal" placeholder="Numero Fiscal" @input="errors.email = ''"
                        class="form-field" />
                    <Message v-if="errors.numeroFiscal" severity="error" size="small" variant="simple">
                        {{ errors.numeroFiscal }}
                    </Message>
                </div>



                <div class="form-row">

                    <div class="form-row-field">
                        <Select v-model="form.idCaixa" :options="walletStore.data" optionLabel="nome" optionValue="id"
                            placeholder="Caixa" style="width: 100%;" @update:modelValue="clearError('idCaixa')" />
                        <Message v-if="errors.idCaixa" severity="error" size="small" variant="simple">
                            {{ errors.idCaixa }}
                        </Message>
                    </div>

                    <div class="form-row-field">
                        <DatePicker v-model="form.data" placeholder="Data" showIcon fluid iconDisplay="input"
                            inputId="icondisplay" @update:modelValue="clearError('data')" />
                        <Message v-if="errors.data" severity="error" size="small" variant="simple">
                            {{ errors.data }}
                        </Message>
                    </div>


                </div>


                <!-- file input -->
                <FileInput v-model="files" ref="fileInputRef" label="Anexar comprovantes" :max-files="4"
                    :max-size-mb="3" :existingImages="form.images" accept='image/*,.pdf,.doc,.docx' @remove-existing="onRemoveExisting" />

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
<script setup>

import { reactive, ref, watch } from 'vue';
import { z } from 'zod';
import { usePrimeVue } from 'primevue/config';
import FileInput from './FileInput.vue'
import { useToast } from 'primevue';
import { useEarnedStore } from '@/stores';
import { useWalletStore } from '@/stores';
import debounce from "lodash-es/debounce";



const walletStore = useWalletStore();
const earnedStore = useEarnedStore();

const props = defineProps({
    visible: { type: Boolean, required: true },
    title: { type: String, default: 'Nova Entrada' },
});

const emit = defineEmits(['update:visible']);
const hasPosted = ref(false);

//open
watch(
    () => props.visible,
    (isOpen) => {
        if (isOpen) {
            console.log("open dialog");
        }
    }
)

//toast
const toast = useToast();

// form items
const form = reactive({
    valor: null,
    descricao: '',
    data: '',
    idCaixa: null,
    tokenMembro: '',
    urlEnvelope: undefined,
});


// Errors
const errors = reactive({
    valor: '',
    descricao: '',
    data: '',
    idCaixa: '',
    tokenMembro: '',
    urlEnvelope: '',
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
        .refine(v => v !== null && v >= 0.01, {
            message: 'Valor deve ser maior que zero',
        }),

    descricao: z
        .string()
        .optional(),

    idCaixa: z
        .number()
        .nullable()
        .refine(v => v !== null, { message: 'Caixa é obrigatória' }),

    data: z
        .union([z.date(), z.string(), z.null()])
        .refine(v => v !== null && v !== '', {
            message: 'Data é obrigatória',
        })
        .refine(v => {
            const date = v instanceof Date ? v : new Date(v);
            return !isNaN(date.getTime());
        }, { message: 'Data inválida' })
        .refine(v => {
            const date = v instanceof Date ? v : new Date(v);
            return date <= new Date();
        }, { message: 'Data não pode estar no futuro' }),

    tokenMembro: z
        .string()
        .optional(),

    urlEnvelope: z
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
    form.data = '';
    form.idCaixa = null;
    form.tokenMembro = null;
    form.urlEnvelope = undefined;
};

const closeDialog = () => {

    if (props.visible) {
        emit('update:visible', false);
    }

    clearDialog();
    if (hasPosted.value) {
        hasPosted.value = false;
        earnedStore.resetEarneds();
        earnedStore.fetchEarneds();
    }
}

// submit Form
const debouncedCreateLoading = ref(false);
const setDebouncedLoading = debounce((val) => {
    debouncedCreateLoading.value = val;
}, 200);

watch(
    () => earnedStore.createLoading,
    (val) => {
        setDebouncedLoading(val);
    },
    { immediate: true }
);

const onSubmit = async () => {
    Object.keys(errors).forEach(key => {
        errors[key] = '';
    });

    const result = schema.safeParse(form);

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;

        errors.valor = fieldErrors.valor?.[0] || '';
        errors.descricao = fieldErrors.descricao?.[0] || '';
        errors.idCaixa = fieldErrors.idCaixa?.[0] || '';
        errors.data = fieldErrors.data?.[0] || '';
        errors.tokenMembro = fieldErrors.tokenMembro?.[0] || '';
        errors.urlEnvelope = fieldErrors.urlEnvelope?.[0] || '';

        console.log("sem sucesso");
        console.log(fieldErrors);
        return;
    }

    const payload = {
        ...form,
        value: Number(form.value),
        files: ' ',
    };

    console.log(payload);
    const success = await earnedStore.createEarned(payload);


    if (success) {

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


                <!-- <div>
                    <InputText v-model="form.numeroFiscal" placeholder="Numero Fiscal" @input="errors.email = ''"
                        class="form-field" />
                    <Message v-if="errors.numeroFiscal" severity="error" size="small" variant="simple">
                        {{ errors.numeroFiscal }}
                    </Message>
                </div> -->



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
                <FileInput v-model="files" />

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



<style>
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
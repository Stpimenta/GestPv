<script setup>

import { reactive, ref, watch } from 'vue';
import { z } from 'zod';
import { usePrimeVue } from 'primevue/config';
import FileInput from './FileInput.vue'
import { useToast } from 'primevue';
import { useExpenseStore } from '@/stores/storeExpenses';
import { useWalletStore } from '@/stores';
import debounce from "lodash-es/debounce";
import { genres, roles, estados, estadosCivis, paisesTelefone } from '@/constants/selectOptions'
import { useMemberStore } from '@/stores/storeMember';

const expenseStore = useExpenseStore();
const walletStore = useWalletStore();
const memberStore = useMemberStore();

const props = defineProps({
    visible: { type: Boolean, required: true },
    title: { type: String, default: 'Novo Membro' },
    editId: {
        type: Number,
        default: null
    }
});

const emit = defineEmits(['update:visible', 'update:editId']);

const hasPosted = ref(false);

//toast
const toast = useToast();

// File Input
const fileInputRef = ref(null)
const files = ref([]);

const form = reactive({
    nome: '',
    email: '',

    bairroEdereco: '',
    cidadeEndereco: '',
    ruaEdereco: '',
    cepEndereco: '',
    numeroEndereco: '',
    ufEndereco: '',

    data_nascimento: null,
    filhos: false,
    estadoCivil: '',
    genero: null,
    profissao: '',
    cpf: '',
    rgNumero: '',
    telefone_pais: '+55',
    telefoneNumero: '',

    complementoEndereco: '',
    dataBatismo: null,
    pastorBatismo: '',
    igrejaBatismo: '',

    rule: null,
    alarmAuth: false,
    urlImage: []
})


// Errors
const errors = reactive({
    nome: '',
    email: '',
    bairroEdereco: '',
    cidadeEndereco: '',
    ruaEdereco: '',
    cepEndereco: '',
    numeroEndereco: '',
    ufEndereco: '',
    data_nascimento: '',
    filhos: '',
    estadoCivil: '',
    rule: '',
    genero: '',
});

const clearError = (field) => {
    errors[field] = '';
};


const schema = z.object({

    nome: z
        .string({ required_error: 'Nome é obrigatório' })
        .min(6, 'Informe o nome completo'),

    email: z
        .string({ required_error: 'Email é obrigatório' })
        .email('Email inválido'),

    bairroEdereco: z
        .string({ required_error: 'Bairro é obrigatório' })
        .min(1, 'Bairro é obrigatório'),

    cidadeEndereco: z
        .string({ required_error: 'Cidade é obrigatória' })
        .min(1, 'Cidade é obrigatória'),

    ruaEdereco: z
        .string({ required_error: 'Rua é obrigatória' })
        .min(1, 'Rua é obrigatória'),

    cepEndereco: z
        .string({ required_error: 'CEP é obrigatório' })
        .min(1, 'CEP é obrigatório'),

    numeroEndereco: z
        .string({ required_error: 'Número é obrigatório' })
        .min(1, 'Número é obrigatório'),

    ufEndereco: z
        .string()
        .nonempty('UF é obrigatória')
        .min(2, 'UF inválida'),

    data_nascimento: z
        .union([z.date(), z.string(), z.null()])
        .refine(v => v !== null && v !== '', { message: 'Data de nascimento é obrigatória' })
        .refine(v => {
            const date = v instanceof Date ? v : new Date(v);
            return !isNaN(date.getTime());
        }, { message: 'Data inválida' })
        .refine(v => {
            const date = v instanceof Date ? v : new Date(v);
            return date <= new Date();
        }, { message: 'Data não pode estar no futuro' }),

    filhos: z.boolean({
        required_error: 'Informe se possui filhos'
    }),

    estadoCivil: z
        .string({ required_error: 'Estado civil é obrigatório' })
        .min(1, 'Informe um estado civil'),

    rule: z.number()
        .nullable()
        .refine(v => v !== null, {
            message: 'Escolha uma função'
        }),

    genero: z
        .number()
        .nullable()
        .refine(v => v !== null, {
            message: 'Escolha um Gênero'
        }),

    cpf: z.string().optional(),
    rgNumero: z.string().optional(),
    telefone_pais: z.string().optional(),
    telefoneNumero: z.string().optional(),
    complementoEndereco: z.string().optional(),
    dataBatismo: z.union([z.date(), z.string(), z.null()]).optional(),
    pastorBatismo: z.string().optional(),
    igrejaBatismo: z.string().optional(),
    profissao: z.string().optional(),
    alarmAuth: z.boolean().optional(),
});


const initForm = async () => {
    const data = memberStore.memberUpdate;

    if (!data) return;

    form.nome = data.nome ?? '';
    form.email = data.email ?? '';

    form.bairroEdereco = data.bairroEdereco ?? '';
    form.cidadeEndereco = data.cidadeEndereco ?? '';
    form.ruaEdereco = data.ruaEdereco ?? '';
    form.cepEndereco = data.cepEndereco ?? '';
    form.numeroEndereco = data.numeroEndereco ?? '';
    form.ufEndereco = data.ufEndereco ?? '';

    form.data_nascimento = data.data_nascimento
        ? new Date(data.data_nascimento)
        : null;

    form.filhos = data.filhos ?? false;
    form.estadoCivil = data.estadoCivil ?? '';
    form.genero = data.genero ?? null;
    form.profissao = data.profissao ?? '';

    form.cpf = data.cpf ?? '';
    form.rgNumero = data.rGnumero ?? '';

    form.telefone_pais = data.telefone_pais ?? '+';
    form.telefoneNumero = data.telefoneNumero ?? '';

    form.complementoEndereco = data.complementoEndereco ?? '';

    form.dataBatismo = data.dataBatismo
        ? new Date(data.dataBatismo)
        : null;

    form.pastorBatismo = data.pastorBatismo ?? '';
    form.igrejaBatismo = data.igrejaBatismo ?? '';

    form.rule = data.rule ?? null;
    form.alarmAuth = data.alarmAuth ?? false;

    form.urlImage = data.urlImage;
};

//open
watch(
    () => props.visible,
    async (isOpen) => {
        if (isOpen) {
            if (props.editId) {
                await memberStore.fetchMemberById(props.editId);
                initForm();
            }
        }
    }
)

//closeModal
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
    form.email = '';

    form.bairroEdereco = '';
    form.cidadeEndereco = '';
    form.ruaEdereco = '';
    form.cepEndereco = '';
    form.numeroEndereco = '';
    form.ufEndereco = '';

    form.data_nascimento = null;
    form.filhos = false;
    form.estadoCivil = '';
    form.genero = null;
    form.profissao = '';
    form.cpf = '';
    form.rgNumero = '';
    form.telefone_pais = '+55';
    form.telefoneNumero = '';

    form.complementoEndereco = '';
    form.dataBatismo = null;
    form.pastorBatismo = '';
    form.igrejaBatismo = '';

    form.rule = null;
    form.alarmAuth = false;


    fileInputRef.value?.clear();

    if (props.editId) {
        emit('update:editId', null)
    }
};

//close dialog
const closeDialog = () => {

    if (props.visible) {
        emit('update:visible', false);
    }

    clearDialog();

    if (hasPosted.value) {
        hasPosted.value = false;
        memberStore.resetMembers();
        memberStore.fetchMembers();
    }
}

// submit Form
const debouncedCreateLoading = ref(false);
const setDebouncedLoading = debounce((val) => {
    debouncedCreateLoading.value = val;
}, 200);

watch(
    () => memberStore.createLoading,
    (val) => {
        setDebouncedLoading(val);
    },
    { immediate: true }
);

const onSubmit = async () => {


    //Error Schema
    Object.keys(errors).forEach(key => {
        errors[key] = ''
    });

    const result = schema.safeParse(form);

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;

        errors.nome = fieldErrors.nome?.[0] || '';
        errors.email = fieldErrors.email?.[0] || '';
        errors.bairroEdereco = fieldErrors.bairroEdereco?.[0] || '';
        errors.cidadeEndereco = fieldErrors.cidadeEndereco?.[0] || '';
        errors.ruaEdereco = fieldErrors.ruaEdereco?.[0] || '';
        errors.cepEndereco = fieldErrors.cepEndereco?.[0] || '';
        errors.numeroEndereco = fieldErrors.numeroEndereco?.[0] || '';
        errors.ufEndereco = fieldErrors.ufEndereco?.[0] || '';
        errors.data_nascimento = fieldErrors.data_nascimento?.[0] || '';
        errors.filhos = fieldErrors.filhos?.[0] || '';
        errors.estadoCivil = fieldErrors.estadoCivil?.[0] || '';
        errors.status = fieldErrors.status?.[0] || '';
        errors.rule = fieldErrors.rule?.[0] || '';
        errors.genero = fieldErrors.genero?.[0] || '';

        // console.log(fieldErrors);
        return;
    }



    //is edit
    const isEdit = !!props.editId;
    let success = false;

    if (isEdit) {

        const mappedUpdate = {
            nome: form.nome,
            email: form.email,

            cpf: form.cpf || undefined,
            rgNumero: form.rgNumero || undefined,
            telefone_pais: form.telefone_pais || undefined,
            telefoneNumero: form.telefoneNumero || undefined,

            bairroEdereco: form.bairroEdereco,
            cidadeEndereco: form.cidadeEndereco,
            ruaEdereco: form.ruaEdereco,
            cepEndereco: form.cepEndereco,
            numeroEndereco: form.numeroEndereco,
            ufEndereco: form.ufEndereco,
            complementoEndereco: form.complementoEndereco || undefined,

            data_nascimento: form.data_nascimento,


            dataBatismo: form.dataBatismo,


            pastorBatismo: form.pastorBatismo || undefined,
            igrejaBatismo: form.igrejaBatismo || undefined,

            filhos: form.filhos,
            profissao: form.profissao || undefined,
            estadoCivil: form.estadoCivil,

            status: memberStore.memberUpdate?.status ?? 1,
            rule: Number(form.rule),
            genero: Number(form.genero),

            alarmAuth: form.alarmAuth ?? false,
            urlImage: form.urlImage ? [form.urlImage] : []
        };

        success = await memberStore.updateMember(mappedUpdate, files.value);

    } else {
        success = await memberStore.createMember(form, files.value);
    }

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


// // exist image
// function onRemoveExisting(image) {
//   form.urlImage = form.urlImage.filter(i => i.id !== image.id);
// }


</script>

<template>


    <Dialog :visible="visible" modal :header="title" :style="{ width: '35rem' }"
        @update:visible="emit('update:visible', $event)">


        <div class="form-wrapper" :class="{ loading: debouncedCreateLoading }">


            <div class="form">

                <h6 class="form-topics">Credenciais</h6>

                <div class="form-row">

                    <div class="form-row-field">
                        <InputText v-model="form.nome" placeholder="Nome" @input="clearError('nome')"
                            class="form-field" />
                        <Message v-if="errors.nome" severity="error" size="small" variant="simple">
                            {{ errors.nome }}
                        </Message>
                    </div>


                    <div class="form-row-field">
                        <InputText v-model="form.email" placeholder="Email" @input="clearError('email')"
                            class="form-field" />
                        <Message v-if="errors.email" severity="error" size="small" variant="simple">
                            {{ errors.email }}
                        </Message>
                    </div>

                </div>





                <h6>Pessoais</h6>

                <div class="form-row">
                    <div class="form-row-field">

                        <Select name="genero" v-model="form.genero" :options="genres" optionLabel="label"
                            optionValue="value" placeholder="Selecione o gênero" fluid class="form-field" />
                        <Message v-if="errors.genero" severity="error" size="small" variant="simple">
                            {{ errors.genero }}
                        </Message>

                    </div>

                    <div class="form-row-field">

                        <DatePicker v-model="form.data_nascimento" placeholder="Nascimento" showIcon fluid
                            iconDisplay="input" inputId="icondisplay"
                            @update:modelValue="clearError('data_nascimento')" />

                        <Message v-if="errors.data_nascimento" severity="error" size="small" variant="simple">
                            {{ errors.data_nascimento }}
                        </Message>

                    </div>



                    <div class="form-row-field">
                        <InputText v-model="form.profissao" placeholder="Profissão" @input="clearError('descricao')"
                            class="form-field" />
                    </div>

                    <div class="form-row-field">
                        <InputMask v-model="form.rgNumero" mask="99.999.999-9" placeholder="RG" class="form-field" />
                    </div>

                    <div class="form-row-field">
                        <InputMask v-model="form.cpf" mask="999.999.999-99" placeholder="CPF" class="form-field" />
                    </div>

                    <div class="form-row-field">
                        <Select name="estadoCivil" v-model="form.estadoCivil" :options="estadosCivis"
                            optionLabel="label" optionValue="value" placeholder="Selecione o estado civil" fluid
                            class="form-field" />

                        <Message v-if="errors.estadoCivil" severity="error" size="small" variant="simple">
                            {{ errors.estadoCivil }}
                        </Message>
                    </div>


                    <div class="form-row-field">
                        <Select v-model="form.telefone_pais" :options="paisesTelefone" optionLabel="label"
                            optionValue="value" placeholder="Código" class="form-field" />
                    </div>


                    <div class="form-row-field">

                        <InputMask v-model="form.telefoneNumero" mask="(99) 9999?9-9999" placeholder="Telefone" />

                    </div>


                    <div class="form-row-field">
                        <Checkbox v-model="form.filhos" inputId="filhos" binary />
                        <label for="filhos"> Possui filhos?</label>
                    </div>




                </div>




                <h6>Endereco</h6>
                <div class="form-row">

                    <div class="form-row-field">
                        <InputMask v-model="form.cepEndereco" mask="99999-999" placeholder="CEP"
                            @input="errors.cepEndereco = ''" class="form-field" />

                        <Message v-if="errors.cepEndereco" severity="error" size="small" variant="simple">
                            {{ errors.cepEndereco }}
                        </Message>
                    </div>

                    <div class="form-row-field">
                        <Select name="ufEndereco" v-model="form.ufEndereco" :options="estados" optionLabel="label"
                            optionValue="value" placeholder="Selecione o Estado" fluid class="form-field" />

                        <Message v-if="errors.ufEndereco" severity="error" size="small" variant="simple">
                            {{ errors.ufEndereco }}
                        </Message>
                    </div>

                    <div class="form-row-field">
                        <InputText v-model="form.cidadeEndereco" placeholder="Cidade"
                            @input="errors.cidadeEndereco = ''" class="form-field" />
                        <Message v-if="errors.cidadeEndereco" severity="error" size="small" variant="simple">
                            {{ errors.cidadeEndereco }}
                        </Message>
                    </div>

                    <div class="form-row-field">
                        <InputText v-model="form.bairroEdereco" placeholder="Bairro" @input="errors.bairroEdereco = ''"
                            class="form-field" />
                        <Message v-if="errors.bairroEdereco" severity="error" size="small" variant="simple">
                            {{ errors.bairroEdereco }}
                        </Message>
                    </div>

                    <div class="form-row-field">
                        <InputText v-model="form.ruaEdereco" placeholder="Rua" @input="errors.ruaEdereco = ''"
                            class="form-field" />
                        <Message v-if="errors.ruaEdereco" severity="error" size="small" variant="simple">
                            {{ errors.ruaEdereco }}
                        </Message>
                    </div>

                    <div class="form-row-field">
                        <InputText v-model="form.numeroEndereco" placeholder="Número"
                            @input="errors.numeroEndereco = ''" class="form-field" />
                        <Message v-if="errors.numeroEndereco" severity="error" size="small" variant="simple">
                            {{ errors.numeroEndereco }}
                        </Message>
                    </div>

                    <div class="form-row-field">
                        <InputText v-model="form.complementoEndereco" placeholder="Complemento"
                            @input="errors.complementoEndereco = ''" class="form-field" />
                        <Message v-if="errors.complementoEndereco" severity="error" size="small" variant="simple">
                            {{ errors.complementoEndereco }}
                        </Message>
                    </div>

                </div>



                <h6>Batismo</h6>
                <div class="form-row">

                    <div class="form-row-field">
                        <InputText v-model="form.pastorBatismo" placeholder="Pastor do Batismo"
                            @input="errors.pastorBatismo = ''" class="form-field" />
                        <Message v-if="errors.pastorBatismo" severity="error" size="small" variant="simple">
                            {{ errors.pastorBatismo }}
                        </Message>
                    </div>

                    <div class="form-row-field">
                        <DatePicker v-model="form.dataBatismo" placeholder="Data do Batismo" showIcon fluid
                            iconDisplay="input" inputId="icondisplay" />

                    </div>


                    <div class="form-row-field">
                        <InputText v-model="form.igrejaBatismo" placeholder="Igreja do Batismo"
                            @input="errors.igrejaBatismo = ''" class="form-field" />
                        <Message v-if="errors.igrejaBatismo" severity="error" size="small" variant="simple">
                            {{ errors.igrejaBatismo }}
                        </Message>
                    </div>



                </div>


                <h6>Sistema</h6>

                <div class="form-row">

                    <div class="form-row-field">
                        <Select name="role" v-model="form.rule" :options="roles" optionLabel="label" optionValue="value"
                            placeholder="Selecione a função" fluid class="form-field" />
                        <Message v-if="errors.rule" severity="error" size="small" variant="simple">
                            {{ errors.rule }}
                        </Message>
                    </div>

                    <div class="form-row-field">
                        <Checkbox v-model="form.alarmAuth" inputId="alarmAuth" binary />
                        <label for="alarme"> Acesso ao Alarme</label>
                    </div>


                </div>


                <!-- file input -->
                <h6>Imagem do Membro</h6>
                <FileInput v-model="files" ref="fileInputRef" label="Imagem do Membro" :max-files="1" :max-size-mb="3"
                    :existingImages="[]" accept='image/*,.pdf,.doc,.docx' @remove-existing="onRemoveExisting" />






            </div>

            <div v-if="debouncedCreateLoading" class="loading-overlay">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>

        </div>

        <template #footer>
            <!-- btns -->
            <div class="btn-row">
                <Button @click="closeDialog" type="submit" label="Cancelar" severity="secondary" class="exit-button" />
                <Button @click="onSubmit" type="submit" label="Enviar" severity="primary" class="send-button" />
            </div>
        </template>

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
    align-items: center;
}

.form-row-field {
    width: 100%;
    max-width: 240px;
}

.form-topics {
    color: var(--p-primary-3400)
}

.btn-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.exit-button {
   margin-right: 1rem;
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
    z-index: var(--z-overlay);;
}

@media (max-width: 768px) {
    .form-row-field {
        width: 100%;
        max-width: 100%;
    }
}
</style>
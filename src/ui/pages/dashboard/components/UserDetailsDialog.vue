<script setup>
import { reactive, ref, watch, computed } from 'vue';
import { z } from 'zod';
import { usePrimeVue } from 'primevue/config';
import FileInput from './FileInput.vue';
import { useToast } from 'primevue';
import { useExpenseStore } from '@/stores';
import { useWalletStore } from '@/stores';
import { useMemberStore } from '@/stores';
import debounce from "lodash-es/debounce";
import { roleConfig } from '../mapping/roles'
import { EnumRole, roleMap } from './../../../../api/memberApi';
import { formatters } from '@/utils/formatters';

import { genres, roles, estados, estadosCivis, paisesTelefone, getLabel} from '@/constants/selectOptions'

const walletStore = useWalletStore();
const expenseStore = useExpenseStore();
const memberStore = useMemberStore();

const props = defineProps({
    visible: { type: Boolean, required: true },
    title: { type: String, default: 'Detalhes' },
    detailsId: {
        type: Number,
        default: null
    }
});

const emit = defineEmits(['update:visible', 'update:detailsId', 'edit'])


// form items
const form = reactive({
    nome: '',
    email: '',

    bairroEdereco: '',
    cidadeEndereco: '',
    ruaEdereco: '',
    cepEndereco: '',
    numeroEndereco: '',
    ufEndereco: '',
    complementoEndereco: '',

    data_nascimento: null,
    filhos: false,
    estadoCivil: '',
    genero: null,
    profissao: '',

    cpf: '',
    rgNumero: '',

    telefone_pais: '+55',
    telefoneNumero: '',

    dataBatismo: null,
    pastorBatismo: '',
    igrejaBatismo: '',
    tokenContribuicao: '',

    role: null,
    alarmAuth: false
});

//init form 
const initForm = async () => {
    const data = memberStore.memberUpdate;
    
    form.nome = data.nome ?? '';
    form.email = data.email ?? '';

    form.bairroEdereco = data.bairroEdereco ?? '';
    form.cidadeEndereco = data.cidadeEndereco ?? '';
    form.ruaEdereco = data.ruaEdereco ?? '';
    form.cepEndereco = data.cepEndereco ?? '';
    form.numeroEndereco = data.numeroEndereco ?? '';
    form.ufEndereco = data.ufEndereco ?? '';
    form.complementoEndereco = data.complementoEndereco ?? '';

    form.data_nascimento = data.data_nascimento
        ? new Date(data.data_nascimento)
        : null;

    form.dataBatismo = data.dataBatismo
        ? new Date(data.dataBatismo)
        : null;

    form.filhos = data.filhos ?? false;
    form.estadoCivil = data.estadoCivil ?? '';
    form.genero = data.genero ?? null;
    form.profissao = data.profissao ?? '';

    form.cpf = data.cpf ?? '';
    form.rgNumero = data.rGnumero ?? '';

    form.telefone_pais = data.telefone_pais ?? '+55';
    form.telefoneNumero = data.telefoneNumero ?? '';

    form.pastorBatismo = data.pastorBatismo ?? '';
    form.igrejaBatismo = data.igrejaBatismo ?? '';

    form.role = data.rule ?? null;
    form.alarmAuth = data.alarmAuth ?? false;
    form.tokenContribuicao = data.tokenContribuicao;

    console.log(data);

};

//open
watch(
    () => props.visible,
    async (isOpen) => {
        if (isOpen) {
            console.log(props.detailsId);
            await memberStore.fetchMemberById(props.detailsId)
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


// on edit
const onEdit = (id) => {
    closeDialog();
    emit('edit', id)
}




const currentRole = computed(() => roleConfig[roleMap[form.role]] ?? roleConfig.membro)

</script>

<template>



    <!-- expense details -->
    <Dialog :visible="visible" modal :header="title" :style="{ width: '40vw' }"
        :breakpoints="{ '720px': '90vw', '460px': '100vw' }" @update:visible="emit('update:visible', $event)">


        <template #header>

            <div class="div-header">

                <i class="pi pi-user" style="color: var(--p-primary-400);"></i>

                <span class="bold">
                    Detalhes do Usuário
                </span>

            </div>

        </template>



        <div v-if="expenseStore.detailsLoading" class="loading-wrapper">
            <i class="pi pi-spin pi-spinner"></i>
        </div>

        <div v-else>


            <div class="div-row div-info-image">

                <div class="user-image">
                    <img src="https://www.shutterstock.com/image-vector/thief-criminal-robber-scammer-hacker-600nw-2512791877.jpg"
                        alt="user">
                </div>


                <div>
                    <p class="user-name">{{form.nome}}</p>

                    <div class="card-function" :style="{
                        background: currentRole.bg,
                        border: `1px solid ${currentRole.border}`
                    }">
                        <i :class="currentRole.icon" :style="{ color: currentRole.color }"></i>
                        <p :style="{ color: currentRole.color }">
                            {{ roleMap[form.role] }}
                        </p>
                    </div>

                    <div class="user-info">

                        <div class="info-item">
                            <div class="label">Email</div>
                            <div class="value">{{form.email}}</div>
                        </div>

                        <div class="info-item">
                            <div class="label">Telefone</div>
                            <div class="value">{{form.telefone_pais+' '+ formatters.phoneBRL(form.telefoneNumero)}}</div>
                        </div>

                    </div>


                    <div class="user-info">

                        <div class="info-item">
                            <div class="label">Token</div>
                            <div class="value">{{form.tokenContribuicao}}</div>
                        </div>

                        <div class="info-item">
                            <div class="label">Profissão </div>
                            <div class="value">{{form.profissao}}</div>
                        </div>

                    </div>

                </div>

            </div>

            <p class="titles">Informações Pessoais</p>
            <div class="more-infos-row">

                <div class="info-item">
                    <div class="label">CPF</div>
                    <div class="value">{{formatters.cpf(form.cpf)}}</div>
                </div>

                <div class="info-item">
                    <div class="label">RG</div>
                    <div class="value">{{formatters.rg(form.rgNumero)}}</div>
                </div>

                <div class="info-item">
                    <div class="label">Data de Nascimento</div>
                    <div class="value">{{formatters.dateBRL(form.data_nascimento)}}</div>
                </div>

                <div class="info-item">
                    <div class="label">Gênero</div>
                    <div class="value">{{getLabel(genres,form.genero)}}</div>
                </div>

                <div class="info-item">
                    <div class="label">Estado Civil</div>
                    <div class="value">{{form.estadoCivil}}</div>
                </div>

                <div class="info-item">
                    <div class="label">Filhos</div>
                    <div class="value">{{form.filhos ? 'sim' : 'não'}}</div>
                </div>

            </div>







            <p class="titles">Endereço</p>
            <div class="more-infos-row">

                <div class="info-item">
                    <div class="label">Rua</div>
                    <div class="value">{{form.ruaEdereco}}</div>
                </div>

                <div class="info-item">
                    <div class="label">Número</div>
                    <div class="value">{{form.numeroEndereco}}</div>
                </div>

                <div class="info-item">
                    <div class="label">Bairro</div>
                    <div class="value">{{form.bairroEdereco}}</div>
                </div>

                <div class="info-item">
                    <div class="label">Cidade</div>
                    <div class="value">{{form.cidadeEndereco}}</div>
                </div>

                <div class="info-item">
                    <div class="label">UF</div>
                    <div class="value">{{form.ufEndereco}}</div>
                </div>

                <div class="info-item">
                    <div class="label">CEP</div>
                    <div class="value">{{formatters.cepBRL(form.cepEndereco)}}</div>
                </div>

                <div class="info-item">
                    <div class="label">Complemento</div>
                    <div class="value">{{form.complementoEndereco ? form.complementoEndereco : '-'}}</div>
                </div>

            </div>


            <p class="titles">Informações da Igreja</p>
            <div class="more-infos-row">

                <div class="info-item">
                    <div class="label">Data de Batismo</div>
                    <div class="value">{{formatters.dateBRL(form.dataBatismo)}}</div>
                </div>

                <div class="info-item">
                    <div class="label">Pastor</div>
                    <div class="value">{{form.pastorBatismo ? form.pastorBatismo : '-'}}</div>
                </div>

                <div class="info-item">
                    <div class="label">Igreja</div>
                    <div class="value">{{form.igrejaBatismo ? form.igrejaBatismo : '-'}}</div>
                </div>

            </div>


            <p class="titles">Sistema</p>
            <div class="more-infos-row">

                <div class="info-item">
                    <div class="label">Alarme</div>
                    <div class="value">{{form.alarmAuth ? 'ativo':'desativado'}}</div>
                </div>

            </div>

        </div>

        <!-- btns -->


        <template #footer>
            <div class="btn-row">
                <Button type="submit" @click="onEdit(props.detailsId)" label="Editar" icon="pi pi-pencil"
                    severity="secondary" class="exit-button" :disabled="expenseStore.detailsLoading" />
                <Button type="submit" @click="closeDialog" label="Fechar" severity="primary" class="exit-button"
                    :disabled="expenseStore.detailsLoading" />
            </div>
        </template>

    </Dialog>


</template>


<style scoped>
/* main */
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

/* tools */
.bold {
    font-size: 1.5rem;
    font-weight: 600px;
}

.btn-row {
    position: sticky;
    display: flex;
    justify-content: end;
    gap: 1rem;
}

.div-row {
    display: flex;
}

.info-item {
    display: flex;
    flex-direction: column;

}

.label {
    margin-bottom: 2px;
    color: var(--text-muted);
}

.value {
    font-size: 1.1rem;
}

.titles {
    margin-top: 2rem;
    font-size: 1.2rem;
    color: var(--p-primary-400);
}


/* header */
.div-header i {
    font-size: 2rem;
}

.div-header-desc {
    display: flex;
    flex-direction: column;
}

/* image info */
.div-info-image {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;

}

.user-name {
    font-size: 1.6rem;
}

.card-function {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    margin-bottom: 1rem;
}

.card-function i {
    font-size: 0.75rem;
}

.card-function p {
    margin: 0;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.3px;
}

.user-image {
    width: 120px;
    height: 120px;
    overflow: hidden;
    border-radius: 15%;
}

.user-info {

    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;

}

.user-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* more infos  */
.more-infos-row {
    display: flex;
    width: 90%;
    margin-top: 1rem;
    flex-wrap: wrap;
    gap: 2rem;
}

/* .more-infos {
    display: flex;
    width: 50%;
    gap: 1rem;
    flex-wrap: wrap;
} */

/* loading */
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
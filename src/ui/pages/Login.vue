<script setup lang="ts">
import { onMounted, ref } from "vue";

import { useRouter } from "vue-router";
import logo from '@/assets/imgs/newlogo.png';

import { userAuthStore } from "@/stores"
import { useThemeStore } from "@/stores";
import type { Password } from "primevue";


const theme = useThemeStore();

function switchTheme() {
    theme.toggleTheme();
}
//dialog
const dialogVisible = ref(false);
const dialogError = ref("")

//auth
const auth = userAuthStore();
const router = useRouter();

const form = {
    gmail: "",
    senha: "",
};

//validation form
;

function validationForm() {
    if (!form.gmail.trim()) return "Email é obrigatório.";
    if (!form.senha.trim()) return "Senha é obrigatória.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.gmail)) return "Email com formato inválido.";
    return null;
}

async function login() {

    const validationError = validationForm();
    if (validationError) {
        dialogError.value = validationError;
        dialogVisible.value = true;
        return;
    }


    await auth.login(form);

    if (auth.error) {
        dialogError.value = auth.error;
        dialogVisible.value = true;
    }

    if (auth.credentials) {
        router.push("/dash");
    }


}


const passwordInput = ref<InstanceType<typeof Password> | any>(null);



onMounted(() => {

    if (auth.credentials) {
        router.push('/dash')
    }
})

</script>

<template>

    <div class="main-div">

        <Button icon="pi pi-lightbulb" severity="secondary" rounded aria-label="Star" @click="switchTheme"
            class="button-thema" />

        <div class="div-form">

            <div class="div-title">
                <img :src="logo" alt="logo" class="form-logo" />
                <h3>Bem-vindo de volta</h3>
                <p>insira suas credenciais para acessar o painel GestPv</p>
            </div>

            <form class="login-form" @submit.prevent="login">

                <div class="item-form">
                    <label for="username">Email</label>
                    <InputText id="username" class="input-form" fluid v-model="form.gmail" placeholder="seu@email.com"
                        @keydown.enter.prevent="
                            passwordInput?.$el.querySelector('input')?.focus()
                            " />
                </div>

                <div class="item-form">
                    <label for="password">Senha</label>
                    <Password id="password" ref="passwordInput" v-model="form.senha" toggleMask fluid :feedback="false"
                        placeholder="*********" @keydown.enter="login" />
                </div>

                <Button label="Entrar" class="btn-bold" :loading="auth.loading" type="submit" />
            </form>

        </div>


        <div class="div-footer">
            <p>© 2025 Desenvolvido por Sérgio T. Pimenta</p>
        </div>

        <Dialog v-model:visible="dialogVisible" modal header=" " :style="{ width: '25rem' }">


            <div class="dialog-main-div">

                <div class="icon-error">
                    <i class="pi pi-times"></i>
                </div>

                <h5> Erro ao fazer login </h5>
                <p>{{ dialogError }}</p>

            </div>

            <div class="button-dialog">
                <Button type="button" label="fechar" @click="dialogVisible = false" severity="secondary"></Button>
            </div>
        </Dialog>

    </div>

</template>

<style scoped>
.main-div {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background: var(--bg-login);

    position: relative;
}

/* title */
.div-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 19rem;
    margin-bottom: var(--space-8);
}

.div-title p {
    color: var(--login-title-text);
}

.form-logo {
    width: 75px;
    height: 75px;
    margin-bottom: var(--space-6);
}


/* form */
.div-form {

    padding: 30px;

    background: var(--login-form-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    border-radius: 16px;

    border: 1px solid var(--login-form-border);
    box-shadow: var(--login-form-shadow);


}

.login-form {
    display: flex;
    flex-direction: column;
    align-items: center;

}

.item-form {
    margin-bottom: var(--space-5);
    width: 19rem;
}

.btn-bold {
    font-size: 18px;
    width: 14rem;
}

.button-thema {
    position: absolute;
    top: 10px;
    right: 20px;
}

.div-footer {
    text-align: center;
    position: absolute;
    top: 97%;
}


.dialog-main-div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.icon-error {
    width: 3rem;
    height: 3rem;
    background: #ff4d4d;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
    animation: shake 0.35s ease-in-out;
}

.icon-error i {
    color: white;
    font-size: 1.5rem;
}

@keyframes shake {
    0% {
        transform: translateX(0);
    }

    20% {
        transform: translateX(-4px);
    }

    40% {
        transform: translateX(4px);
    }

    60% {
        transform: translateX(-3px);
    }

    80% {
        transform: translateX(3px);
    }

    100% {
        transform: translateX(0);
    }
}


.dialog-main-div h5 {
    color: red;
    margin-bottom: 1rem;
}

.dialog-main-div h5,
p {
    margin: 0;
    margin-bottom: 0.5rem;

}

.button-dialog {
    display: flex;
    justify-content: end;
}
</style>
<script setup lang="ts">
import { ref } from "vue";
import { Form } from '@primevue/forms';
import logo from '@/assets/imgs/newlogo.png';
import { toogleTheme } from "@/composables/theme";



const theme = toogleTheme();

const email = ref('');
const password = ref('');

</script>

<template>

    <div class="main-div">

        <Button icon="pi pi-lightbulb" severity="secondary" rounded aria-label="Star"
            @click="theme.toggleTheme" class="button-thema" />

        <div class="div-form">

            <div class="div-title">
                <img :src="logo" alt="logo" class="form-logo"></img>
                <h3 style="">Bem-vindo de volta</h3>
                <p>insira suas credenciais para acessar o painel GestPv</p>
            </div>

            <Form class="login-form">
                <div class="item-form">
                    <label for="username">Email</label>
                    <InputText id="username" class="input-form" fluid v-model="email" aria-describedby="email"
                        placeholder="seu@email.com" />
                </div>

                <div class="item-form">
                    <label for="username">Senha</label>
                    <Password v-model="password" toggleMask fluid :feedback="false" placeholder="*********" />
                </div>

                <Button type="submit" label="Entrar" class="btn-bold" />

            </Form>


        </div>

    </div>

</template>

<style scoped>
.main-div {
    display: flex;
    flex: 1;
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
</style>
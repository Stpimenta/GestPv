
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { userAuthStore } from "@/stores";
import { router } from "@/router";

const auth = userAuthStore();
const counter = ref(5);

function logout() {
  auth.logout();
  router.push("/");
}

onMounted(() => {
  const interval = setInterval(() => {
    counter.value--;
    if (counter.value <= 0) {
      clearInterval(interval);
      logout();
    }
  }, 1000);
});
</script>


<template>
  <div class="main-div">
    <div class="card">
      <h1>Você está saindo</h1>
      <p>Redirecionando em {{ counter }}</p>

      <div class="dots">
        <span v-for="n in 3" :key="n" class="dot"></span>
      </div>
    </div>
  </div>
</template>



<style scoped>
.main-div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    background: var(--bg-login);
}

.card {
    text-align: center;
    background: var(--login-form-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 2rem;
    border-radius: 0.75rem;
    border: 1px solid var(--login-form-border);
    box-shadow: var(--login-form-shadow);
}

.dots {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
}

.dot {
    width: 0.75rem;
    height: 0.75rem;
    margin: 0 0.3125rem;
    background-color: var(--p-primary-color);
    border-radius: 50%;
    animation: bounce 1.2s infinite ease-in-out;
}

.dot:nth-child(1) {
    animation-delay: 0s;
}

.dot:nth-child(2) {
    animation-delay: 0.2s;
}

.dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes bounce {
    0%,
    80%,
    100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
}

.countdown {
    font-weight: bold;
    margin-top: 1rem;
    color: var(--text-color);
}
</style>

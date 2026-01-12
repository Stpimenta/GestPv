<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
;

import logo from "@/assets/imgs/newlogo.png";

type MenuItem = {
  label: string;
  key: string;
  icon: string;
  to: string;
};

const route = useRoute();

const menuItems: MenuItem[] = [
  { label: "Dashboard", key: "dashboard", icon: "pi pi-box", to: "/dash" },
  { label: "Caixas", key: "caixa", icon: "pi pi-wallet", to: "/dash/wallet" },
  { label: "Entradas", key: "entrada", icon: "pi pi-arrow-circle-up", to: "/dash/earned" },
  { label: "Saídas", key: "saida", icon: "pi pi-arrow-circle-down", to: "/dash/expenses" },
  { label: "Usuários", key: "usuarios", icon: "pi pi-users", to: "/dash/users" },
  { label: "Relatórios", key: "relatorios", icon: "pi pi-chart-bar", to: "/dash/report" },
];

const activeItem = ref("dashboard");

function selectItem(item: MenuItem) {
  activeItem.value = item.key;
}

watch(
  () => route.path,
  (path) => {
    const found = menuItems.find(i => i.to === path);
    if (found) activeItem.value = found.key;
  },
  { immediate: true }
);
</script>

<template>
  <div class="sidebar">

    <div class="logo-container">
      <img :src="logo" alt="Logo" class="logo-img" />
      <p class="logo-text">Gest<span>PV</span></p>
    </div>


    <nav class="nav-menu">
      <ul class="menu">
        <li v-for="item in menuItems" :key="item.key" :class="{ active: activeItem === item.key }"
          @click="selectItem(item)">
          <RouterLink :to="item.to" class="menu-link">
            <i :class="item.icon" class="icon"></i>
            <span>{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.sidebar {
  width: 220px;
  height: 100%;
  background-color: var(--bg-header);
  border-right: 1px solid var(--sidebar-border);
}

.sidebar h2 {
  margin-bottom: 1.5rem;
}

.nav-menu {
  padding-top: 0;
  padding-right: 1rem;
  padding-bottom: 2rem;
  padding-left: 1rem;
}

.menu {
  list-style: none;
  padding: 0;
}

.menu li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  margin-bottom: 0.2rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 550;
  padding: 0;
}

.menu li:hover {
  background: var(--menu-hover-bg);
}

.menu li.active {
  background: var(--menu-active-bg);
  color: var(--menu-active-color);
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 100%;
  padding: 0.8rem;
  color: inherit;
  text-decoration: none;
}


.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4rem;
  border-bottom: 1px solid var(--divider-border);
  width: 220px;
  margin-bottom: 1rem;
  gap: 1rem;
}

.logo-text {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.4px;
  color: #1f2937;
}

.my-app-dark .logo-text {
  color: #e5e7eb; 
}

.logo-text span {
  color: #2563eb;
}

.my-app-dark .logo-text span {
  color: #60a5fa; 
}

.logo-img {
  width: 40px;
  height: 40px;
}

</style>

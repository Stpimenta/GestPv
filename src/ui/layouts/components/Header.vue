<script setup lang="ts">

import { useThemeStore } from "@/stores/storeTheme"
import { userAuthStore } from "@/stores"
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useUiStore } from "@/stores"

const ui = useUiStore();
const theme = useThemeStore();
const auth = userAuthStore();
const router = useRouter();

const menu = ref();
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          auth.logout();                  
          router.push('/');       
        },
      },
      // {
      //   label: 'Export',
      //   icon: 'pi pi-upload'
      // }
    ]
  }
]);

const toggle = (event: any) => {
  menu.value.toggle(event);
};


</script>


<template>
  <header class="header-main">

    <div class="hamburguer-btn">
      <Button icon="pi pi-bars" size="small" rounded severity="contrast" variant="outlined" class="mobile-only"
        @click="ui.toggleSideBar" />
    </div>



    <div class="div-icons">
      <Button icon="pi pi-lightbulb" size="small" rounded severity="contrast" variant="outlined" aria-label="Star"
        @click="theme.toggleTheme"></Button>
      <Button type="button" rounded size="small" severity="contrast" variant="outlined" icon="pi pi-user"
        @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>

  </header>
</template>

<style scoped>
.header-main {
  display: flex;
  height: 4rem;
  width: 100%;
  align-items: center;
  background-color: var(--bg-header);
  /* 800 */
  /*200*/
}

.div-icons {
  margin-right: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: end;
  flex: 1;
}

.hamburguer-btn {
  display: flex;
  flex: 1;
  margin-left: 1rem;
}

@media (min-width: 769px) {

  .mobile-only {
    display: none;

  }

}
</style>

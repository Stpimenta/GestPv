<script setup lang="ts">

import Navbar from '@/ui/layouts/components/Header.vue'
import Sidebar from '@/ui/layouts/components/Sidebar.vue'
import { useUiStore } from "@/stores"

const ui = useUiStore();
</script>



<template>
  <div class="dashboard">

     <!-- overlay -->
    <div
      v-if="ui.sidebarOpen"
      class="overlay"
      @click="ui.closeSideBar"
    />

    <aside class="sidebar-wrapper" :class="{ open: ui.sidebarOpen }">
      <Sidebar />
    </aside>

    <div class="content">
      <header class="navbar">
        <Navbar />
      </header>

      <main class="page">
        <router-view />
      </main>
    </div>

  </div>
</template>


<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden; 
}

/* wrapper controla posição */
.sidebar-wrapper {
  width: 220px;
  flex-shrink: 0;
  z-index: var(--z-sidebar);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;  
}


.navbar {

  height: 64px;
  width: 100%;
  z-index: var(--z-navbar);
  display: flex;
  align-items: center;

  position: fixed;
  top: 0;
  right: 0;
}

.page {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  margin-top: 64px;
}

/* MOBILE */
@media (max-width: 768px) {
  .sidebar-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: var(--z-sidebar);
    transform: translateX(-100%);
    transition: transform 0.2s ease;
  }

  .sidebar-wrapper.open {
    transform: translateX(0);
  }
}

/* overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: var(--z-overlay)
}
</style>

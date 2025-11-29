<template>
  <div class="dashboard">

    <aside class="sidebar">
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

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  width: 100%;
}

/* Coluna lateral */
.sidebar {
  width: 220px;
  background: #2b2b2b;
  color: white;
}

/* Parte direita do layout */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Topo */
.navbar {
  height: 50px;
  background: #eee;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
}

/* Área das páginas */
.page {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>

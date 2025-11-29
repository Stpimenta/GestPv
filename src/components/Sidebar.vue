<template>
  <aside class="sidebar">
    <h2>Dashboard</h2>

    <nav>
      <router-link to="/dash">🏠 Home</router-link>
      <router-link to="/dash/users">👥 Users</router-link>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: #222;
  color: white;
  padding: 16px;
}
nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.router-link-active {
  color: #42b883;
  font-weight: bold;
}
</style>

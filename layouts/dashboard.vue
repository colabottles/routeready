<!-- layouts/dashboard.vue -->
<template>
  <div class="dashboard-layout">
    <ThemeToggle />
    <!-- Header -->
    <header class="top-bar">
      <p>Header</p>
    </header>

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <img src="/assets/images/logo.png" alt="Logo" class="sidebar-logo">
        <h2 class="sidebar-title">RouteReady</h2>
      </div>

      <nav class="sidebar-nav">
          <NuxtLink to="/drivers" class="nav-item" active-class="active">
            <span class="nav-icon">👥</span>
            <span>Drivers</span>
          </NuxtLink>

          <NuxtLink to="/routes" class="nav-item" active-class="active">
            <span class="nav-icon">🗺️</span>
            <span>Routes</span>
          </NuxtLink>

          <NuxtLink to="/vehicles" class="nav-item" active-class="active">
            <span class="nav-icon">🚚</span>
            <span>Vehicles</span>
          </NuxtLink>

          <NuxtLink to="/schedule" class="nav-item" active-class="active">
            <span class="nav-icon">📅</span>
            <span>Schedule</span>
          </NuxtLink>

          <NuxtLink to="/reports" class="nav-item" active-class="active">
            <span class="nav-icon">📈</span>
            <span>Reports</span>
          </NuxtLink>
        </nav>

        <div class="sidebar-footer">
          <button class="logout-btn" @click="handleLogout">
            <span class="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <slot />
      </main>
    </div>
  </template>

<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Add your logout logic here
      await router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.top-bar {
  color: var(--text-on-gradient);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 60px;
  min-width: 100vw;
  background: linear-gradient(90deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
}

.sidebar {
  width: 260px;
  background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.sidebar-logo {
  width: 200px;
  height: 200px;
  margin-bottom: 0.5rem;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border-left: 4px solid var(--button-primary);
}

.nav-icon {
  font-size: 1.25rem;
  line-height: 0.95;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  overflow-y: auto;
  background-color: var(--bg-secondary);
}

/* Global styles for pages using this layout */
:global(.page-header) {
  margin-bottom: 2rem;
}

:global(.page-title) {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

:global(.page-subtitle) {
  color: var(--text-secondary);
  margin: 0;
}

:global(.card) {
  background: var(--bg-primary);
  border-radius: 0.75rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
}

:global(.card-header) {
  padding: 1.5rem;
  border-bottom: 1px solid var(--input-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:global(.card-title) {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

:global(.card-content) {
  padding: 1.5rem;
  color: var(--text-primary);
}

:global(.btn) {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
  display: inline-block;
}

:global(.btn-primary) {
  background: var(--button-primary);
  color: white;
}

:global(.btn-primary:hover) {
  background: var(--button-primary-hover);
}

:global(.btn-secondary) {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--input-border);
}

:global(.btn-secondary:hover) {
  background: var(--input-border);
}

:global(.btn-success) {
  background: #10b981;
  color: white;
}

:global(.btn-warning) {
  background: #f59e0b;
  color: white;
}

:global(.form-input),
:global(.form-select) {
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-primary);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

:global(.table-container) {
  overflow-x: auto;
}

:global(.table) {
  width: 100%;
  border-collapse: collapse;
}

:global(.table th) {
  text-align: left;
  padding: 0.75rem;
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.875rem;
  border-bottom: 2px solid var(--input-border);
}

:global(.table td) {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid var(--input-border);
  color: var(--text-primary);
}

:global(.status) {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

:global(.status-active) {
  background: #10b981;
  color: #ffffff;
}

:global(.status-pending) {
  background: #f59e0b;
  color: #000000;
}

:global(.status-inactive) {
  background: #6b7280;
  color: #ffffff;
}

:global(.grid) {
  display: grid;
  gap: 1.5rem;
}

:global(.grid-cols-3) {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .main-content {
    margin-left: 200px;
  }

  :global(.grid-cols-3) {
    grid-template-columns: 1fr;
  }
}
</style>
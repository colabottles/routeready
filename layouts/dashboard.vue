<!-- layouts/dashboard.vue -->
<template>
  <div class="dashboard-layout">
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
  background-color: #f5f5f5;
}

.top-bar {
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 60px;
  min-width: 100vw;
  background-color: #2d1c7f;
}

.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #2d1c7f 0%, #643b9f 100%);
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
  border-left: 4px solid #60a5fa;
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
}

/* Global styles for pages using this layout */
:global(.page-header) {
  margin-bottom: 2rem;
}

:global(.page-title) {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

:global(.page-subtitle) {
  color: #64748b;
  margin: 0;
}

:global(.card) {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

:global(.card-header) {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:global(.card-title) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

:global(.card-content) {
  padding: 1.5rem;
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
  background: #2563eb;
  color: white;
}

:global(.btn-primary:hover) {
  background: #1d4ed8;
}

:global(.btn-secondary) {
  background: #f1f5f9;
  color: #475569;
}

:global(.btn-secondary:hover) {
  background: #e2e8f0;
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
  border: 1px solid #e2e8f0;
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
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
  font-size: 0.875rem;
  border-bottom: 2px solid #e2e8f0;
}

:global(.table td) {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

:global(.status) {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

:global(.status-active) {
  background: #dcfce7;
  color: #166534;
}

:global(.status-pending) {
  background: #fef3c7;
  color: #92400e;
}

:global(.status-inactive) {
  background: #f1f5f9;
  color: #475569;
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
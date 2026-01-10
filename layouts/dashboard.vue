<template>
  <div class="dashboard-layout">
    <ThemeToggle />

    <!-- Header -->
    <header class="top-bar">
      <div class="header-content">
        <div class="user-info">
          <figure class="user-avatar">
            <img
v-if="session?.user?.image" :src="session.user.image"
              :alt="session.user.name || 'User'">
            <span v-else class="avatar-fallback" aria-label="User avatar">
              {{ session?.user?.name?.charAt(0) || 'U' }}
            </span>
            <figcaption class="visually-hidden">User profile picture</figcaption>
          </figure>
          <h1 class="user-greeting">
            Hello, <span class="user-name">{{ session?.user?.name || 'User' }}</span>!
          </h1>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside class="sidebar" aria-label="Main navigation">
      <header class="sidebar-header">
        <figure class="logo-placeholder">
          <svg
xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <figcaption class="visually-hidden">RouteReady logo</figcaption>
        </figure>
        <h2 class="sidebar-title">RouteReady</h2>
      </header>

      <nav class="sidebar-nav" aria-label="Primary navigation">
        <NuxtLink to="/drivers" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">👥</span>
          <span>Drivers</span>
        </NuxtLink>

        <NuxtLink to="/routes" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">🗺️</span>
          <span>Routes</span>
        </NuxtLink>

        <NuxtLink to="/vehicles" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">🚚</span>
          <span>Vehicles</span>
        </NuxtLink>

        <NuxtLink to="/schedule" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">📅</span>
          <span>Schedule</span>
        </NuxtLink>

        <NuxtLink to="/reports" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">📈</span>
          <span>Reports</span>
        </NuxtLink>

        <NuxtLink to="/analytics" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">📊</span>
          <span>Analytics</span>
        </NuxtLink>

        <NuxtLink to="/settings" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">⚙️</span>
          <span>Settings</span>
        </NuxtLink>
      </nav>

      <footer class="sidebar-footer">
        <button type="button" class="logout-btn" @click="handleLogout">
          <span class="nav-icon" aria-hidden="true">🚪</span>
          <span>Logout</span>
        </button>
        <p class="copyright">
          RouteReady ©️ 2025
        </p>
      </footer>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from 'nuxt/app'

const router = useRouter()
const nuxtApp = useNuxtApp()
const $authClient = nuxtApp.$authClient

const session = ref(null)

onMounted(async () => {
  if ($authClient) {
    const result = await $authClient.getSession()
    session.value = result?.data
  }
})

const handleLogout = async () => {
  try {
    if ($authClient) {
      await $authClient.signOut()
    }
    await router.push('/login')
  } catch (err) {
    console.error('Logout error:', err)
  }
}
</script>

<style scoped>
/* Accessibility utility */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.dashboard-layout {
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.top-bar {
  color: var(--text-on-gradient);
  display: flex;
  align-items: center;
  height: 70px;
  width: 100%;
  background: linear-gradient(90deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  padding: 0 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  width: 100%;
  max-width: 100%;
  margin-left: 260px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  margin: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.user-greeting {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: white;
}

.user-name {
  font-weight: 700;
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
  z-index: 101;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo-placeholder {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 1rem 0;
  backdrop-filter: blur(10px);
}

.logo-placeholder svg {
  opacity: 0.9;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  min-height: 0;
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
  line-height: 1;
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
  margin-bottom: 1rem;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.copyright {
  text-align: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  padding: 0.5rem 0;
  margin: 0;
}

.main-content {
  margin-left: 260px;
  margin-top: 70px;
  padding: 2rem;
  min-height: calc(100vh - 70px);
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
  background: var(--bg-primary) !important;
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
  color: var(--text-primary) !important;
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
  color: var(--text-primary) !important;
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
  background: var(--bg-secondary) !important;
  font-weight: 600;
  color: var(--text-primary) !important;
  font-size: 0.875rem;
  border-bottom: 2px solid var(--input-border);
}

:global(.table td) {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid var(--input-border);
  color: var(--text-primary) !important;
}

:global(.table tbody tr) {
  background: var(--bg-primary) !important;
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
  background: #10b981 !important;
  color: #ffffff !important;
}

:global(.status-pending) {
  background: #f59e0b !important;
  color: #000000 !important;
}

:global(.status-inactive) {
  background: #6b7280 !important;
  color: #ffffff !important;
}

:global(.grid) {
  display: grid;
  gap: 1.5rem;
}

:global(.grid-cols-3) {
  grid-template-columns: repeat(3, 1fr);
}

/* Fix button icon alignment */
:global(.btn) {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  line-height: 1.5;
}

:global(.btn svg) {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .header-content {
    margin-left: 200px;
  }

  .main-content {
    margin-left: 200px;
  }

  :global(.grid-cols-3) {
    grid-template-columns: 1fr;
  }
}
</style>
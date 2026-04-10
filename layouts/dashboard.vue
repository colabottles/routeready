<template>
  <div class="dashboard-layout">
    <ThemeToggle />

    <!-- Header -->
    <header class="top-bar">
      <div class="header-content">
        <div class="user-info">
          <div class="user-avatar">
            <img
              v-if="session"
              :src="session.user?.image"
              :alt="session.user?.name || 'User'"
              :fallback="session.user?.name?.charAt(0) || 'U'"
            >
          </div>
          <h2 class="user-greeting">
            Hello, <span class="user-name">{{ session?.user?.name || 'User' }}</span>!
          </h2>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside class="sidebar" aria-label="Main navigation">
      <header class="sidebar-header">
        <figure class="logo-placeholder">
          <img
            v-if="companyLogo"
            :src="companyLogo"
            alt="Company logo"
            class="logo-img">
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <figcaption class="visually-hidden">RouteReady logo</figcaption>
        </figure>
      </header>

      <nav class="sidebar-nav" aria-label="Primary navigation">
        <NuxtLink to="/drivers" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
          <span>Drivers</span>
        </NuxtLink>

        <NuxtLink to="/properties" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <rect x="4" y="2" width="16" height="20" />
              <line x1="4" y1="22" x2="20" y2="22" />
              <rect x="8" y="5" width="3" height="5" />
              <rect x="13" y="5" width="3" height="5" />
              <rect x="10" y="14" width="4" height="10" />
            </svg>
          </span>
          <span>Properties</span>
        </NuxtLink>

        <NuxtLink to="/routes" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <circle cx="3" cy="6" r="2" />
              <circle cx="21" cy="18" r="2" />
              <path d="M3 8v4a4 4 0 0 0 4 4h10v-4a4 4 0 0 0-4-4H3" />
            </svg>
          </span>
          <span>Routes</span>
        </NuxtLink>

        <NuxtLink to="/vehicles" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h4l3 5v3h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </span>
          <span>Vehicles</span>
        </NuxtLink>

        <NuxtLink to="/schedule" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </span>
          <span>Schedule</span>
        </NuxtLink>

        <NuxtLink to="/reports" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </span>
          <span>Reports</span>
        </NuxtLink>

        <NuxtLink to="/analytics" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </span>
          <span>Analytics</span>
        </NuxtLink>

        <NuxtLink to="/settings" class="nav-item" active-class="active">
          <span class="nav-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          <span>Settings</span>
        </NuxtLink>
      </nav>

      <footer class="sidebar-footer">
        <button type="button" class="logout-btn" @click="handleLogout">
          <span class="nav-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
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

const { companyLogo, fetchOrganization } = useOrganization()

onMounted(async () => {
  if ($authClient) {
    const result = await $authClient.getSession()
    session.value = result?.data
  }
  await fetchOrganization()
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
  background: var(--bg-gradient-start);
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
  background: var(--bg-gradient-start);
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

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 16px;
}

.logo-placeholder {
  width: 140px;
  height: 140px;
  border-radius: 5px;
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
  gap: 0;
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
  justify-content: center;
  gap: 0;
  width: 100%;
  padding: 0.875rem;
  background: var(--button-primary);
  border: none;
  border-radius: 8px;
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
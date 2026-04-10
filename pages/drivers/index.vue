<template>
  <main class="drivers-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">Drivers</h1>
        <p class="page-subtitle">Manage your driver team and assignments</p>
      </div>
      <NuxtLink to="/drivers/new" class="btn btn-primary">
        <svg
xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
          stroke-linejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Add New Driver</span>
      </NuxtLink>
    </header>

    <!-- Stats Grid -->
    <section class="stats-grid" aria-label="Driver statistics">
      <article class="stat-card">
        <div class="stat-icon" aria-hidden="true">
          <svg
xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
            stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="2" />
            <path d="M16 8h4l3 5v3h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        <strong class="stat-value">{{ stats.active }}</strong>
        <span class="stat-label">Active Today</span>
      </article>
      <article class="stat-card">
        <div class="stat-icon" aria-hidden="true">
          <svg
xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <strong class="stat-value">{{ stats.total }}</strong>
        <span class="stat-label">Total Drivers</span>
      </article>
      <article class="stat-card">
        <div class="stat-icon" aria-hidden="true">
          <svg
xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
            stroke-linejoin="round">
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <strong class="stat-value">{{ stats.avgRating }}</strong>
        <span class="stat-label">Avg Performance</span>
      </article>
    </section>

    <!-- Loading State -->
    <section v-if="pending" class="loading-state" aria-live="polite">
      <div class="state-icon" aria-hidden="true">
        <svg
xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
          stroke-linejoin="round" class="spin">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
      <p>Loading drivers…</p>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-state">
      <div class="state-icon" aria-hidden="true">
        <svg
xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
          stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 class="state-title">Failed to load drivers</h2>
      <p class="state-description">{{ error.message }}</p>
      <button class="btn btn-primary" @click="refresh()">Try Again</button>
    </section>

    <template v-else>
      <!-- Filters -->
      <form class="filters-section" @submit.prevent>
        <div class="search-wrapper">
          <svg
class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="search-drivers"
            v-model="searchTerm"
            type="search"
            class="form-input search-input"
            placeholder="Search drivers…"
            aria-label="Search drivers by name or email"
            @input="filterDrivers">
        </div>
        <select
          id="filter-status"
          v-model="statusFilter"
          class="form-select"
          aria-label="Filter by status"
          @change="filterDrivers">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on-route">On Route</option>
        </select>
      </form>

      <!-- Drivers Grid -->
      <section class="drivers-grid" aria-label="Drivers list">
        <article v-for="driver in filteredDrivers" :key="driver.id" class="driver-card">
          <header class="driver-header">
            <div class="driver-avatar" aria-hidden="true">{{ driver.name.charAt(0) }}</div>
            <div class="driver-header-info">
              <h2 class="driver-name">{{ driver.name }}</h2>
              <span class="driver-status" :class="`status-${driver.status}`">
                {{ driver.status === 'on-route' ? 'On Route' : driver.status.charAt(0).toUpperCase()
                  + driver.status.slice(1) }}
              </span>
            </div>
          </header>

          <dl class="driver-details">
            <div class="detail-row">
              <dt>
                <svg
xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true">
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email
              </dt>
              <dd>{{ driver.email }}</dd>
            </div>
            <div class="detail-row">
              <dt>
                <svg
xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
                License
              </dt>
              <dd>{{ driver.license }}</dd>
            </div>
            <div class="detail-row">
              <dt>
                <svg
xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true">
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.93 2 2 0 0 1 3.58 2.72h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.2a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Phone
              </dt>
              <dd>{{ driver.phone }}</dd>
            </div>
            <div class="detail-row">
              <dt>
                <svg
xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true">
                  <circle cx="3" cy="6" r="2" />
                  <circle cx="21" cy="18" r="2" />
                  <path d="M3 8v4a4 4 0 0 0 4 4h10v-4a4 4 0 0 0-4-4H3" />
                </svg>
                Route
              </dt>
              <dd>{{ driver.current_route || 'None' }}</dd>
            </div>
            <div class="detail-row">
              <dt>
                <svg
xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true">
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Rating
              </dt>
              <dd>{{ Number(driver.rating).toFixed(1) }} / 5</dd>
            </div>
          </dl>

          <nav class="driver-actions" :aria-label="`Actions for ${driver.name}`">
            <NuxtLink :to="`/drivers/${driver.id}`" class="btn btn-secondary btn-small">
              View
            </NuxtLink>
            <NuxtLink :to="`/drivers/edit-${driver.id}`" class="btn btn-secondary btn-small">
              Edit
            </NuxtLink>
            <button
              :class="['btn', 'btn-small', driver.status === 'active' ? 'btn-deactivate' : 'btn-activate']"
              :aria-label="driver.status === 'active' ? `Deactivate ${driver.name}` : `Activate ${driver.name}`"
              @click="toggleDriverStatus(driver)">
              {{ driver.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
          </nav>
        </article>
      </section>

      <!-- Empty State -->
      <section v-if="filteredDrivers.length === 0" class="empty-state" aria-live="polite">
        <div class="state-icon" aria-hidden="true">
          <svg
xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h2 class="state-title">No drivers found</h2>
        <p class="state-description">
          {{ searchTerm || statusFilter ? 'Try adjusting your search or filters' : 'Get started by  adding your first driver' }}
        </p>
        <NuxtLink v-if="!searchTerm && !statusFilter" to="/drivers/new" class="btn btn-primary">
          Add Your First Driver
        </NuxtLink>
      </section>
    </template>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const searchTerm = ref('')
const statusFilter = ref('')

const { data: driversData, pending, error, refresh } = await useFetch('/api/drivers', {
  transform: (response) => response.data || []
})

const drivers = computed(() => driversData.value || [])

const stats = computed(() => {
  const allDrivers = drivers.value
  const activeDrivers = allDrivers.filter(d => d.status === 'active' || d.status === 'on-route')
  const totalRating = allDrivers.reduce((sum, d) => sum + Number(d.rating), 0)
  return {
    total: allDrivers.length,
    active: activeDrivers.length,
    avgRating: allDrivers.length > 0 ? (totalRating / allDrivers.length).toFixed(1) : '0.0'
  }
})

const filteredDrivers = ref([])

watch(drivers, () => { filterDrivers() }, { immediate: true })

function filterDrivers() {
  if (!drivers.value) { filteredDrivers.value = []; return }
  filteredDrivers.value = drivers.value.filter(driver => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesStatus = !statusFilter.value || driver.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
}

async function toggleDriverStatus(driver) {
  const newStatus = driver.status === 'active' ? 'inactive' : 'active'
  try {
    const { data } = await $fetch(`/api/drivers/${driver.id}`, {
      method: 'PUT',
      body: { ...driver, status: newStatus }
    })
    if (data) {
      driver.status = data.status
      await refresh()
    }
  } catch (err) {
    console.error('Error updating driver status:', err)
    alert('Failed to update driver status. Please try again.')
  }
}

useHead({
  title: 'Drivers - RouteReady',
  meta: [{ name: 'description', content: 'Manage drivers and assignments' }]
})
</script>

<style scoped>
.drivers-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.375rem 0;
}

.page-subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 1rem;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.75rem 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.625rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  color: var(--button-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 50%;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Filters */
.filters-section {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1.5px solid var(--input-border);
  border-radius: 8px;
  font-size: 0.9375rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
}

.form-select {
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--input-border);
  border-radius: 8px;
  font-size: 0.9375rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.2s;
  min-width: 160px;
}

.form-select:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
}

/* Driver Cards */
.drivers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
}

.driver-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: all 0.2s;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.driver-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--button-primary);
}

.driver-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--input-border);
}

.driver-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: var(--button-primary);
  color: #fff;
  font-size: 1.125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.driver-header-info {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.driver-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.driver-status {
  display: inline-block;
  padding: 0.2rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  width: fit-content;
}

.status-active {
  background: #10b981;
  color: #fff;
}

.status-on-route {
  background: #f59e0b;
  color: #000;
}

.status-inactive {
  background: #6b7280;
  color: #fff;
}

/* Details */
.driver-details {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin: 0;
  flex: 1;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.detail-row dt {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  font-weight: 500;
  white-space: nowrap;
  margin: 0;
}

.detail-row dd {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 600;
  text-align: right;
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Actions */
.driver-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--input-border);
}

.btn-small {
  font-size: 0.8125rem;
  padding: 0.5rem 0.875rem;
}

.btn-deactivate {
  background: #dc2626;
  color: #fff;
  border: 1px solid #dc2626;
  margin-left: auto;
}

.btn-deactivate:hover:not(:disabled) {
  background: #b91c1c;
  border-color: #b91c1c;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-deactivate:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}

.btn-activate {
  background: #10b981;
  color: #fff;
  border: 1px solid #10b981;
  margin-left: auto;
}

.btn-activate:hover:not(:disabled) {
  background: #059669;
  border-color: #059669;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-activate:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* States */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.state-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--bg-secondary);
  margin: 0 auto 1.25rem;
  color: var(--text-muted);
}

.error-state .state-icon {
  color: #ef4444;
  background: #fef2f2;
}

.state-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.state-description {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0 0 1.5rem 0;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 968px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .form-select {
    min-width: unset;
    width: 100%;
  }

  .drivers-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
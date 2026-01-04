<template>
  <main class="drivers-page">
    <header class="page-header">
      <h1 class="page-title">Drivers</h1>
      <p class="page-subtitle">Manage your driver team and assignments</p>
      <NuxtLink to="/drivers/new" class="btn btn-primary">
        <PlusIcon :size="18" />
        <span>Add New Driver</span>
      </NuxtLink>
    </header>

    <!-- Stats Grid -->
    <section class="stats-grid">
      <article class="stat-card">
        <span class="stat-icon" aria-hidden="true">🚚</span>
        <strong class="stat-value">{{ stats.active }}</strong>
        <span class="stat-label">Active Today</span>
      </article>
      <article class="stat-card">
        <span class="stat-icon" aria-hidden="true">👥</span>
        <strong class="stat-value">{{ stats.total }}</strong>
        <span class="stat-label">Total Drivers</span>
      </article>
      <article class="stat-card">
        <span class="stat-icon" aria-hidden="true">⭐</span>
        <strong class="stat-value">{{ stats.avgRating }}</strong>
        <span class="stat-label">Avg Performance</span>
      </article>
    </section>

    <!-- Loading State -->
    <section v-if="pending" class="loading-state" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true">⏳</span>
      <p>Loading drivers...</p>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-state">
      <span class="error-icon" aria-hidden="true">⚠️</span>
      <h2 class="error-title">Failed to load drivers</h2>
      <p class="error-message">{{ error.message }}</p>
      <button class="btn btn-primary" @click="refresh()">Try Again</button>
    </section>

    <!-- Drivers Content -->
    <template v-else>
      <!-- Filters -->
      <form class="filters-section" @submit.prevent>
        <input
          id="search-drivers"
          v-model="searchTerm"
          type="search"
          class="form-input search-input"
          placeholder="Search drivers..."
          aria-label="Search drivers by name or email"
          @input="filterDrivers"
        >
        <select id="filter-status" v-model="statusFilter" class="form-select" aria-label="Filter by status" @change="filterDrivers">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on-route">On Route</option>
        </select>
      </form>

      <!-- Drivers Grid -->
      <section class="drivers-grid">
        <article v-for="driver in filteredDrivers" :key="driver.id" class="driver-card">
          <header class="driver-header">
            <h2 class="driver-name">{{ driver.name }}</h2>
            <span class="driver-status" :class="`status-${driver.status}`">
              {{ driver.status }}
            </span>
          </header>

          <dl class="driver-details">
            <dt>Email:</dt>
            <dd>{{ driver.email }}</dd>

            <dt>License:</dt>
            <dd>{{ driver.license }}</dd>

            <dt>Phone:</dt>
            <dd>{{ driver.phone }}</dd>

            <dt>Current Route:</dt>
            <dd>{{ driver.current_route || 'None' }}</dd>

            <dt>Rating:</dt>
            <dd>
              <span aria-hidden="true">⭐</span>
              {{ Number(driver.rating).toFixed(1) }}/5
            </dd>
          </dl>

          <nav class="driver-actions">
            <NuxtLink :to="`/drivers/${driver.id}`" class="btn btn-secondary btn-small">
              View
            </NuxtLink>
            <NuxtLink :to="`/drivers/edit-${driver.id}`" class="btn btn-secondary btn-small">
              Edit
            </NuxtLink>
            <button
              :class="['btn', 'btn-small', driver.status === 'active' ? 'btn-warning' : 'btn-success']"
              :aria-label="driver.status === 'active' ? `Deactivate ${driver.name}` : `Activate ${driver.name}`"
              @click="toggleDriverStatus(driver)"
            >
              {{ driver.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
          </nav>
        </article>
      </section>

      <!-- Empty State -->
      <section v-if="filteredDrivers.length === 0" class="empty-state" aria-live="polite">
        <span class="empty-icon" aria-hidden="true">👥</span>
        <h2 class="empty-title">No drivers found</h2>
        <p class="empty-description">
          {{ searchTerm || statusFilter ? 'Try adjusting your search or filters' : 'Get started by adding your first driver' }}
        </p>
        <NuxtLink v-if="!searchTerm && !statusFilter" to="/drivers/new" class="btn btn-primary">
          <PlusIcon :size="18" />
          <span>Add Your First Driver</span>
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

watch(drivers, () => {
  filterDrivers()
}, { immediate: true })

function filterDrivers() {
  if (!drivers.value) {
    filteredDrivers.value = []
    return
  }

  filteredDrivers.value = drivers.value.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
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
      body: {
        ...driver,
        status: newStatus
      }
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
  meta: [
    { name: 'description', content: 'Manage drivers and assignments' }
  ]
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
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Filters */
.filters-section {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 400px;
  padding: 0.75rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: 8px;
  font-size: 0.9375rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: 8px;
  font-size: 0.9375rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.2s;
}

.form-select:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Drivers Grid */
.drivers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
}

.driver-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: all 0.2s;
  border: 2px solid transparent;
}

.driver-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--button-primary);
}

.driver-header {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-border);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.driver-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.driver-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  flex-shrink: 0;
}

.status-active {
  background: #10b981;
  color: #ffffff;
}

.status-on-route {
  background: #f59e0b;
  color: #000000;
}

.status-inactive {
  background: #6b7280;
  color: #ffffff;
}

.driver-details {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem 1rem;
  margin: 0 0 1.25rem 0;
  align-items: baseline;
}

.driver-details dt {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
}

.driver-details dd {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 600;
  text-align: right;
  margin: 0;
}

.driver-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-small {
  font-size: 0.8125rem;
  padding: 0.5rem 0.875rem;
}

.btn-warning {
  background: #f59e0b;
  color: #000000;
  font-weight: 700;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

/* Loading/Error/Empty States */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.loading-spinner,
.error-icon,
.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

.loading-spinner {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  opacity: 0.5;
}

.error-title,
.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.error-message,
.empty-description {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 1.5rem 0;
}

/* Responsive */
@media (max-width: 968px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .form-select {
    width: 100%;
    max-width: none;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
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
<template>
  <main class="drivers-page">
    <header class="page-header">
      <div class="header-top">
        <div>
          <h1 class="page-title">Drivers</h1>
          <p class="page-subtitle">Manage your driver team and assignments</p>
        </div>
        <NuxtLink to="/drivers/new" class="btn btn-primary">
          <PlusIcon :size="18" />
          <span>Add New Driver</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Stats Grid -->
    <section class="stats-grid" aria-label="Driver statistics">
      <article class="stat-card">
        <div class="stat-icon" aria-hidden="true">🚚</div>
        <div class="stat-details">
          <div class="stat-value">{{ stats.active }}</div>
          <div class="stat-label">Active Today</div>
        </div>
      </article>
      <article class="stat-card">
        <div class="stat-icon" aria-hidden="true">👥</div>
        <div class="stat-details">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">Total Drivers</div>
        </div>
      </article>
      <article class="stat-card">
        <div class="stat-icon" aria-hidden="true">⭐</div>
        <div class="stat-details">
          <div class="stat-value">{{ stats.avgRating }}</div>
          <div class="stat-label">Avg Performance</div>
        </div>
      </article>
    </section>

    <!-- Loading State -->
    <section v-if="pending" class="loading-state" aria-live="polite">
      <div class="loading-spinner" aria-hidden="true">⏳</div>
      <p>Loading drivers...</p>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-state" role="alert">
      <div class="error-icon" aria-hidden="true">⚠️</div>
      <h2 class="error-title">Failed to load drivers</h2>
      <p class="error-message">{{ error.message }}</p>
      <button class="btn btn-primary" @click="refresh()">Try Again</button>
    </section>

    <!-- Drivers Content -->
    <template v-else>
      <!-- Filters -->
      <section class="filters-section" aria-label="Filter drivers">
        <form class="filters-group" @submit.prevent>
          <input
            id="search-drivers"
            v-model="searchTerm"
            type="search"
            class="form-input search-input"
            placeholder="Search drivers..."
            aria-label="Search drivers by name or email"
            @input="filterDrivers"
          >
          <select id="filter-status" v-model="statusFilter" class="form-select" @change="filterDrivers">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-route">On Route</option>
          </select>
        </form>
      </section>

      <!-- Drivers Grid for Desktop/Tablet -->
      <section class="drivers-grid desktop-view" aria-label="Drivers list">
        <article v-for="driver in filteredDrivers" :key="driver.id" class="driver-card">
          <header class="driver-header">
            <div class="driver-title-section">
              <h2 class="driver-name">{{ driver.name }}</h2>
              <span :class="['driver-status', `status-${driver.status}`]" role="status">
                {{ driver.status }}
              </span>
            </div>
          </header>

          <dl class="driver-details">
            <div class="detail-row">
              <dt class="detail-label">Email:</dt>
              <dd class="detail-value">{{ driver.email }}</dd>
            </div>
            <div class="detail-row">
              <dt class="detail-label">License:</dt>
              <dd class="detail-value">{{ driver.license }}</dd>
            </div>
            <div class="detail-row">
              <dt class="detail-label">Phone:</dt>
              <dd class="detail-value">{{ driver.phone }}</dd>
            </div>
            <div class="detail-row">
              <dt class="detail-label">Current Route:</dt>
              <dd class="detail-value">{{ driver.current_route || 'None' }}</dd>
            </div>
            <div class="detail-row">
              <dt class="detail-label">Rating:</dt>
              <dd class="detail-value">
                <span class="star" aria-hidden="true">⭐</span>
                {{ Number(driver.rating).toFixed(1) }}/5
              </dd>
            </div>
          </dl>

          <nav class="driver-actions" aria-label="Driver actions">
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

      <!-- Mobile List View (hidden on desktop) -->
      <section v-if="false" class="drivers-list mobile-view" aria-label="Drivers list">
        <article v-for="driver in filteredDrivers" :key="driver.id" class="driver-list-item">
          <header class="driver-list-header">
            <div class="driver-avatar-small" aria-hidden="true">
              {{ driver.name.charAt(0) }}
            </div>
            <div class="driver-list-info">
              <h2 class="driver-list-name">{{ driver.name }}</h2>
              <p class="driver-list-email">{{ driver.email }}</p>
            </div>
            <span :class="['driver-status-badge', `status-${driver.status}`]" role="status">
              {{ driver.status }}
            </span>
          </header>

          <dl class="driver-list-details">
            <div class="detail-item">
              <dt class="visually-hidden">Phone</dt>
              <dd class="detail-content">
                <span class="detail-icon" aria-hidden="true">📞</span>
                <span class="detail-text">{{ driver.phone }}</span>
              </dd>
            </div>
            <div class="detail-item">
              <dt class="visually-hidden">Current Route</dt>
              <dd class="detail-content">
                <span class="detail-icon" aria-hidden="true">🚗</span>
                <span class="detail-text">{{ driver.current_route || 'No route' }}</span>
              </dd>
            </div>
            <div class="detail-item">
              <dt class="visually-hidden">Rating</dt>
              <dd class="detail-content">
                <span class="detail-icon" aria-hidden="true">⭐</span>
                <span class="detail-text">{{ Number(driver.rating).toFixed(1) }}/5</span>
              </dd>
            </div>
          </dl>

          <nav class="driver-list-actions" aria-label="Driver actions">
            <NuxtLink :to="`/drivers/${driver.id}`" class="btn btn-secondary btn-small btn-full">
              View Details
            </NuxtLink>
          </nav>
        </article>
      </section>

      <!-- Empty State -->
      <section v-if="filteredDrivers.length === 0" class="empty-state" aria-live="polite">
        <div class="empty-icon" aria-hidden="true">👥</div>
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

// Fetch drivers from API
const { data: driversData, pending, error, refresh } = await useFetch('/api/drivers', {
  transform: (response) => response.data || []
})

// Computed drivers list
const drivers = computed(() => driversData.value || [])

// Stats
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

// Filtered drivers
const filteredDrivers = ref([])

// Watch for changes in drivers data
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
      // Update local driver data
      driver.status = data.status
      // Refresh the list to update stats
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
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.loading-spinner {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.error-message {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 1.5rem 0;
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
  align-items: center;
  gap: 1rem;
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

.stat-details {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Filters */
.filters-section {
  margin-bottom: 2rem;
}

.filters-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.search-input {
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
  max-width: 200px;
  padding: 0.75rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.2s;
}

.form-select:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Desktop Grid View */
.desktop-view {
  display: grid;
}

.mobile-view {
  display: none;
}

.drivers-grid {
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
}

.driver-title-section {
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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0 0 1.25rem 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}

.detail-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
}

.detail-value {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 600;
  text-align: right;
  margin: 0;
}

.star {
  color: #fbbf24;
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

/* Mobile List View */
.drivers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.driver-list-item {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: var(--shadow);
  border: 2px solid transparent;
  transition: all 0.2s;
}

.driver-list-item:active {
  border-color: var(--button-primary);
}

.driver-list-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.driver-avatar-small {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--button-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.driver-list-info {
  flex: 1;
  min-width: 0;
}

.driver-list-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.driver-list-email {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.driver-status-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  flex-shrink: 0;
}

.driver-list-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-border);
}

.detail-item {
  margin: 0;
}

.detail-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.detail-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.detail-text {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.driver-list-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-full {
  flex: 1;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.empty-description {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 1.5rem 0;
}

/* Responsive */
@media (max-width: 968px) {
  .header-top {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-group {
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
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: flex;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
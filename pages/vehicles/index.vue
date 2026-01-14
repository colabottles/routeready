<template>
  <main class="vehicles-page">
    <header class="page-header">
      <h1 class="page-title">Vehicles</h1>
      <p class="page-subtitle">Manage your fleet and maintenance schedules</p>
      <NuxtLink to="/vehicles/new" class="btn btn-primary">
        <PlusIcon :size="18" />
        <span>Add Vehicle</span>
      </NuxtLink>
    </header>

    <!-- Loading State -->
    <section v-if="pending" class="loading-state" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true">⏳</span>
      <p>Loading vehicles...</p>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-state">
      <span class="error-icon" aria-hidden="true">⚠️</span>
      <h2 class="error-title">Failed to load vehicles</h2>
      <p class="error-message">{{ error.message }}</p>
      <button class="btn btn-primary" @click="refresh()">Try Again</button>
    </section>

    <!-- Vehicles Content -->
    <template v-else>
      <!-- Stats Grid -->
      <section class="stats-grid">
        <article class="stat-card">
          <span class="stat-icon" aria-hidden="true">🚚</span>
          <strong class="stat-value">{{ stats.total }}</strong>
          <span class="stat-label">Total Vehicles</span>
        </article>
        <article class="stat-card">
          <span class="stat-icon" aria-hidden="true">✅</span>
          <strong class="stat-value">{{ stats.active }}</strong>
          <span class="stat-label">Active</span>
        </article>
        <article class="stat-card">
          <span class="stat-icon" aria-hidden="true">🔧</span>
          <strong class="stat-value">{{ stats.maintenance }}</strong>
          <span class="stat-label">In Maintenance</span>
        </article>
        <article class="stat-card">
          <span class="stat-icon" aria-hidden="true">⚠️</span>
          <strong class="stat-value">{{ stats.needsService }}</strong>
          <span class="stat-label">Needs Service</span>
        </article>
      </section>

      <!-- Filters -->
      <form class="filters-section" @submit.prevent>
        <input
          id="search-vehicles"
          v-model="searchTerm"
          type="search"
          class="form-input search-input"
          placeholder="Search vehicles..."
          aria-label="Search vehicles by name or license plate"
          @input="filterVehicles"
        >
        <select id="filter-status" v-model="statusFilter" class="form-select" aria-label="Filter by status" @change="filterVehicles">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select id="filter-type" v-model="typeFilter" class="form-select" aria-label="Filter by type" @change="filterVehicles">
          <option value="">All Types</option>
          <option value="Truck">Truck</option>
          <option value="Van">Van</option>
          <option value="Car">Car</option>
        </select>
      </form>

      <!-- Vehicles Grid -->
      <section class="vehicles-grid">
        <article v-for="vehicle in filteredVehicles" :key="vehicle.id" class="vehicle-card">
          <header class="vehicle-header">
            <span class="vehicle-icon" aria-hidden="true">{{ vehicle.icon }}</span>
            <h2 class="vehicle-name">{{ vehicle.name }}</h2>
            <p class="vehicle-plate">{{ vehicle.license_plate }}</p>
            <span class="vehicle-status" :class="`status-${vehicle.status}`">
              {{ vehicle.status }}
            </span>
          </header>

          <dl class="vehicle-details">
            <dt>Type:</dt>
            <dd>{{ vehicle.type }}</dd>

            <dt>Make/Model:</dt>
            <dd>{{ vehicle.make }} {{ vehicle.model }}</dd>

            <dt>Year:</dt>
            <dd>{{ vehicle.year }}</dd>

            <dt>Mileage:</dt>
            <dd>{{ vehicle.mileage.toLocaleString() }} mi</dd>

            <dt>Driver:</dt>
            <dd>{{ vehicle.assigned_driver || 'Unassigned' }}</dd>

            <dt>Next Service:</dt>
            <dd :class="{ 'service-due': vehicle.service_due }">
              {{ vehicle.next_service || 'Not scheduled' }}
            </dd>
          </dl>

          <nav class="vehicle-actions">
            <NuxtLink :to="`/vehicles/${vehicle.id}`" class="btn btn-secondary btn-small">
              View Details
            </NuxtLink>
            <NuxtLink :to="`/vehicles/service?id=${vehicle.id}`" class="btn btn-primary btn-small">
              Schedule Service
            </NuxtLink>
          </nav>
        </article>
      </section>

      <!-- Empty State -->
      <section v-if="filteredVehicles.length === 0" class="empty-state" aria-live="polite">
        <span class="empty-icon" aria-hidden="true">🚚</span>
        <h2 class="empty-title">No vehicles found</h2>
        <p class="empty-description">Try adjusting your search or filters</p>
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
const typeFilter = ref('')

const { data: vehiclesData, pending, error, refresh } = await useFetch('/api/vehicles', {
  transform: (response) => response.data || []
})

const vehicles = computed(() => vehiclesData.value || [])

const stats = computed(() => {
  const allVehicles = vehicles.value
  const activeVehicles = allVehicles.filter(v => v.status === 'active')
  const maintenanceVehicles = allVehicles.filter(v => v.status === 'maintenance')
  const needsServiceVehicles = allVehicles.filter(v => v.service_due)

  return {
    total: allVehicles.length,
    active: activeVehicles.length,
    maintenance: maintenanceVehicles.length,
    needsService: needsServiceVehicles.length
  }
})

const filteredVehicles = ref([])

watch(vehicles, () => {
  filterVehicles()
}, { immediate: true })

function filterVehicles() {
  if (!vehicles.value) {
    filteredVehicles.value = []
    return
  }

  filteredVehicles.value = vehicles.value.filter(vehicle => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      vehicle.license_plate.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesStatus = !statusFilter.value || vehicle.status === statusFilter.value
    const matchesType = !typeFilter.value || vehicle.type === typeFilter.value

    return matchesSearch && matchesStatus && matchesType
  })
}

useHead({
  title: 'Vehicles - RouteReady',
  meta: [
    { name: 'description', content: 'Manage your vehicle fleet' }
  ]
})
</script>

<style scoped>
.vehicles-page {
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
  grid-template-columns: repeat(4, 1fr);
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
  min-width: 50%;
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

/* Vehicles Grid */
.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
}

.vehicle-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: all 0.2s;
  border: 2px solid transparent;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--button-primary);
}

.vehicle-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto;
  gap: 0.5rem 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-border);
}

.vehicle-icon {
  grid-row: 1 / 3;
  font-size: 3rem;
  line-height: 1;
}

.vehicle-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.vehicle-plate {
  grid-column: 2;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 600;
}

.vehicle-status {
  grid-row: 1 / 3;
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  align-self: start;
}

.status-active {
  background: #10b981;
  color: #ffffff;
}

.status-maintenance {
  background: #f59e0b;
  color: #000000;
}

.status-inactive {
  background: #6b7280;
  color: #ffffff;
}

.vehicle-details {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem 1rem;
  margin: 0 0 1.25rem 0;
  align-items: baseline;
}

.vehicle-details dt {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
}

.vehicle-details dd {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 600;
  text-align: right;
  margin: 0;
}

.service-due {
  color: #f59e0b;
  font-weight: 700;
}

.vehicle-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-small {
  font-size: 0.8125rem;
  padding: 0.5rem 0.875rem;
  flex: 1;
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

  .vehicles-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .vehicle-header {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto auto;
  }

  .vehicle-status {
    grid-column: 2;
    grid-row: 3;
    justify-self: start;
  }

  .vehicle-icon {
    font-size: 2.5rem;
  }
}
</style>
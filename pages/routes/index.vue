<template>
  <div class="routes-page">
    <div class="page-header">
      <div class="header-top">
        <div>
          <h1 class="page-title">Routes</h1>
          <p class="page-subtitle">Manage maintenance routes and assignments</p>
        </div>
        <NuxtLink to="/routes/new" class="btn btn-primary">
          <PlusIcon :size="18" />
          <span>Create Route</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-group">
        <select v-model="statusFilter" class="form-select" @change="filterRoutes">
          <option value="">All Routes</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="planned">Planned</option>
        </select>
        <select v-model="driverFilter" class="form-select" @change="filterRoutes">
          <option value="">All Drivers</option>
          <option value="assigned">Assigned</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>
    </div>

    <!-- Routes Grid -->
    <div class="routes-grid">
      <div v-for="route in filteredRoutes" :key="route.id" class="route-card">
        <div class="route-header">
          <div class="route-title-section">
            <h3 class="route-name">{{ route.name }}</h3>
            <span :class="['route-status', `status-${route.status}`]">
              {{ route.status }}
            </span>
          </div>
          <div class="route-id">{{ route.code }}</div>
        </div>

        <p class="route-description">{{ route.description }}</p>

        <div class="route-details">
          <div class="detail-row">
            <span class="detail-label">Driver:</span>
            <span class="detail-value">{{ route.driver || 'Unassigned' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Properties:</span>
            <span class="detail-value">{{ route.properties }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Distance:</span>
            <span class="detail-value">{{ route.distance }} miles</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duration:</span>
            <span class="detail-value">{{ route.duration }} hrs</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Efficiency:</span>
            <span class="detail-value">{{ route.efficiency }}%</span>
          </div>
        </div>

        <div class="route-timeline">
          <div class="timeline-item">
            <span class="timeline-icon">📍</span>
            <span class="timeline-text">{{ route.start }}</span>
          </div>
          <div class="timeline-divider" />
          <div class="timeline-item">
            <span class="timeline-icon">🏁</span>
            <span class="timeline-text">{{ route.end }}</span>
          </div>
          <div class="timeline-time">
            <span class="timeline-icon">🕐</span>
            <span class="timeline-text">{{ route.startTime }}</span>
          </div>
        </div>

        <div class="route-actions">
          <NuxtLink :to="`/routes/${route.id}`" class="btn btn-secondary btn-small">
            View Details
          </NuxtLink>
          <NuxtLink :to="`/routes/${route.id}/edit`" class="btn btn-secondary btn-small">
            Edit
          </NuxtLink>
          <NuxtLink :to="`/routes/${route.id}/map`" class="btn btn-secondary btn-small">
            View Map
          </NuxtLink>
          <button
            v-if="route.status === 'planned'"
            class="btn btn-success btn-small"
            @click="activateRoute(route)"
          >
            Start Route
          </button>
          <button
            v-if="route.status === 'active'"
            class="btn btn-primary btn-small"
          >
            Optimize
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const statusFilter = ref('')
const driverFilter = ref('')

const routes = reactive([
  {
    id: 1,
    code: 'R1',
    name: 'Downtown Commercial Route',
    description: 'Shopping centers and office buildings',
    driver: 'John Smith',
    properties: 6,
    distance: 32,
    duration: 4.5,
    efficiency: 96,
    start: 'Main Office',
    end: 'Downtown Depot',
    startTime: '8:30 AM',
    status: 'active'
  },
  {
    id: 2,
    code: 'R2',
    name: 'Residential District A',
    description: 'Apartment complexes and condos',
    driver: 'Sarah Johnson',
    properties: 8,
    distance: 28,
    duration: 3.5,
    efficiency: 92,
    start: 'Main Office',
    end: 'North Hub',
    startTime: '9:00 AM',
    status: 'completed'
  },
  {
    id: 3,
    code: 'R3',
    name: 'Industrial Park Route',
    description: 'Warehouses and distribution centers',
    driver: null,
    properties: 5,
    distance: 45,
    duration: 5.0,
    efficiency: 88,
    start: 'South Depot',
    end: 'Industrial Park',
    startTime: '7:00 AM',
    status: 'planned'
  }
])

const filteredRoutes = ref([...routes])

function filterRoutes() {
  filteredRoutes.value = routes.filter(route => {
    const matchesStatus = !statusFilter.value || route.status === statusFilter.value
    const matchesDriver = !driverFilter.value ||
      (driverFilter.value === 'assigned' && route.driver) ||
      (driverFilter.value === 'unassigned' && !route.driver)

    return matchesStatus && matchesDriver
  })
}

function activateRoute(route) {
  route.status = 'active'
  console.log('Activating route:', route.name)
}

useHead({
  title: 'Routes - RouteReady',
  meta: [
    { name: 'description', content: 'Manage maintenance routes' }
  ]
})
</script>

<style scoped>
.routes-page {
  width: 100%;
}

.page-header {
  margin-bottom: 2rem;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.btn-icon {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

/* Filters */
.filters-section {
  background: var(--bg-primary);
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

.filters-group {
  display: flex;
  gap: 1rem;
}

.form-select {
  min-width: 200px;
}

/* Routes Grid */
.routes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.route-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: all 0.2s;
  border: 2px solid transparent;
}

.route-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--button-primary);
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-border);
}

.route-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.route-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.route-id {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.route-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-active {
  background: #10b981;
  color: #ffffff;
}

.status-completed {
  background: #3b82f6;
  color: #ffffff;
}

.status-planned {
  background: #f59e0b;
  color: #000000;
}

.route-description {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  margin: 0 0 1.25rem 0;
  line-height: 1.5;
}

.route-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.detail-value {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 600;
}

.route-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.timeline-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.timeline-text {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
}

.timeline-divider {
  height: 1px;
  background: var(--input-border);
  margin: 0.25rem 0 0.25rem 1.5rem;
}

.timeline-time {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--input-border);
}

.route-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-small {
  font-size: 0.8125rem;
  padding: 0.5rem 0.875rem;
}

@media (max-width: 1200px) {
  .routes-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .routes-grid {
    grid-template-columns: 1fr;
  }

  .header-top {
    flex-direction: column;
    gap: 1rem;
  }

  .filters-group {
    flex-direction: column;
  }

  .form-select {
    width: 100%;
  }
}
</style>
<template>
  <div class="routes-page">
    <div class="page-header">
      <div class="header-top">
        <div>
          <h1 class="page-title">Routes</h1>
          <p class="page-subtitle">Manage maintenance routes and assignments</p>
        </div>
        <NuxtLink to="/routes/new" class="btn btn-primary">
          <svg
xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
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
            <span class="detail-value">{{ route.drivers?.name || 'Unassigned' }}</span>
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
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true" focusable="false">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span class="timeline-text">{{ route.start_address }}</span>
          </div>
          <div class="timeline-divider" />
          <div class="timeline-item">
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true" focusable="false">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
            <span class="timeline-text">{{ route.end_address }}</span>
          </div>
          <div class="timeline-time">
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span class="timeline-text">{{ route.start_time }}</span>
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

    <div v-if="filteredRoutes.length === 0" class="empty-state">
      <svg
xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true" focusable="false" class="empty-icon">
        <path d="M3 12h18" />
        <path d="M3 6h18" />
        <path d="M3 18h18" />
        <circle cx="19" cy="6" r="3" fill="currentColor" stroke="none" />
        <circle cx="19" cy="18" r="3" fill="currentColor" stroke="none" />
      </svg>
      <h3 class="empty-title">No Routes Found</h3>
      <p class="empty-text">
        {{ statusFilter || driverFilter
          ? 'Try adjusting your filters'
          : 'Get started by creating your first route' }}
      </p>
      <NuxtLink to="/routes/new" class="btn btn-primary">
        Create First Route
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const statusFilter = ref('')
const driverFilter = ref('')

const { data: routesRes } = await useFetch('/api/routes')
const routes = reactive(routesRes.value?.data || [])
const filteredRoutes = ref([...routes])

function filterRoutes() {
  filteredRoutes.value = routes.filter(route => {
    const matchesStatus = !statusFilter.value || route.status === statusFilter.value
    const matchesDriver = !driverFilter.value ||
      (driverFilter.value === 'assigned' && route.driver_id) ||
      (driverFilter.value === 'unassigned' && !route.driver_id)
    return matchesStatus && matchesDriver
  })
}

async function activateRoute(route) {
  await $fetch(`/api/routes/${route.id}`, {
    method: 'PUT',
    body: { ...route, status: 'active' }
  })
  route.status = 'active'
}

useHead({
  title: 'Routes - RouteReady',
  meta: [
    { name: 'description', content: 'Manage maintenance routes' }
  ]
})

definePageMeta({
  layout: 'dashboard',
})
</script>

<style scoped>
.routes-page {
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
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--text-secondary);
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

.empty-state {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 4rem 2rem;
  box-shadow: var(--shadow);
  text-align: center;
  margin-top: 1.5rem;
}

.empty-icon {
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.empty-text {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 1.5rem 0;
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
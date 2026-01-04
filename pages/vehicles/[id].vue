<template>
  <main class="vehicle-detail-page">
    <!-- Loading State -->
    <section v-if="pending" class="loading-state" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true">⏳</span>
      <p>Loading vehicle details...</p>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-state">
      <span class="error-icon" aria-hidden="true">⚠️</span>
      <h2 class="error-title">Failed to load vehicle</h2>
      <p class="error-message">{{ error.message }}</p>
      <NuxtLink to="/vehicles" class="btn btn-primary">Back to Vehicles</NuxtLink>
    </section>

    <!-- Vehicle Content -->
    <template v-else-if="vehicle">
      <header class="page-header">
        <NuxtLink to="/vehicles" class="back-link">
          ← Back to Vehicles
        </NuxtLink>
        <h1 class="page-title">{{ vehicle.name }}</h1>
        <p class="page-subtitle">{{ vehicle.type }} - {{ vehicle.license_plate }}</p>
        <nav class="header-actions">
          <NuxtLink :to="`/vehicles/edit-${vehicle.id}`" class="btn btn-secondary">
            Edit Vehicle
          </NuxtLink>
          <NuxtLink :to="`/vehicles/service?id=${vehicle.id}`" class="btn btn-primary btn-small">
            Schedule Service
          </NuxtLink>
        </nav>
      </header>

      <section class="detail-grid">
        <!-- Vehicle Info Card -->
        <article class="card">
          <header class="card-header">
            <h2 class="card-title">Vehicle Information</h2>
          </header>

          <span class="vehicle-icon-large" aria-hidden="true">
            {{ vehicle.icon }}
          </span>
          <span class="vehicle-status-badge" :class="`status-${vehicle.status}`">
            {{ vehicle.status }}
          </span>

          <dl class="info-grid">
            <dt>Vehicle Name</dt>
            <dd>{{ vehicle.name }}</dd>

            <dt>License Plate</dt>
            <dd>{{ vehicle.license_plate }}</dd>

            <dt>Type</dt>
            <dd>{{ vehicle.type }}</dd>

            <dt>Make & Model</dt>
            <dd>{{ vehicle.make }} {{ vehicle.model }}</dd>

            <dt>Year</dt>
            <dd>{{ vehicle.year }}</dd>

            <dt>Mileage</dt>
            <dd>{{ vehicle.mileage.toLocaleString() }} mi</dd>

            <dt>Assigned Driver</dt>
            <dd>{{ vehicle.assigned_driver || 'Unassigned' }}</dd>

            <dt>Next Service</dt>
            <dd :class="{ 'service-due': vehicle.service_due }">
              {{ vehicle.next_service || 'Not scheduled' }}
            </dd>

            <dt>Added</dt>
            <dd>{{ formatDate(vehicle.created_at) }}</dd>

            <dt>Last Updated</dt>
            <dd>{{ formatDate(vehicle.updated_at) }}</dd>
          </dl>
        </article>

        <!-- Service History Placeholder -->
        <article class="card">
          <header class="card-header">
            <h2 class="card-title">Service History</h2>
          </header>
          <p class="empty-state-small">Service history tracking coming soon</p>
        </article>
      </section>
    </template>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const vehicleId = parseInt(route.params.id)

const { data: vehicleData, pending, error } = await useFetch(`/api/vehicles/${vehicleId}`, {
  transform: (response) => response.data
})

const vehicle = computed(() => vehicleData.value)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

useHead({
  title: computed(() => vehicle.value ? `${vehicle.value.name} - Vehicles - RouteReady` : 'Vehicle Details - RouteReady'),
  meta: [
    { name: 'description', content: 'Vehicle details and information' }
  ]
})
</script>

<style scoped>
.vehicle-detail-page {
  width: 100%;
}

.page-header {
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: start;
}

.back-link {
  grid-column: 1 / -1;
  display: inline-flex;
  align-items: center;
  color: var(--button-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  margin-bottom: 0.5rem;
}

.back-link:hover {
  text-decoration: underline;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  grid-column: 1;
  color: var(--text-secondary);
  margin: 0;
  font-size: 1rem;
}

.header-actions {
  grid-column: 2;
  grid-row: 2 / 4;
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.detail-grid {
  display: grid;
  gap: 1.5rem;
}

.card {
  display: grid;
  gap: 1.5rem;
}

.vehicle-icon-large {
  justify-self: center;
  font-size: 6rem;
  line-height: 1;
}

.vehicle-status-badge {
  justify-self: center;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 0;
}

.info-grid dt {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.5rem 0;
}

.info-grid dd {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.service-due {
  color: #f59e0b;
  font-weight: 700;
}

.empty-state-small {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Loading/Error States */
.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.loading-spinner,
.error-icon {
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

.error-icon {
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

@media (max-width: 768px) {
  .page-header {
    grid-template-columns: 1fr;
  }

  .header-actions {
    grid-column: 1;
    grid-row: auto;
    width: 100%;
    flex-direction: column;
  }

  .header-actions .btn {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
<template>
  <main class="driver-detail-page">
    <!-- Loading State -->
    <section v-if="pending" class="loading-state" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true">⏳</span>
      <p>Loading driver details...</p>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-state">
      <span class="error-icon" aria-hidden="true">⚠️</span>
      <h2 class="error-title">Failed to load driver</h2>
      <p class="error-message">{{ error.message }}</p>
      <NuxtLink to="/drivers" class="btn btn-primary">Back to Drivers</NuxtLink>
    </section>

    <!-- Driver Content -->
    <template v-else-if="driver">
      <header class="page-header">
        <NuxtLink to="/drivers" class="back-link">
          ← Back to Drivers
        </NuxtLink>
        <h1 class="page-title">{{ driver.name }}</h1>
        <p class="page-subtitle">Driver Details</p>
        <nav class="header-actions">
          <NuxtLink :to="`/drivers/edit-${driver.id}`" class="btn btn-secondary">
            Edit Driver
          </NuxtLink>
          <button
            :class="['btn', driver.status === 'active' ? 'btn-warning' : 'btn-success']"
            @click="toggleStatus"
          >
            {{ driver.status === 'active' ? 'Deactivate' : 'Activate' }}
          </button>
        </nav>
      </header>

      <section class="detail-grid">
        <!-- Driver Info Card -->
        <article class="card">
          <header class="card-header">
            <h2 class="card-title">Driver Information</h2>
          </header>

          <span class="driver-avatar-large" aria-hidden="true">
            {{ driver.name.charAt(0) }}
          </span>
          <span class="status-badge-large" :class="`status-${driver.status}`">
            {{ driver.status }}
          </span>

          <dl class="info-grid">
            <dt>Full Name</dt>
            <dd>{{ driver.name }}</dd>

            <dt>Email</dt>
            <dd>{{ driver.email }}</dd>

            <dt>License Number</dt>
            <dd>{{ driver.license }}</dd>

            <dt>Phone Number</dt>
            <dd>{{ driver.phone }}</dd>

            <dt>Current Route</dt>
            <dd>{{ driver.current_route || 'Not assigned' }}</dd>

            <dt>Performance Rating</dt>
            <dd>
              <span aria-hidden="true">⭐</span>
              {{ Number(driver.rating).toFixed(1) }}/5
            </dd>

            <dt>Joined</dt>
            <dd>{{ formatDate(driver.created_at) }}</dd>

            <dt>Last Updated</dt>
            <dd>{{ formatDate(driver.updated_at) }}</dd>
          </dl>
        </article>

        <!-- Recent Activity Placeholder -->
        <article class="card">
          <header class="card-header">
            <h2 class="card-title">Recent Activity</h2>
          </header>
          <p class="empty-state-small">Activity tracking coming soon</p>
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
const driverId = parseInt(route.params.id)

const { data: driverData, pending, error, refresh } = await useFetch(`/api/drivers/${driverId}`, {
  transform: (response) => response.data
})

const driver = computed(() => driverData.value)

const toggleStatus = async () => {
  if (!driver.value) return

  const newStatus = driver.value.status === 'active' ? 'inactive' : 'active'

  try {
    const { data } = await $fetch(`/api/drivers/${driverId}`, {
      method: 'PUT',
      body: {
        ...driver.value,
        status: newStatus
      }
    })

    if (data) {
      await refresh()
    }
  } catch (err) {
    console.error('Error updating driver status:', err)
    alert('Failed to update driver status. Please try again.')
  }
}

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
  title: computed(() => driver.value ? `${driver.value.name} - Drivers - RouteReady` : 'Driver Details - RouteReady'),
  meta: [
    { name: 'description', content: 'Driver details and information' }
  ]
})
</script>

<style scoped>
.driver-detail-page {
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

.detail-grid {
  display: grid;
  gap: 1.5rem;
}

.card {
  display: grid;
  gap: 1.5rem;
}

.driver-avatar-large {
  justify-self: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--button-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
}

.status-badge-large {
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

.status-inactive {
  background: #6b7280;
  color: #ffffff;
}

.status-on-route {
  background: #f59e0b;
  color: #000000;
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
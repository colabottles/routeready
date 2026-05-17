<template>
  <main class="driver-detail-page">

    <!-- Loading State -->
    <section v-if="pending" class="loading-state" aria-live="polite">
      <svg
xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" aria-hidden="true" class="loading-spinner">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <p>Loading driver details...</p>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-state">
      <svg
xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" aria-hidden="true" class="error-icon">
        <path
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <h2 class="error-title">Failed to load driver</h2>
      <p class="error-message">{{ error.message }}</p>
      <NuxtLink to="/drivers" class="btn btn-primary">Back to Drivers</NuxtLink>
    </section>

    <!-- Driver Content -->
    <template v-else-if="driver">
      <header class="page-header">
        <NuxtLink to="/drivers" class="back-link">
          <svg
xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Drivers
        </NuxtLink>
        <div class="header-main">
          <div>
            <h1 class="page-title">{{ driver.name }}</h1>
            <p class="page-subtitle">Driver Details</p>
          </div>
          <nav class="header-actions" :aria-label="`Actions for ${driver.name}`">
            <NuxtLink :to="`/drivers/edit-${driver.id}`" class="btn btn-secondary">
              <svg
xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Edit Driver</span>
            </NuxtLink>
            <button
              :class="['btn', driver.status === 'active' ? 'btn-deactivate' : 'btn-activate']"
              @click="toggleStatus">
              {{ driver.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
          </nav>
        </div>
      </header>

      <div class="detail-grid">
        <!-- Driver Info Card -->
        <article class="card">
          <header class="card-header">
            <h2 class="card-title">Driver Information</h2>
          </header>
          <div class="card-body">
            <div class="driver-profile">
              <div class="driver-avatar-large" aria-hidden="true">
                {{ driver.name.charAt(0) }}
              </div>
              <span class="status-badge-large" :class="`status-${driver.status}`">
                {{ driver.status }}
              </span>
            </div>

            <dl class="info-grid">
              <div class="info-item">
                <dt>
                  <svg
xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Full Name
                </dt>
                <dd>{{ driver.name }}</dd>
              </div>

              <div class="info-item">
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

              <div class="info-item">
                <dt>
                  <svg
xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" aria-hidden="true">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <line x1="9" y1="7" x2="15" y2="7" />
                  </svg>
                  License Number
                </dt>
                <dd>{{ driver.license }}</dd>
              </div>

              <div class="info-item">
                <dt>
                  <svg
xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" aria-hidden="true">
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.63 4.35 2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Phone Number
                </dt>
                <dd>{{ driver.phone }}</dd>
              </div>

              <div class="info-item">
                <dt>
                  <svg
xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 12h18" />
                    <path d="M3 6l9-3 9 3" />
                    <path d="M3 18l9 3 9-3" />
                    <path d="M12 3v18" />
                  </svg>
                  Current Route
                </dt>
                <dd>{{ driver.current_route_id || 'Not assigned' }}</dd>
              </div>

              <div class="info-item">
                <dt>
                  <svg
xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" aria-hidden="true">
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Performance Rating
                </dt>
                <dd>{{ Number(driver.rating).toFixed(1) }} / 5</dd>
              </div>

              <div class="info-item">
                <dt>
                  <svg
xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Joined
                </dt>
                <dd>{{ formatDate(driver.created_at) }}</dd>
              </div>

              <div class="info-item">
                <dt>
                  <svg
xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" aria-hidden="true">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  Last Updated
                </dt>
                <dd>{{ formatDate(driver.updated_at) }}</dd>
              </div>
            </dl>
          </div>
        </article>

        <!-- Recent Activity -->
        <article class="card">
          <header class="card-header">
            <h2 class="card-title">Recent Activity</h2>
          </header>
          <div class="card-body">
            <div class="empty-activity">
              <svg
xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" class="empty-icon">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <p>Activity tracking coming soon</p>
            </div>
          </div>
        </article>
      </div>
    </template>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const driverId = (route.params.id)

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
  max-width: 1400px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--button-primary);
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  transition: background 0.2s;
}

.back-link:hover {
  background: rgba(102, 126, 234, 0.2);
  text-decoration: none;
}

.page-header {
  margin-bottom: 2rem;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.header-actions .btn-secondary {
  background-color: var(--button-primary);
  color: white;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.card {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--input-border);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.card-body {
  padding: 1.5rem;
}

.driver-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--input-border);
}

.driver-avatar-large {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--button-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.status-badge-large {
  padding: 0.375rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
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
  gap: 1.25rem;
  margin: 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.info-item dt {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.info-item dd {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.empty-activity {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 2rem;
  color: var(--text-secondary);
  text-align: center;
}

.empty-icon {
  opacity: 0.4;
}

.btn-deactivate {
  background: #dc2626;
  color: white;
  border: 2px solid #dc2626;
}

.btn-deactivate:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}

.btn-activate {
  background: #10b981;
  color: white;
  border: 2px solid #10b981;
}

.btn-activate:hover {
  background: #059669;
  border-color: #059669;
}

/* Loading/Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
  gap: 1rem;
}

.loading-spinner {
  color: var(--button-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.error-icon {
  color: #ef4444;
  opacity: 0.8;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.error-message {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

@media (max-width: 1024px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-main {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
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
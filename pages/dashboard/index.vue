<template>
  <main class="dashboard-page">
    <header class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Welcome to RouteReady - Your route management and dispatching hub</p>
    </header>

    <!-- Quick Stats Overview -->
    <section class="stats-overview" aria-labelledby="stats-heading">
      <h2 id="stats-heading" class="visually-hidden">Quick Statistics</h2>
      <div class="stats-grid">
        <article class="stat-card">
          <!-- Active Drivers -->
          <div class="stat-icon-wrapper" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-label">Active Drivers</h3>
            <p class="stat-value">{{ stats.activeDrivers }}</p>
            <p class="stat-change positive">
              <span class="change-arrow" aria-hidden="true">↑</span>
              <span>{{ stats.driverChange }}% from last week</span>
            </p>
          </div>
        </article>

        <article class="stat-card">
          <!-- Today's Routes -->
          <div class="stat-icon-wrapper" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <path d="M3 12h18" />
              <path d="M3 6l9-3 9 3" />
              <path d="M3 18l9 3 9-3" />
              <path d="M12 3v18" />
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-label">Today's Routes</h3>
            <p class="stat-value">{{ stats.todayRoutes }}</p>
            <p class="stat-change positive">
              <span class="change-arrow" aria-hidden="true">↑</span>
              <span>{{ stats.routeChange }}% from yesterday</span>
            </p>
          </div>
        </article>

        <article class="stat-card">
          <!-- Active Vehicles -->
          <div class="stat-icon-wrapper" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <rect x="1" y="3" width="15" height="13" rx="1" />
              <path d="M16 8h4l3 4v4h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-label">Active Vehicles</h3>
            <p class="stat-value">{{ stats.activeVehicles }}/{{ stats.totalVehicles }}</p>
            <p class="stat-change neutral">
              <span>{{ stats.vehicleUtilization }}% utilization</span>
            </p>
          </div>
        </article>

        <article class="stat-card">
          <!-- Completion Rate -->
          <div class="stat-icon-wrapper" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-label">Completion Rate</h3>
            <p class="stat-value">{{ stats.completionRate }}%</p>
            <p class="stat-change positive">
              <span class="change-arrow" aria-hidden="true">↑</span>
              <span>{{ stats.completionChange }}% from last month</span>
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- Main Navigation Cards -->
    <section class="navigation-section" aria-labelledby="nav-heading">
      <h2 id="nav-heading" class="section-title">Quick Access</h2>
      <nav class="nav-cards-grid" aria-label="Dashboard quick access">
        <article class="nav-card">
          <!-- Drivers -->
          <div class="nav-card-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div class="nav-card-content">
            <h3 class="nav-card-title">Drivers</h3>
            <p class="nav-card-description">
              Manage driver profiles, assignments, and performance tracking
            </p>
            <dl class="nav-card-stats">
              <div class="stat-item">
                <dt>Total</dt>
                <dd>{{ stats.totalDrivers }}</dd>
              </div>
              <div class="stat-item">
                <dt>Active</dt>
                <dd>{{ stats.activeDrivers }}</dd>
              </div>
            </dl>
          </div>
          <footer class="nav-card-footer">
            <NuxtLink to="/drivers" class="nav-card-link">
              Manage Drivers
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </footer>
        </article>

        <article class="nav-card">
          <!-- Routes -->
          <div class="nav-card-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
          </div>
          <div class="nav-card-content">
            <h3 class="nav-card-title">Routes</h3>
            <p class="nav-card-description">
              Plan, optimize, and dispatch routes for properties and service areas
            </p>
            <dl class="nav-card-stats">
              <div class="stat-item">
                <dt>Total</dt>
                <dd>{{ stats.totalRoutes }}</dd>
              </div>
              <div class="stat-item">
                <dt>Active</dt>
                <dd>{{ stats.activeRoutes }}</dd>
              </div>
            </dl>
          </div>
          <footer class="nav-card-footer">
            <NuxtLink to="/routes" class="nav-card-link">
              Manage Routes
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </footer>
        </article>

        <article class="nav-card">
          <!-- Vehicles -->
          <div class="nav-card-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <rect x="1" y="3" width="15" height="13" rx="1" />
              <path d="M16 8h4l3 4v4h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div class="nav-card-content">
            <h3 class="nav-card-title">Vehicles</h3>
            <p class="nav-card-description">
              Track fleet status, maintenance schedules, and vehicle availability
            </p>
            <dl class="nav-card-stats">
              <div class="stat-item">
                <dt>Total</dt>
                <dd>{{ stats.totalVehicles }}</dd>
              </div>
              <div class="stat-item">
                <dt>Active</dt>
                <dd>{{ stats.activeVehicles }}</dd>
              </div>
            </dl>
          </div>
          <footer class="nav-card-footer">
            <NuxtLink to="/vehicles" class="nav-card-link">
              Manage Vehicles
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </footer>
        </article>

        <article class="nav-card">
          <!-- Schedule -->
          <div class="nav-card-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="8" y1="14" x2="8" y2="14" />
              <line x1="12" y1="14" x2="12" y2="14" />
              <line x1="16" y1="14" x2="16" y2="14" />
              <line x1="8" y1="18" x2="8" y2="18" />
              <line x1="12" y1="18" x2="12" y2="18" />
            </svg>
          </div>
          <div class="nav-card-content">
            <h3 class="nav-card-title">Schedule</h3>
            <p class="nav-card-description">
              Create and manage driver schedules across daily, weekly, and monthly views
            </p>
            <dl class="nav-card-stats">
              <div class="stat-item">
                <dt>Today</dt>
                <dd>{{ stats.todaySchedules }}</dd>
              </div>
              <div class="stat-item">
                <dt>This Week</dt>
                <dd>{{ stats.weekSchedules }}</dd>
              </div>
            </dl>
          </div>
          <footer class="nav-card-footer">
            <NuxtLink to="/schedule" class="nav-card-link">
              View Schedule
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </footer>
        </article>

        <article class="nav-card">
          <!-- Reports -->
          <div class="nav-card-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
              <line x1="2" y1="20" x2="22" y2="20" />
            </svg>
          </div>
          <div class="nav-card-content">
            <h3 class="nav-card-title">Reports</h3>
            <p class="nav-card-description">
              Generate detailed reports on routes, dispatches, and operational performance
            </p>
            <dl class="nav-card-stats">
              <div class="stat-item">
                <dt>Generated</dt>
                <dd>{{ stats.reportsGenerated }}</dd>
              </div>
              <div class="stat-item">
                <dt>This Month</dt>
                <dd>{{ stats.monthReports }}</dd>
              </div>
            </dl>
          </div>
          <footer class="nav-card-footer">
            <NuxtLink to="/reports" class="nav-card-link">
              View Reports
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </footer>
        </article>

        <article class="nav-card">
          <!-- Analytics -->
          <div class="nav-card-icon" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div class="nav-card-content">
            <h3 class="nav-card-title">Analytics</h3>
            <p class="nav-card-description">
              Deep insights into route performance, dispatch metrics, and operational intelligence
            </p>
            <dl class="nav-card-stats">
              <div class="stat-item">
                <dt>Efficiency</dt>
                <dd>{{ stats.efficiency }}%</dd>
              </div>
              <div class="stat-item">
                <dt>On-Time</dt>
                <dd>{{ stats.onTimeRate }}%</dd>
              </div>
            </dl>
          </div>
          <footer class="nav-card-footer">
            <NuxtLink to="/analytics" class="nav-card-link">
              View Analytics
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </footer>
        </article>
      </nav>
    </section>

    <!-- Recent Activity -->
    <section class="recent-activity" aria-labelledby="activity-heading">
      <h2 id="activity-heading" class="section-title">Recent Activity</h2>
      <article class="card">
        <div class="card-content">
          <ul class="activity-list">
            <li v-for="activity in recentActivity" :key="activity.id" class="activity-item">
              <div class="activity-icon" :class="`activity-${activity.type}`" aria-hidden="true">
                <span>{{ activity.icon }}</span>
              </div>
              <div class="activity-content">
                <p class="activity-text">{{ activity.text }}</p>
                <time :datetime="activity.timestamp" class="activity-time">
                  {{ formatTime(activity.timestamp) }}
                </time>
              </div>
            </li>
          </ul>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
const { data: statsData } = await useAsyncData('dashboard-stats', () =>
  $fetch('/api/dashboard/stats')
)

const stats = computed(() => ({
  activeDrivers: statsData.value?.activeDrivers ?? 0,
  totalDrivers: statsData.value?.totalDrivers ?? 0,
  driverChange: 0,
  todayRoutes: statsData.value?.activeRoutes ?? 0,
  routeChange: 0,
  activeVehicles: statsData.value?.activeVehicles ?? 0,
  totalVehicles: statsData.value?.totalVehicles ?? 0,
  vehicleUtilization: statsData.value?.vehicleUtilization ?? 0,
  completionRate: statsData.value?.completionRate ?? 0,
  completionChange: 0,
  totalRoutes: statsData.value?.totalRoutes ?? 0,
  activeRoutes: statsData.value?.activeRoutes ?? 0,
  todaySchedules: statsData.value?.todaySchedules ?? 0,
  weekSchedules: statsData.value?.weekSchedules ?? 0,
  reportsGenerated: 0,
  monthReports: 0,
  efficiency: 0,
  onTimeRate: statsData.value?.completionRate ?? 0,
}))

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Dashboard - RouteReady',
  meta: [
    { name: 'description', content: 'RouteReady dashboard - Manage your route planning and dispatching operations' }
  ]
})
</script>

<style scoped>
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

.dashboard-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
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

/* Quick Stats */
.stats-overview {
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-change.neutral {
  color: var(--text-secondary);
}

.change-arrow {
  font-size: 0.875rem;
}

/* Navigation Cards */
.stat-icon-wrapper svg,
.nav-card-icon svg {
  stroke: currentColor;
}

.navigation-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
}

.nav-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.nav-card {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--button-primary);
}

.nav-card-icon {
  background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.nav-card-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.nav-card-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--input-border);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-item dt {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.stat-item dd {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.nav-card-footer {
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border-top: 1px solid var(--input-border);
}

.nav-card-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--button-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: gap 0.2s;
}

.nav-card-link:hover {
  gap: 0.5rem;
}

/* Recent Activity */
.recent-activity {
  margin-bottom: 2rem;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.activity-item:hover {
  background: var(--bg-secondary);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.activity-maintenance {
  background: rgba(16, 185, 129, 0.1);
}

.activity-schedule {
  background: rgba(59, 130, 246, 0.1);
}

.activity-vehicle {
  background: rgba(245, 158, 11, 0.1);
}

.activity-driver {
  background: rgba(139, 92, 246, 0.1);
}

.activity-route {
  background: rgba(236, 72, 153, 0.1);
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-text {
  font-size: 0.9375rem;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-style: normal;
}

/* Responsive */
@media (max-width: 1200px) {
  .nav-cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .nav-cards-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 1rem;
  }

  .nav-card-content {
    padding: 1rem;
  }
}
</style>
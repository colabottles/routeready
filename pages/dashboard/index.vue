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
          <div class="stat-icon-wrapper" aria-hidden="true">
            <span class="stat-icon">👥</span>
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
          <div class="stat-icon-wrapper" aria-hidden="true">
            <span class="stat-icon">📦</span>
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
          <div class="stat-icon-wrapper" aria-hidden="true">
            <span class="stat-icon">🚚</span>
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
          <div class="stat-icon-wrapper" aria-hidden="true">
            <span class="stat-icon">✅</span>
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
          <div class="nav-card-icon" aria-hidden="true">
            <span class="icon-large">👥</span>
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
          <div class="nav-card-icon" aria-hidden="true">
            <span class="icon-large">🗺️</span>
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
          <div class="nav-card-icon" aria-hidden="true">
            <span class="icon-large">🚚</span>
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
          <div class="nav-card-icon" aria-hidden="true">
            <span class="icon-large">📅</span>
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
          <div class="nav-card-icon" aria-hidden="true">
            <span class="icon-large">📈</span>
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
          <div class="nav-card-icon" aria-hidden="true">
            <span class="icon-large">📊</span>
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
definePageMeta({
  layout: 'dashboard',
})

// Sample stats data - replace with actual API calls
const stats = reactive({
  activeDrivers: 12,
  totalDrivers: 15,
  driverChange: 8.3,
  todayRoutes: 45,
  routeChange: 12.5,
  activeVehicles: 10,
  totalVehicles: 15,
  vehicleUtilization: 67,
  completionRate: 94.2,
  completionChange: 3.2,
  totalRoutes: 25,
  activeRoutes: 18,
  todaySchedules: 12,
  weekSchedules: 68,
  reportsGenerated: 156,
  monthReports: 23,
  efficiency: 92.8,
  onTimeRate: 94.2
})

const recentActivity = reactive([
  {
    id: 1,
    type: 'delivery',
    icon: '📦',
    text: 'John Smith completed Downtown Commercial route - 12 stops serviced',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 2,
    type: 'schedule',
    icon: '📅',
    text: 'New route dispatched to Sarah Johnson - Residential North properties',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 3,
    type: 'vehicle',
    icon: '🚚',
    text: 'Truck #5 maintenance completed - returned to active duty',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 4,
    type: 'driver',
    icon: '👥',
    text: 'Mike Davis achieved 100% on-time completion rate this week',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 5,
    type: 'route',
    icon: '🗺️',
    text: 'Industrial Park route optimized - saved 8.5 miles',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  }
])

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

.stat-icon {
  font-size: 1.75rem;
  line-height: 1;
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

.icon-large {
  font-size: 3rem;
  line-height: 1;
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

.activity-delivery {
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
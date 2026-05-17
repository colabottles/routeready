<template>
  <main class="reports-page">
    <header class="page-header">
      <div class="header-top">
        <div>
          <h1 class="page-title">Reports</h1>
          <p class="page-subtitle">Route and dispatch performance insights</p>
        </div>
        <button type="button" class="btn btn-primary" @click="generateReport">
          <svg
xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true" focusable="false">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          Generate Report
        </button>
      </div>
    </header>

    <!-- Date Range Filter -->
    <section class="filters-section" aria-label="Report filters">
      <div class="filters-group">
        <label for="period-select" class="visually-hidden">Select time period</label>
        <select
id="period-select" v-model="selectedPeriod" class="form-select"
          @change="updatePeriod">
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
        <label for="report-type-select" class="visually-hidden">Select report type</label>
        <select
id="report-type-select" v-model="selectedReport" class="form-select"
          @change="updateReport">
          <option value="overview">Overview</option>
          <option value="route">Route Performance</option>
          <option value="driver">Driver Performance</option>
          <option value="vehicle">Vehicle Utilization</option>
          <option value="dispatch">Dispatch Efficiency</option>
        </select>
      </div>
    </section>

    <!-- Key Metrics -->
    <section class="metrics-section" aria-labelledby="metrics-heading">
      <h2 id="metrics-heading" class="visually-hidden">Key Performance Metrics</h2>
      <div class="metrics-grid">
        <article class="metric-card">
          <div class="metric-header">
            <span class="metric-icon" aria-hidden="true">
              <svg
xmlns="http://www.w3.org/2000/svg"
                width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                focusable="false" class="metric-icon">
                <circle cx="3" cy="6" r="2" />
                <circle cx="21" cy="18" r="2" />
                <path d="M3 8v4a4 4 0 0 0 4 4h10v-4a4 4 0 0 0-4-4H3" />
              </svg>
            </span>
            <span class="metric-change positive">+12%</span>
          </div>
          <p class="metric-value">{{ metrics.totalRoutes }}</p>
          <p class="metric-label">Total Routes</p>
          <p class="metric-subtext">vs last period</p>
        </article>

        <article class="metric-card">
          <div class="metric-header">
            <span class="metric-icon" aria-hidden="true">
              <svg
xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false" class="metric-icon">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </span>
            <span class="metric-change positive">+5%</span>
          </div>
          <p class="metric-value">{{ metrics.onTimeRate }}%</p>
          <p class="metric-label">On-Time Completion</p>
          <p class="metric-subtext">vs last period</p>
        </article>

        <article class="metric-card">
          <div class="metric-header">
            <span class="metric-icon" aria-hidden="true">
              <svg
xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false" class="metric-icon">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h4l3 5v3h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </span>
            <span class="metric-change negative">-3%</span>
          </div>
          <p class="metric-value">{{ metrics.avgDistance }} mi</p>
          <p class="metric-label">Avg Distance</p>
          <p class="metric-subtext">vs last period</p>
        </article>

        <article class="metric-card">
          <div class="metric-header">
            <span class="metric-icon" aria-hidden="true">
              <svg
xmlns="http://www.w3.org/2000/svg"
                width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                focusable="false" class="metric-icon">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
            <span class="metric-change positive">+8%</span>
          </div>
          <p class="metric-value">${{ metrics.costPerRoute }}</p>
          <p class="metric-label">Cost Per Route</p>
          <p class="metric-subtext">vs last period</p>
        </article>
      </div>
    </section>

    <!-- Charts Section -->
    <section class="charts-section" aria-labelledby="charts-heading">
      <h2 id="charts-heading" class="visually-hidden">Performance Charts</h2>
      <article class="chart-card large">
        <header class="chart-header">
          <h3 class="chart-title">Routes Over Time</h3>
          <label for="chart-period-select" class="visually-hidden">Select chart time period</label>
          <select id="chart-period-select" class="chart-select">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </header>
        <figure class="chart-placeholder">
          <figcaption class="visually-hidden">Daily routes completed chart</figcaption>
          <div class="placeholder-text" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Chart: Daily Routes Completed
          </div>
          <div class="placeholder-subtext" aria-hidden="true">Integration with Chart.js or similar
            would go here</div>
        </figure>
      </article>

      <article class="chart-card">
        <header class="chart-header">
          <h3 class="chart-title">Route Status</h3>
        </header>
        <figure class="chart-placeholder small">
          <figcaption class="visually-hidden">Route status distribution</figcaption>
          <div class="placeholder-text" aria-hidden="true">
            <svg
xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
            Pie Chart
          </div>
          <dl class="status-breakdown">
            <div class="status-item">
              <dt>
                <span class="status-dot completed" aria-hidden="true" />
                <span>Completed</span>
              </dt>
              <dd>{{routes.filter(r => r.status === 'completed').length}}</dd>
            </div>
            <div class="status-item">
              <dt>
                <span class="status-dot pending" aria-hidden="true" />
                <span>In Progress</span>
              </dt>
              <dd>{{routes.filter(r => r.status === 'active').length}}</dd>
            </div>
            <div class="status-item">
              <dt>
                <span class="status-dot failed" aria-hidden="true" />
                <span>Planned</span>
              </dt>
              <dd>{{routes.filter(r => r.status === 'planned').length}}</dd>
            </div>
          </dl>
        </figure>
      </article>
    </section>

    <!-- Performance Tables -->
    <section class="tables-section" aria-labelledby="tables-heading">
      <h2 id="tables-heading" class="visually-hidden">Performance Tables</h2>

      <article class="card">
        <header class="card-header">
          <h3 class="card-title">Top Performing Drivers</h3>
          <NuxtLink to="/drivers" class="view-all-link">View All</NuxtLink>
        </header>
        <div class="card-content">
          <div class="performance-table">
            <div class="table-header" role="row">
              <div class="col-rank" role="columnheader">Rank</div>
              <div class="col-name" role="columnheader">Driver</div>
              <div class="col-metric" role="columnheader">Routes</div>
              <div class="col-metric" role="columnheader">On-Time Rate</div>
              <div class="col-metric" role="columnheader">Rating</div>
            </div>
            <div
v-for="(driver, index) in topDrivers" :key="driver.id" class="table-row"
              role="row">
              <div class="col-rank" role="cell">
                <span class="rank-badge" :class="`rank-${index + 1}`">{{ index + 1 }}</span>
              </div>
              <div class="col-name" role="cell">
                <div class="driver-cell">
                  <div class="driver-avatar-small" aria-hidden="true">{{ driver.name.charAt(0) }}
                  </div>
                  <span>{{ driver.name }}</span>
                </div>
              </div>
              <div class="col-metric" role="cell">{{ driver.routes }}</div>
              <div class="col-metric" role="cell">{{ driver.onTimeRate }}%</div>
              <div class="col-metric" role="cell">
                <div class="rating">
                  <span class="star" aria-hidden="true">
                    <svg
xmlns="http://www.w3.org/2000/svg"
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="currentColor" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round" aria-hidden="true" class="star">
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </span>
                  <span>{{ driver.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <article class="card">
        <header class="card-header">
          <h3 class="card-title">Route Efficiency</h3>
          <NuxtLink to="/routes" class="view-all-link">View All</NuxtLink>
        </header>
        <div class="card-content">
          <div class="performance-table">
            <div class="table-header" role="row">
              <div class="col-name" role="columnheader">Route</div>
              <div class="col-metric" role="columnheader">Distance</div>
              <div class="col-metric" role="columnheader">Duration</div>
              <div class="col-metric" role="columnheader">Efficiency</div>
            </div>
            <div v-for="route in topRoutes" :key="route.id" class="table-row" role="row">
              <div class="col-name" role="cell">{{ route.name }}</div>
              <div class="col-metric" role="cell">{{ route.distance }} mi</div>
              <div class="col-metric" role="cell">{{ route.duration }} hrs</div>
              <div class="col-metric" role="cell">
                <div
                  class="efficiency-bar"
                  role="progressbar"
                  :aria-label="`${route.name} efficiency`"
                  :aria-valuenow="route.efficiency"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-valuetext="`${route.efficiency}% efficient`">
                  <div class="efficiency-fill" :style="{ width: route.efficiency + '%' }"/>
                  <span class="efficiency-text">{{ route.efficiency }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
const selectedPeriod = ref('month')
const selectedReport = ref('overview')

const [routesRes, driversRes] = await Promise.all([
  useFetch('/api/routes'),
  useFetch('/api/drivers')
])

const routes = reactive(routesRes.data.value?.data || [])
const drivers = reactive(driversRes.data.value?.data || [])

const metrics = computed(() => {
  const total = routes.length
  const completed = routes.filter(r => r.status === 'completed').length
  const onTimeRate = total > 0 ? Math.round((completed / total) * 100 * 10) / 10 : 0
  const distances = routes.filter(r => r.distance).map(r => Number(r.distance))
  const avgDistance = distances.length > 0
    ? Math.round(distances.reduce((a, b) => a + b, 0) / distances.length * 10) / 10
    : 0
  return {
    totalRoutes: total,
    onTimeRate,
    avgDistance,
    costPerRoute: 0
  }
})

const topDrivers = computed(() =>
  [...drivers]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5)
    .map(d => ({
      id: d.id,
      name: d.name,
      routes: routes.filter(r => r.driver_id === d.id).length,
      onTimeRate: 0,
      rating: d.rating || 0
    }))
)

const topRoutes = computed(() =>
  [...routes]
    .filter(r => r.efficiency)
    .sort((a, b) => Number(b.efficiency) - Number(a.efficiency))
    .slice(0, 4)
    .map(r => ({
      id: r.id,
      name: r.name,
      distance: r.distance,
      duration: r.duration,
      efficiency: r.efficiency
    }))
)

function updatePeriod() {
  console.log('Update period:', selectedPeriod.value)
}

function updateReport() {
  console.log('Update report:', selectedReport.value)
}

function generateReport() {
  console.log('Generate custom report')
}

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Reports - RouteReady',
  meta: [
    { name: 'description', content: 'View route and dispatch analytics and reports' }
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

.reports-page {
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

/* Metrics Grid */
.metrics-section {
  margin-bottom: 2rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-icon {
  color: var(--button-primary);
  flex-shrink: 0;
}

.metric-change {
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.metric-change.positive {
  background: #d1fae5;
  color: #065f46;
}

.metric-change.negative {
  background: #fee2e2;
  color: #991b1b;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.metric-label {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0 0 0.25rem 0;
}

.metric-subtext {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.chart-card.large {
  grid-column: 1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-border);
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.chart-select {
  padding: 0.5rem;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-primary);
  border-radius: 6px;
  font-size: 0.875rem;
}

.chart-placeholder {
  height: 300px;
  background: var(--bg-secondary);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0;
}

.chart-placeholder.small {
  height: 250px;
}

.placeholder-text {
  font-size: 1.125rem;
  color: var(--text-primary);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.placeholder-subtext {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.status-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.status-item {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.75rem;
}

.status-item dt {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
  margin: 0;
}

.status-item dd {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 600;
  margin: 0;
  text-align: right;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.completed {
  background: #10b981;
}

.status-dot.pending {
  background: #f59e0b;
}

.status-dot.failed {
  background: #ef4444;
}

/* Performance Tables */
.tables-section {
  display: grid;
  gap: 1.5rem;
}

.view-all-link {
  color: var(--button-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

.view-all-link:hover {
  text-decoration: underline;
}

.performance-table {
  display: flex;
  flex-direction: column;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 80px 1fr repeat(3, 150px);
  padding: 1rem;
  align-items: center;
  gap: 1rem;
}

.table-header {
  background: var(--bg-secondary);
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.table-row {
  border-bottom: 1px solid var(--input-border);
  transition: background 0.2s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: var(--bg-secondary);
}

.col-rank {
  text-align: center;
}

.col-name {
  color: var(--text-primary);
  font-weight: 500;
}

.col-metric {
  color: var(--text-primary);
  font-weight: 600;
  text-align: center;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.875rem;
}

.rank-1 {
  background: #fbbf24;
  color: #000;
}

.rank-2 {
  background: #d1d5db;
  color: #000;
}

.rank-3 {
  background: #d97706;
  color: #fff;
}

.rank-4,
.rank-5 {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.driver-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.driver-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--button-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.star {
  color: #fbbf24;
}

.efficiency-bar {
  position: relative;
  height: 24px;
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
}

.efficiency-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--button-primary), #818cf8);
  transition: width 0.3s;
}

.efficiency-text {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  z-index: 1;
}

@media (max-width: 1200px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
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

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .table-header,
  .table-row {
    grid-template-columns: 60px 1fr 100px;
    font-size: 0.8125rem;
  }

  .col-metric:nth-child(4),
  .col-metric:nth-child(5) {
    display: none;
  }
}
</style>
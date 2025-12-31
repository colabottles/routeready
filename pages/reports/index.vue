<template>
  <div class="reports-page">
    <div class="page-header">
      <div class="header-top">
        <div>
          <h1 class="page-title">Reports</h1>
          <p class="page-subtitle">Analytics and performance insights</p>
        </div>
        <button class="btn btn-primary" @click="generateReport">
          <span class="btn-icon">📊</span>
          Generate Report
        </button>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="filters-section">
      <div class="filters-group">
        <select v-model="selectedPeriod" class="form-select" @change="updatePeriod">
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
        <select v-model="selectedReport" class="form-select" @change="updateReport">
          <option value="overview">Overview</option>
          <option value="delivery">Delivery Performance</option>
          <option value="driver">Driver Performance</option>
          <option value="vehicle">Vehicle Utilization</option>
          <option value="route">Route Efficiency</option>
        </select>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-icon">📦</span>
          <span class="metric-change positive">+12%</span>
        </div>
        <div class="metric-value">{{ metrics.totalDeliveries }}</div>
        <div class="metric-label">Total Deliveries</div>
        <div class="metric-subtext">vs last period</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-icon">✅</span>
          <span class="metric-change positive">+5%</span>
        </div>
        <div class="metric-value">{{ metrics.onTimeRate }}%</div>
        <div class="metric-label">On-Time Rate</div>
        <div class="metric-subtext">vs last period</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-icon">🚚</span>
          <span class="metric-change negative">-3%</span>
        </div>
        <div class="metric-value">{{ metrics.avgDistance }} mi</div>
        <div class="metric-label">Avg Distance</div>
        <div class="metric-subtext">vs last period</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-icon">💰</span>
          <span class="metric-change positive">+8%</span>
        </div>
        <div class="metric-value">${{ metrics.costPerDelivery }}</div>
        <div class="metric-label">Cost Per Delivery</div>
        <div class="metric-subtext">vs last period</div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-card large">
        <div class="chart-header">
          <h3 class="chart-title">Deliveries Over Time</h3>
          <select class="chart-select">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
        <div class="chart-placeholder">
          <div class="placeholder-text">📈 Chart: Daily Deliveries</div>
          <div class="placeholder-subtext">Integration with Chart.js or similar would go here</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Delivery Status</h3>
        </div>
        <div class="chart-placeholder small">
          <div class="placeholder-text">🥧 Pie Chart</div>
          <div class="status-breakdown">
            <div class="status-item">
              <span class="status-dot completed"/>
              <span class="status-text">Completed: 847 (92%)</span>
            </div>
            <div class="status-item">
              <span class="status-dot pending"/>
              <span class="status-text">In Progress: 45 (5%)</span>
            </div>
            <div class="status-item">
              <span class="status-dot failed"/>
              <span class="status-text">Failed: 28 (3%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Tables -->
    <div class="tables-section">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Top Performing Drivers</h2>
          <NuxtLink to="/drivers" class="view-all-link">View All</NuxtLink>
        </div>
        <div class="card-content">
          <div class="performance-table">
            <div class="table-header">
              <div class="col-rank">Rank</div>
              <div class="col-name">Driver</div>
              <div class="col-metric">Deliveries</div>
              <div class="col-metric">On-Time Rate</div>
              <div class="col-metric">Rating</div>
            </div>
            <div v-for="(driver, index) in topDrivers" :key="driver.id" class="table-row">
              <div class="col-rank">
                <span class="rank-badge" :class="`rank-${index + 1}`">{{ index + 1 }}</span>
              </div>
              <div class="col-name">
                <div class="driver-cell">
                  <div class="driver-avatar-small">{{ driver.name.charAt(0) }}</div>
                  <span>{{ driver.name }}</span>
                </div>
              </div>
              <div class="col-metric">{{ driver.deliveries }}</div>
              <div class="col-metric">{{ driver.onTimeRate }}%</div>
              <div class="col-metric">
                <div class="rating">
                  <span class="star">⭐</span>
                  <span>{{ driver.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Route Efficiency</h2>
          <NuxtLink to="/routes" class="view-all-link">View All</NuxtLink>
        </div>
        <div class="card-content">
          <div class="performance-table">
            <div class="table-header">
              <div class="col-name">Route</div>
              <div class="col-metric">Distance</div>
              <div class="col-metric">Duration</div>
              <div class="col-metric">Efficiency</div>
            </div>
            <div v-for="route in topRoutes" :key="route.id" class="table-row">
              <div class="col-name">{{ route.name }}</div>
              <div class="col-metric">{{ route.distance }} mi</div>
              <div class="col-metric">{{ route.duration }} hrs</div>
              <div class="col-metric">
                <div class="efficiency-bar">
                  <div class="efficiency-fill" :style="{ width: route.efficiency + '%' }" />
                  <span class="efficiency-text">{{ route.efficiency }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const selectedPeriod = ref('month')
const selectedReport = ref('overview')

const metrics = reactive({
  totalDeliveries: 920,
  onTimeRate: 94.5,
  avgDistance: 28.4,
  costPerDelivery: 12.50
})

const topDrivers = reactive([
  { id: 1, name: 'John Smith', deliveries: 156, onTimeRate: 98, rating: 4.9 },
  { id: 2, name: 'Sarah Johnson', deliveries: 142, onTimeRate: 96, rating: 4.8 },
  { id: 3, name: 'Mike Davis', deliveries: 138, onTimeRate: 95, rating: 4.7 },
  { id: 4, name: 'Lisa Chen', deliveries: 129, onTimeRate: 97, rating: 4.8 },
  { id: 5, name: 'Robert Wilson', deliveries: 121, onTimeRate: 93, rating: 4.6 }
])

const topRoutes = reactive([
  { id: 1, name: 'Downtown Commercial', distance: 32, duration: 4.5, efficiency: 96 },
  { id: 2, name: 'Residential District A', distance: 28, duration: 3.5, efficiency: 92 },
  { id: 3, name: 'Industrial Park', distance: 45, duration: 5.0, efficiency: 88 },
  { id: 4, name: 'Suburban Loop', distance: 38, duration: 4.2, efficiency: 90 }
])

function updatePeriod() {
  console.log('Update period:', selectedPeriod.value)
}

function updateReport() {
  console.log('Update report:', selectedReport.value)
}

function generateReport() {
  console.log('Generate custom report')
}

useHead({
  title: 'Reports - RouteReady',
  meta: [
    { name: 'description', content: 'View analytics and reports' }
  ]
})
</script>

<style scoped>
.reports-page {
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

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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
  font-size: 2rem;
  line-height: 1;
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
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.metric-subtext {
  font-size: 0.75rem;
  color: var(--text-muted);
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
}

.chart-placeholder.small {
  height: 250px;
}

.placeholder-text {
  font-size: 1.5rem;
  color: var(--text-primary);
  font-weight: 600;
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
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
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

.status-text {
  font-size: 0.875rem;
  color: var(--text-primary);
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
<template>
  <main class="analytics-page">
    <header class="page-header">
      <div class="header-top">
        <div>
          <h1 class="page-title">Analytics</h1>
          <p class="page-subtitle">Comprehensive route and dispatch performance metrics</p>
        </div>
        <nav class="header-actions" aria-label="Analytics actions">
          <button type="button" class="btn btn-secondary" @click="exportData">
            <span class="btn-icon" aria-hidden="true">📥</span>
            Export Data
          </button>
          <button type="button" class="btn btn-primary" @click="refreshData">
            <span class="btn-icon" aria-hidden="true">🔄</span>
            Refresh
          </button>
        </nav>
      </div>
    </header>

    <!-- Time Period Selector -->
    <nav class="period-selector" aria-label="Time period selection">
      <button
        v-for="period in periods"
        :key="period.value"
        type="button"
        :class="['period-btn', { active: selectedPeriod === period.value }]"
        :aria-pressed="selectedPeriod === period.value"
        @click="selectPeriod(period.value)">
        {{ period.label }}
      </button>
      <form class="custom-range" @submit.prevent>
        <label for="start-date" class="visually-hidden">Start date</label>
        <input id="start-date" v-model="startDate" type="date" class="date-input">
        <span class="date-separator" aria-hidden="true">to</span>
        <label for="end-date" class="visually-hidden">End date</label>
        <input id="end-date" v-model="endDate" type="date" class="date-input">
      </form>
    </nav>

    <!-- Executive Summary -->
    <section class="summary-section" aria-labelledby="summary-heading">
      <h2 id="summary-heading" class="section-title">Executive Summary</h2>
      <div class="executive-grid">
        <article class="executive-card">
          <div class="executive-icon" aria-hidden="true">🗺️</div>
          <div class="executive-content">
            <h3 class="executive-label">Total Routes</h3>
            <p class="executive-value">{{ summary.totalRoutes.toLocaleString() }}</p>
            <p class="executive-trend positive">
              <span class="trend-arrow" aria-hidden="true">↑</span>
              <span>{{ summary.routeGrowth }}% vs last period</span>
            </p>
          </div>
        </article>

        <article class="executive-card">
          <div class="executive-icon" aria-hidden="true">💰</div>
          <div class="executive-content">
            <h3 class="executive-label">Revenue</h3>
            <p class="executive-value">${{ summary.revenue.toLocaleString() }}</p>
            <p class="executive-trend positive">
              <span class="trend-arrow" aria-hidden="true">↑</span>
              <span>{{ summary.revenueGrowth }}% vs last period</span>
            </p>
          </div>
        </article>

        <article class="executive-card">
          <div class="executive-icon" aria-hidden="true">⚡</div>
          <div class="executive-content">
            <h3 class="executive-label">Avg Efficiency</h3>
            <p class="executive-value">{{ summary.avgEfficiency }}%</p>
            <p class="executive-trend positive">
              <span class="trend-arrow" aria-hidden="true">↑</span>
              <span>{{ summary.efficiencyGrowth }}% vs last period</span>
            </p>
          </div>
        </article>

        <article class="executive-card">
          <div class="executive-icon" aria-hidden="true">⏱️</div>
          <div class="executive-content">
            <h3 class="executive-label">On-Time Rate</h3>
            <p class="executive-value">{{ summary.onTimeRate }}%</p>
            <p class="executive-trend negative">
              <span class="trend-arrow" aria-hidden="true">↓</span>
              <span>{{ summary.onTimeChange }}% vs last period</span>
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- Performance Metrics -->
    <section class="metrics-section" aria-labelledby="metrics-heading">
      <h2 id="metrics-heading" class="visually-hidden">Performance Metrics</h2>
      <div class="metrics-row">
        <!-- Route Performance -->
        <article class="metric-card large">
          <header class="metric-card-header">
            <h3 class="metric-card-title">Route Performance</h3>
            <label for="route-period-select" class="visually-hidden">Select time period</label>
            <select id="route-period-select" class="metric-select">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Last Year</option>
            </select>
          </header>
          <div class="metric-stats-grid">
            <div class="metric-stat">
              <p class="metric-stat-value">{{ routeMetrics.completed }}</p>
              <p class="metric-stat-label">Completed</p>
            </div>
            <div class="metric-stat">
              <p class="metric-stat-value">{{ routeMetrics.pending }}</p>
              <p class="metric-stat-label">In Progress</p>
            </div>
            <div class="metric-stat">
              <p class="metric-stat-value">{{ routeMetrics.failed }}</p>
              <p class="metric-stat-label">Failed</p>
            </div>
            <div class="metric-stat">
              <p class="metric-stat-value">{{ routeMetrics.successRate }}%</p>
              <p class="metric-stat-label">Success Rate</p>
            </div>
          </div>
          <figure class="chart-area">
            <figcaption class="visually-hidden">Weekly route completion chart</figcaption>
            <div class="bar-chart">
              <div v-for="day in routeChart" :key="day.day" class="bar-group">
                <div
                  class="bar"
                  :style="{ height: (day.value / 50 * 100) + '%' }"
                  role="img"
                  :aria-label="`${day.day}: ${day.value} routes`">
                  <span class="bar-label" aria-hidden="true">{{ day.value }}</span>
                </div>
                <p class="bar-day">{{ day.day }}</p>
              </div>
            </div>
          </figure>
        </article>

        <!-- Driver Performance -->
        <article class="metric-card">
          <header class="metric-card-header">
            <h3 class="metric-card-title">Driver Performance</h3>
          </header>
          <dl class="driver-metrics">
            <dt class="driver-metric-label">Active Drivers</dt>
            <dd class="driver-metric-value">
              <span>{{ driverMetrics.active }}/{{ driverMetrics.total }}</span>
              <div
                class="progress-bar"
                role="progressbar"
                aria-label="Active drivers"
                :aria-valuenow="driverMetrics.active"
                :aria-valuemin="0"
                :aria-valuemax="driverMetrics.total"
                :aria-valuetext="`${driverMetrics.active} of ${driverMetrics.total} drivers active`">
                <div class="progress-fill"
                  :style="{ width: (driverMetrics.active / driverMetrics.total * 100) + '%' }">
                </div>
              </div>
            </dd>
            <dt class="driver-metric-label">Avg Hours/Week</dt>
            <dd class="driver-metric-value">{{ driverMetrics.avgHours }}h</dd>
            <dt class="driver-metric-label">Avg Rating</dt>
            <dd class="driver-metric-value">
              <span class="star" aria-hidden="true">⭐</span>
              {{ driverMetrics.avgRating }}/5
            </dd>
            <dt class="driver-metric-label">Total Routes</dt>
            <dd class="driver-metric-value">{{ driverMetrics.totalRoutes }}</dd>
          </dl>
          <section class="top-drivers-list" aria-labelledby="top-drivers-heading">
            <h4 id="top-drivers-heading" class="list-header">Top Performers</h4>
            <ol class="driver-list">
              <li v-for="(driver, index) in topPerformers" :key="driver.id"
                class="driver-list-item">
                <span class="driver-rank" aria-label="Rank">{{ index + 1 }}</span>
                <span class="driver-avatar-tiny" aria-hidden="true">{{ driver.name.charAt(0)
                  }}</span>
                <span class="driver-name-small">{{ driver.name }}</span>
                <span class="driver-score">{{ driver.score }}</span>
              </li>
            </ol>
          </section>
        </article>
      </div>
    </section>

    <!-- Fleet Analytics -->
    <section class="fleet-section" aria-labelledby="fleet-heading">
      <h2 id="fleet-heading" class="section-title">Fleet Analytics</h2>
      <div class="fleet-grid">
        <article class="fleet-card">
          <header class="fleet-card-header">
            <h3 class="fleet-card-title">Vehicle Utilization</h3>
          </header>
          <dl class="fleet-stats">
            <dt class="fleet-stat-label">Total Vehicles</dt>
            <dd class="fleet-stat-value">{{ fleetMetrics.total }}</dd>
            <dt class="fleet-stat-label">Active Today</dt>
            <dd class="fleet-stat-value highlight-green">{{ fleetMetrics.activeToday }}</dd>
            <dt class="fleet-stat-label">In Maintenance</dt>
            <dd class="fleet-stat-value highlight-orange">{{ fleetMetrics.maintenance }}</dd>
            <dt class="fleet-stat-label">Idle</dt>
            <dd class="fleet-stat-value highlight-gray">{{ fleetMetrics.idle }}</dd>
            <dt class="fleet-stat-label">Utilization Rate</dt>
            <dd class="fleet-stat-value">{{ fleetMetrics.utilizationRate }}%</dd>
          </dl>
          <figure class="utilization-chart">
            <figcaption class="visually-hidden">Vehicle utilization breakdown</figcaption>
            <div
              class="utilization-bar"
              role="img"
              aria-label="Vehicle utilization showing active, maintenance, and idle vehicles">
              <div class="utilization-segment active"
                :style="{ width: (fleetMetrics.activeToday / fleetMetrics.total * 100) + '%' }">
              </div>
              <div class="utilization-segment maintenance"
                :style="{ width: (fleetMetrics.maintenance / fleetMetrics.total * 100) + '%' }">
              </div>
              <div class="utilization-segment idle"
                :style="{ width: (fleetMetrics.idle / fleetMetrics.total * 100) + '%' }"></div>
            </div>
            <ul class="utilization-legend">
              <li class="legend-item">
                <span class="legend-dot active" aria-hidden="true"></span>
                <span class="legend-text">Active</span>
              </li>
              <li class="legend-item">
                <span class="legend-dot maintenance" aria-hidden="true"></span>
                <span class="legend-text">Maintenance</span>
              </li>
              <li class="legend-item">
                <span class="legend-dot idle" aria-hidden="true"></span>
                <span class="legend-text">Idle</span>
              </li>
            </ul>
          </figure>
        </article>

        <article class="fleet-card">
          <header class="fleet-card-header">
            <h3 class="fleet-card-title">Maintenance Schedule</h3>
          </header>
          <ul class="maintenance-list">
            <li v-for="vehicle in maintenanceSchedule" :key="vehicle.id" class="maintenance-item">
              <div class="maintenance-vehicle">
                <div class="vehicle-icon-small" aria-hidden="true">🚚</div>
                <div class="vehicle-info-small">
                  <p class="vehicle-name-small">{{ vehicle.name }}</p>
                  <p class="vehicle-plate-small">{{ vehicle.plate }}</p>
                </div>
              </div>
              <span class="maintenance-status" :class="vehicle.urgency">
                {{ vehicle.nextService }}
              </span>
            </li>
          </ul>
        </article>

        <article class="fleet-card">
          <header class="fleet-card-header">
            <h3 class="fleet-card-title">Fuel & Costs</h3>
          </header>
          <dl class="cost-breakdown">
            <dt class="cost-label">Total Fuel Cost</dt>
            <dd class="cost-value">${{ costMetrics.fuelCost.toLocaleString() }}</dd>
            <dd class="cost-detail">{{ costMetrics.fuelGallons }} gallons</dd>
            <dt class="cost-label">Maintenance Cost</dt>
            <dd class="cost-value">${{ costMetrics.maintenanceCost.toLocaleString() }}</dd>
            <dd class="cost-detail">{{ costMetrics.maintenanceEvents }} services</dd>
            <dt class="cost-label">Cost per Mile</dt>
            <dd class="cost-value">${{ costMetrics.costPerMile }}</dd>
            <dd class="cost-detail">{{ costMetrics.totalMiles.toLocaleString() }} miles</dd>
          </dl>
        </article>
      </div>
    </section>

    <!-- Route Analytics -->
    <section class="route-section" aria-labelledby="route-analytics-heading">
      <h2 id="route-analytics-heading" class="section-title">Route Analytics</h2>
      <div class="route-grid">
        <article class="route-analytics-card">
          <header class="route-card-header">
            <h3 class="route-card-title">Route Efficiency</h3>
          </header>
          <ul class="route-efficiency-list">
            <li v-for="route in routeEfficiency" :key="route.id" class="route-efficiency-item">
              <div class="route-info">
                <p class="route-name">{{ route.name }}</p>
                <p class="route-details-small">
                  {{ route.distance }} mi • {{ route.stops }} stops
                </p>
              </div>
              <div class="route-metrics">
                <div
                  class="route-efficiency-bar"
                  role="progressbar"
                  :aria-label="`${route.name} efficiency`"
                  :aria-valuenow="route.efficiency"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-valuetext="`${route.efficiency}% efficient`">
                  <div class="efficiency-bar-fill" :style="{ width: route.efficiency + '%' }"></div>
                  <span class="efficiency-bar-text">{{ route.efficiency }}%</span>
                </div>
                <p class="route-time">{{ route.avgTime }}h</p>
              </div>
            </li>
          </ul>
        </article>

        <article class="route-analytics-card">
          <header class="route-card-header">
            <h3 class="route-card-title">Peak Hours Analysis</h3>
          </header>
          <figure class="peak-hours-chart">
            <figcaption class="visually-hidden">Peak route activity by hour</figcaption>
            <div class="hour-bars">
              <div v-for="hour in peakHours" :key="hour.time" class="hour-bar">
                <div
                  class="hour-bar-fill"
                  :style="{ height: (hour.routes / 30 * 100) + '%' }"
                  role="img"
                  :aria-label="`${hour.time}: ${hour.routes} routes`">
                  <span class="hour-bar-label" aria-hidden="true">{{ hour.routes }}</span>
                </div>
                <p class="hour-time">{{ hour.time }}</p>
              </div>
            </div>
          </figure>
        </article>

        <article class="route-analytics-card">
          <header class="route-card-header">
            <h3 class="route-card-title">Geographic Coverage</h3>
          </header>
          <dl class="coverage-stats">
            <dt class="coverage-label">Total Routes</dt>
            <dd class="coverage-value">{{ geographicCoverage.totalRoutes }}</dd>
            <dt class="coverage-label">Coverage Area</dt>
            <dd class="coverage-value">{{ geographicCoverage.coverageArea }} mi²</dd>
            <dt class="coverage-label">Avg Distance</dt>
            <dd class="coverage-value">{{ geographicCoverage.avgDistance }} mi</dd>
            <dt class="coverage-label">Total Distance</dt>
            <dd class="coverage-value">{{ geographicCoverage.totalDistance.toLocaleString() }} mi
            </dd>
          </dl>
          <section class="zone-breakdown" aria-labelledby="zones-heading">
            <h4 id="zones-heading" class="zone-header">Service Zones</h4>
            <ul class="zone-list">
              <li v-for="zone in serviceZones" :key="zone.name" class="zone-item">
                <span class="zone-name">{{ zone.name }}</span>
                <div
                  class="zone-bar"
                  role="progressbar"
                  :aria-label="`${zone.name} zone coverage`"
                  :aria-valuenow="zone.percentage"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-valuetext="`${zone.percentage}% of routes`">
                  <div class="zone-bar-fill" :style="{ width: zone.percentage + '%' }"></div>
                </div>
                <span class="zone-percentage">{{ zone.percentage }}%</span>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </section>

    <!-- Detailed Tables -->
    <section class="tables-section" aria-labelledby="tables-heading">
      <h2 id="tables-heading" class="visually-hidden">Detailed Data Tables</h2>

      <article class="card">
        <header class="card-header">
          <h3 class="card-title">Route Breakdown by Status</h3>
          <button type="button" class="btn btn-secondary btn-small">Export CSV</button>
        </header>
        <div class="card-content">
          <div class="data-table">
            <table class="table">
              <caption class="visually-hidden">Route status breakdown with counts, percentages,
                trends, and average times</caption>
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Count</th>
                  <th scope="col">Percentage</th>
                  <th scope="col">Trend</th>
                  <th scope="col">Avg Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="status in routeStatus" :key="status.name">
                  <td>
                    <span :class="['status-badge', status.class]">{{ status.name }}</span>
                  </td>
                  <td>{{ status.count }}</td>
                  <td>
                    <div class="percentage-bar">
                      <div
                        class="percentage-fill"
                        :style="{ width: status.percentage + '%' }"
                        role="img"
                        :aria-label="`${status.percentage}%`"></div>
                      <span class="percentage-text">{{ status.percentage }}%</span>
                    </div>
                  </td>
                  <td>
                    <span :class="['trend-indicator', status.trend > 0 ? 'positive' : 'negative']">
                      {{ status.trend > 0 ? '↑' : '↓' }} {{ Math.abs(status.trend) }}%
                    </span>
                  </td>
                  <td>{{ status.avgTime }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article class="card">
        <header class="card-header">
          <h3 class="card-title">Cost Analysis</h3>
          <button type="button" class="btn btn-secondary btn-small">View Details</button>
        </header>
        <div class="card-content">
          <div class="data-table">
            <table class="table">
              <caption class="visually-hidden">Cost analysis by category comparing current and
                previous periods</caption>
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">This Period</th>
                  <th scope="col">Last Period</th>
                  <th scope="col">Change</th>
                  <th scope="col">% of Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cost in costAnalysis" :key="cost.category">
                  <th scope="row">{{ cost.category }}</th>
                  <td>${{ cost.current.toLocaleString() }}</td>
                  <td>${{ cost.previous.toLocaleString() }}</td>
                  <td>
                    <span :class="['change-value', cost.change > 0 ? 'negative' : 'positive']">
                      {{ cost.change > 0 ? '+' : '' }}{{ cost.change }}%
                    </span>
                  </td>
                  <td>{{ cost.percentage }}%</td>
                </tr>
                <tr class="total-row">
                  <th scope="row">Total</th>
                  <td><strong>${{ costTotals.current.toLocaleString() }}</strong></td>
                  <td><strong>${{ costTotals.previous.toLocaleString() }}</strong></td>
                  <td>
                    <strong
                      :class="['change-value', costTotals.change > 0 ? 'negative' : 'positive']">
                      {{ costTotals.change > 0 ? '+' : '' }}{{ costTotals.change }}%
                    </strong>
                  </td>
                  <td><strong>100%</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const selectedPeriod = ref('30days')
const startDate = ref('')
const endDate = ref('')

const periods = [
  { label: 'Today', value: 'today' },
  { label: '7 Days', value: '7days' },
  { label: '30 Days', value: '30days' },
  { label: '90 Days', value: '90days' },
  { label: 'Year', value: 'year' }
]

const summary = reactive({
  totalRoutes: 3456,
  routeGrowth: 12.5,
  revenue: 189450,
  revenueGrowth: 8.3,
  avgEfficiency: 92.8,
  efficiencyGrowth: 3.2,
  onTimeRate: 94.2,
  onTimeChange: -1.5
})

const routeMetrics = reactive({
  completed: 3189,
  pending: 156,
  failed: 111,
  successRate: 92.3
})

const routeChart = reactive([
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 38 },
  { day: 'Wed', value: 42 },
  { day: 'Thu', value: 35 },
  { day: 'Fri', value: 48 },
  { day: 'Sat', value: 28 },
  { day: 'Sun', value: 22 }
])

const driverMetrics = reactive({
  active: 12,
  total: 15,
  avgHours: 38.5,
  avgRating: 4.7,
  totalRoutes: 3456
})

const topPerformers = reactive([
  { id: 1, name: 'John Smith', score: 98 },
  { id: 2, name: 'Sarah Johnson', score: 96 },
  { id: 3, name: 'Mike Davis', score: 94 },
  { id: 4, name: 'Lisa Chen', score: 92 },
  { id: 5, name: 'Robert Wilson', score: 89 }
])

const fleetMetrics = reactive({
  total: 15,
  activeToday: 12,
  maintenance: 2,
  idle: 1,
  utilizationRate: 80
})

const maintenanceSchedule = reactive([
  { id: 1, name: 'Truck #1', plate: 'TRK-2024', nextService: '3 days', urgency: 'soon' },
  { id: 2, name: 'Van #3', plate: 'VAN-3305', nextService: '2 weeks', urgency: 'normal' },
  { id: 3, name: 'Truck #5', plate: 'TRK-5019', nextService: 'Overdue', urgency: 'urgent' }
])

const costMetrics = reactive({
  fuelCost: 12450,
  fuelGallons: 2890,
  maintenanceCost: 8920,
  maintenanceEvents: 15,
  costPerMile: 2.45,
  totalMiles: 28450
})

const routeEfficiency = reactive([
  { id: 1, name: 'Downtown Commercial', distance: 32, stops: 8, efficiency: 96, avgTime: 4.5 },
  { id: 2, name: 'Residential A', distance: 28, stops: 12, efficiency: 92, avgTime: 3.8 },
  { id: 3, name: 'Industrial Park', distance: 45, stops: 6, efficiency: 88, avgTime: 5.2 },
  { id: 4, name: 'Suburban Loop', distance: 38, stops: 10, efficiency: 90, avgTime: 4.2 }
])

const peakHours = reactive([
  { time: '6AM', routes: 8 },
  { time: '8AM', routes: 24 },
  { time: '10AM', routes: 28 },
  { time: '12PM', routes: 22 },
  { time: '2PM', routes: 26 },
  { time: '4PM', routes: 18 },
  { time: '6PM', routes: 12 }
])

const geographicCoverage = reactive({
  totalRoutes: 25,
  coverageArea: 450,
  avgDistance: 32,
  totalDistance: 28450
})

const serviceZones = reactive([
  { name: 'Downtown', percentage: 35 },
  { name: 'Residential', percentage: 28 },
  { name: 'Industrial', percentage: 22 },
  { name: 'Suburban', percentage: 15 }
])

const routeStatus = reactive([
  { name: 'Completed', count: 3189, percentage: 92.3, trend: 5.2, avgTime: '3.2h', class: 'completed' },
  { name: 'In Transit', count: 156, percentage: 4.5, trend: -2.1, avgTime: '1.8h', class: 'transit' },
  { name: 'Failed', count: 111, percentage: 3.2, trend: -0.5, avgTime: '2.5h', class: 'failed' }
])

const costAnalysis = reactive([
  { category: 'Fuel', current: 12450, previous: 11800, change: 5.5, percentage: 35 },
  { category: 'Maintenance', current: 8920, previous: 9200, change: -3.0, percentage: 25 },
  { category: 'Labor', current: 11200, previous: 10800, change: 3.7, percentage: 32 },
  { category: 'Insurance', current: 2890, previous: 2800, change: 3.2, percentage: 8 }
])

const costTotals = reactive({
  current: 35460,
  previous: 34600,
  change: 2.5
})

function selectPeriod(period) {
  selectedPeriod.value = period
  console.log('Selected period:', period)
}

function exportData() {
  console.log('Export data')
}

function refreshData() {
  console.log('Refresh data')
}

useHead({
  title: 'Analytics - RouteReady',
  meta: [
    { name: 'description', content: 'Comprehensive route and dispatch analytics' }
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

.analytics-page {
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

.header-actions {
  display: flex;
  gap: 0.75rem;
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

/* Period Selector */
.period-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.period-btn {
  padding: 0.625rem 1.25rem;
  border: 1px solid var(--input-border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.period-btn:hover {
  background: var(--button-primary);
  color: white;
  border-color: var(--button-primary);
}

.period-btn.active {
  background: var(--button-primary);
  color: white;
  border-color: var(--button-primary);
}

.custom-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.date-input {
  padding: 0.625rem;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-primary);
  border-radius: 6px;
  font-size: 0.875rem;
}

.date-separator {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Section Titles */
.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
}

/* Executive Summary */
.summary-section {
  margin-bottom: 2rem;
}

.executive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.executive-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  gap: 1.25rem;
  transition: transform 0.2s;
}

.executive-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.executive-icon {
  font-size: 3rem;
  line-height: 1;
}

.executive-content {
  flex: 1;
}

.executive-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0 0 0.5rem 0;
}

.executive-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.executive-trend {
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
}

.executive-trend.positive {
  color: #10b981;
}

.executive-trend.negative {
  color: #ef4444;
}

.trend-arrow {
  font-size: 1rem;
}

/* Metrics Section */
.metrics-section {
  margin-bottom: 2rem;
}

.metrics-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.metric-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.metric-card.large {
  grid-column: 1;
}

.metric-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-border);
}

.metric-card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.metric-select {
  padding: 0.5rem;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-primary);
  border-radius: 6px;
  font-size: 0.875rem;
}

.metric-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-stat {
  text-align: center;
}

.metric-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.metric-stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

/* Bar Chart */
.chart-area {
  margin: 1.5rem 0 0 0;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 180px;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar {
  width: 100%;
  max-width: 50px;
  background: linear-gradient(to top, var(--button-primary), #818cf8);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transition: all 0.3s;
}

.bar:hover {
  filter: brightness(1.2);
}

.bar-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  margin-top: 0.25rem;
}

.bar-day {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
}

/* Driver Metrics */
.driver-metrics {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem 1rem;
  margin: 0 0 1.5rem 0;
  align-items: start;
}

.driver-metric-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
  padding-top: 0.25rem;
}

.driver-metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
}

.progress-bar {
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--button-primary);
  transition: width 0.3s;
}

.star {
  color: #fbbf24;
}

.top-drivers-list {
  border-top: 1px solid var(--input-border);
  padding-top: 1rem;
}

.list-header {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.driver-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.driver-list-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.driver-list-item:hover {
  background: var(--bg-secondary);
}

.driver-rank {
  width: 24px;
  height: 24px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.driver-avatar-tiny {
  width: 32px;
  height: 32px;
  background: var(--button-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.driver-name-small {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.driver-score {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--button-primary);
}

/* Fleet Section */
.fleet-section {
  margin-bottom: 2rem;
}

.fleet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.fleet-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.fleet-card-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-border);
}

.fleet-card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.fleet-stats {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem 1rem;
  margin: 0 0 1.5rem 0;
  align-items: baseline;
}

.fleet-stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.fleet-stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-align: right;
}

.highlight-green {
  color: #10b981;
}

.highlight-orange {
  color: #f59e0b;
}

.highlight-gray {
  color: var(--text-muted);
}

.utilization-chart {
  margin: 1rem 0 0 0;
}

.utilization-bar {
  height: 32px;
  background: var(--bg-secondary);
  border-radius: 8px;
  display: flex;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.utilization-segment {
  transition: width 0.3s;
}

.utilization-segment.active {
  background: #10b981;
}

.utilization-segment.maintenance {
  background: #f59e0b;
}

.utilization-segment.idle {
  background: #6b7280;
}

.utilization-legend {
  display: flex;
  gap: 1rem;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.active {
  background: #10b981;
}

.legend-dot.maintenance {
  background: #f59e0b;
}

.legend-dot.idle {
  background: #6b7280;
}

.legend-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Maintenance List */
.maintenance-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.maintenance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.maintenance-vehicle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.vehicle-icon-small {
  font-size: 1.5rem;
}

.vehicle-info-small {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.vehicle-name-small {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.vehicle-plate-small {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
}

.maintenance-status {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
}

.maintenance-status.urgent {
  background: #fee2e2;
  color: #991b1b;
}

.maintenance-status.soon {
  background: #fef3c7;
  color: #92400e;
}

.maintenance-status.normal {
  background: #dbeafe;
  color: #1e40af;
}

/* Cost Breakdown */
.cost-breakdown {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
  margin: 0;
  align-items: baseline;
}

.cost-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  grid-column: 1;
}

.cost-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  grid-column: 2;
}

.cost-detail {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0 0 0.75rem 0;
  grid-column: 2;
}

/* Route Section */
.route-section {
  margin-bottom: 2rem;
}

.route-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
}

.route-analytics-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.route-card-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-border);
}

.route-card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.route-efficiency-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.route-efficiency-item {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.route-info {
  margin-bottom: 0.75rem;
}

.route-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.route-details-small {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
}

.route-metrics {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.route-efficiency-bar {
  flex: 1;
  height: 24px;
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.efficiency-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--button-primary), #818cf8);
  transition: width 0.3s;
}

.efficiency-bar-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.route-time {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  min-width: 50px;
  text-align: right;
  margin: 0;
}

/* Peak Hours Chart */
.peak-hours-chart {
  margin: 0;
}

.hour-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200px;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.hour-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.hour-bar-fill {
  width: 100%;
  max-width: 40px;
  background: linear-gradient(to top, var(--button-primary), #818cf8);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.hour-bar-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  margin-top: 0.25rem;
}

.hour-time {
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
}

/* Coverage Stats */
.coverage-stats {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem 1rem;
  margin: 0 0 1.5rem 0;
  align-items: baseline;
}

.coverage-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.coverage-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-align: right;
}

/* Zone Breakdown */
.zone-breakdown {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.zone-header {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.zone-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.zone-item {
  display: grid;
  grid-template-columns: 100px 1fr 60px;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.zone-item:last-child {
  margin-bottom: 0;
}

.zone-name {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
}

.zone-bar {
  height: 20px;
  background: var(--bg-primary);
  border-radius: 10px;
  overflow: hidden;
}

.zone-bar-fill {
  height: 100%;
  background: var(--button-primary);
  transition: width 0.3s;
}

.zone-percentage {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  text-align: right;
}

/* Tables Section */
.tables-section {
  display: grid;
  gap: 1.5rem;
}

.data-table {
  overflow-x: auto;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.transit {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.failed {
  background: #fee2e2;
  color: #991b1b;
}

.percentage-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 200px;
}

.percentage-fill {
  height: 8px;
  background: var(--button-primary);
  border-radius: 4px;
}

.percentage-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 45px;
}

.trend-indicator {
  font-weight: 700;
  font-size: 0.875rem;
}

.trend-indicator.positive {
  color: #10b981;
}

.trend-indicator.negative {
  color: #ef4444;
}

.change-value {
  font-weight: 700;
}

.change-value.positive {
  color: #10b981;
}

.change-value.negative {
  color: #ef4444;
}

.total-row {
  background: var(--bg-secondary);
  font-weight: 700;
}

.total-row td {
  padding: 1rem 0.75rem;
}

@media (max-width: 1400px) {
  .metrics-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {

  .fleet-grid,
  .route-grid {
    grid-template-columns: 1fr;
  }

  .metric-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: stretch;
  }

  .header-actions .btn {
    flex: 1;
  }

  .executive-grid {
    grid-template-columns: 1fr;
  }

  .period-selector {
    flex-direction: column;
  }

  .custom-range {
    width: 100%;
    margin-left: 0;
  }

  .coverage-stats {
    grid-template-columns: 1fr;
  }
}
</style>
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
            <svg
xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true" focusable="false">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Data
          </button>
          <button type="button" class="btn btn-primary" @click="refreshData">
            <svg
xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true" focusable="false">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
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
          <svg
xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true" focusable="false" class="executive-icon">
            <circle cx="3" cy="6" r="2" />
            <circle cx="21" cy="18" r="2" />
            <path d="M3 8v4a4 4 0 0 0 4 4h10v-4a4 4 0 0 0-4-4H3" />
          </svg>
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
          <svg
xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true" focusable="false" class="executive-icon">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
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
          <svg
xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true" focusable="false" class="executive-icon">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
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
          <svg
xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true" focusable="false" class="executive-icon">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
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
                <div
                  class="progress-fill"
                  :style="{ width: (driverMetrics.active / driverMetrics.total * 100) + '%' }" />
              </div>
            </dd>
            <dt class="driver-metric-label">Avg Hours/Week</dt>
            <dd class="driver-metric-value">{{ driverMetrics.avgHours }}h</dd>
            <dt class="driver-metric-label">Avg Rating</dt>
            <dd class="driver-metric-value">
              <svg
xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="#fbbf24" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false">
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {{ driverMetrics.avgRating }}/5
            </dd>
            <dt class="driver-metric-label">Total Routes</dt>
            <dd class="driver-metric-value">{{ driverMetrics.totalRoutes }}</dd>
          </dl>
          <section class="top-drivers-list" aria-labelledby="top-drivers-heading">
            <h4 id="top-drivers-heading" class="list-header">Top Performers</h4>
            <ol class="driver-list">
              <li
                v-for="(driver, index) in topPerformers"
                :key="driver.id"
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
              <div
                class="utilization-segment active"
                :style="{ width: (fleetMetrics.activeToday / fleetMetrics.total * 100) + '%' }" />
              <div
                class="utilization-segment maintenance"
                :style="{ width: (fleetMetrics.maintenance / fleetMetrics.total * 100) + '%' }" />
              <div
                class="utilization-segment idle"
                :style="{ width: (fleetMetrics.idle / fleetMetrics.total * 100) + '%' }" />
            </div>
            <ul class="utilization-legend">
              <li class="legend-item">
                <span class="legend-dot active" aria-hidden="true" />
                <span class="legend-text">Active</span>
              </li>
              <li class="legend-item">
                <span class="legend-dot maintenance" aria-hidden="true" />
                <span class="legend-text">Maintenance</span>
              </li>
              <li class="legend-item">
                <span class="legend-dot idle" aria-hidden="true" />
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
                <svg
xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true" focusable="false"
                  class="vehicle-icon-small">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 5v3h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
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
                  <div class="efficiency-bar-fill" :style="{ width: route.efficiency + '%' }" />
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
                  <div class="zone-bar-fill" :style="{ width: zone.percentage + '%' }" />
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
                        :aria-label="`${status.percentage}%`" />
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

const [routesRes, driversRes, vehiclesRes] = await Promise.all([
  useFetch('/api/routes'),
  useFetch('/api/drivers'),
  useFetch('/api/vehicles')
])

const routes = reactive(routesRes.data.value?.data || [])
const drivers = reactive(driversRes.data.value?.data || [])
const vehicles = reactive(vehiclesRes.data.value?.data || [])

const summary = computed(() => {
  const total = routes.length
  const completed = routes.filter(r => r.status === 'completed').length
  const onTimeRate = total > 0 ? Math.round((completed / total) * 1000) / 10 : 0
  const efficiencies = routes.filter(r => r.efficiency).map(r => Number(r.efficiency))
  const avgEfficiency = efficiencies.length > 0
    ? Math.round(efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length * 10) / 10
    : 0
  return {
    totalRoutes: total,
    routeGrowth: 0,
    revenue: 0,
    revenueGrowth: 0,
    avgEfficiency,
    efficiencyGrowth: 0,
    onTimeRate,
    onTimeChange: 0
  }
})

const routeMetrics = computed(() => {
  const completed = routes.filter(r => r.status === 'completed').length
  const pending = routes.filter(r => r.status === 'active').length
  const failed = routes.filter(r => r.status === 'failed').length
  const total = routes.length
  const successRate = total > 0 ? Math.round((completed / total) * 1000) / 10 : 0
  return { completed, pending, failed, successRate }
})

const driverMetrics = computed(() => {
  const active = drivers.filter(d => d.status === 'active').length
  const total = drivers.length
  const ratings = drivers.filter(d => d.rating).map(d => Number(d.rating))
  const avgRating = ratings.length > 0
    ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10
    : 0
  return {
    active,
    total,
    avgHours: 0,
    avgRating,
    totalRoutes: routes.length
  }
})

const topPerformers = computed(() =>
  [...drivers]
    .filter(d => d.rating)
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 5)
    .map(d => ({
      id: d.id,
      name: d.name,
      score: Math.round(Number(d.rating) * 20)
    }))
)

const fleetMetrics = computed(() => {
  const total = vehicles.length
  const activeToday = vehicles.filter(v => v.status === 'active').length
  const maintenance = vehicles.filter(v => v.status === 'maintenance').length
  const idle = vehicles.filter(v => v.status === 'available').length
  const utilizationRate = total > 0 ? Math.round((activeToday / total) * 100) : 0
  return { total, activeToday, maintenance, idle, utilizationRate }
})

const routeEfficiency = computed(() =>
  [...routes]
    .filter(r => r.efficiency)
    .sort((a, b) => Number(b.efficiency) - Number(a.efficiency))
    .slice(0, 4)
    .map(r => ({
      id: r.id,
      name: r.name,
      distance: r.distance || 0,
      stops: 0,
      efficiency: r.efficiency,
      avgTime: r.duration || 0
    }))
)

const routeStatus = computed(() => {
  const total = routes.length
  const completed = routes.filter(r => r.status === 'completed').length
  const active = routes.filter(r => r.status === 'active').length
  const failed = routes.filter(r => r.status === 'failed').length
  return [
    { name: 'Completed', count: completed, percentage: total > 0 ? Math.round(completed / total * 100 * 10) / 10 : 0, trend: 0, avgTime: 'N/A', class: 'completed' },
    { name: 'In Transit', count: active, percentage: total > 0 ? Math.round(active / total * 100 * 10) / 10 : 0, trend: 0, avgTime: 'N/A', class: 'transit' },
    { name: 'Failed', count: failed, percentage: total > 0 ? Math.round(failed / total * 100 * 10) / 10 : 0, trend: 0, avgTime: 'N/A', class: 'failed' }
  ]
})

const maintenanceSchedule = computed(() =>
  vehicles
    .filter(v => v.status === 'maintenance')
    .map(v => ({
      id: v.id,
      name: v.name,
      plate: v.license_plate,
      nextService: 'Scheduled',
      urgency: 'normal'
    }))
)

// No backing tables yet — kept as empty placeholders
const routeChart = reactive([
  { day: 'Mon', value: 0 },
  { day: 'Tue', value: 0 },
  { day: 'Wed', value: 0 },
  { day: 'Thu', value: 0 },
  { day: 'Fri', value: 0 },
  { day: 'Sat', value: 0 },
  { day: 'Sun', value: 0 }
])

const costMetrics = reactive({
  fuelCost: 0,
  fuelGallons: 0,
  maintenanceCost: 0,
  maintenanceEvents: 0,
  costPerMile: 0,
  totalMiles: 0
})

const peakHours = reactive([
  { time: '6AM', routes: 0 },
  { time: '8AM', routes: 0 },
  { time: '10AM', routes: 0 },
  { time: '12PM', routes: 0 },
  { time: '2PM', routes: 0 },
  { time: '4PM', routes: 0 },
  { time: '6PM', routes: 0 }
])

const geographicCoverage = reactive({
  totalRoutes: routes.length,
  coverageArea: 0,
  avgDistance: 0,
  totalDistance: 0
})

const serviceZones = reactive([])
const costAnalysis = reactive([])
const costTotals = reactive({ current: 0, previous: 0, change: 0 })

function selectPeriod(period) {
  selectedPeriod.value = period
}

function exportData() {
  console.log('Export data')
}

function refreshData() {
  window.location.reload()
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
  color: var(--button-primary);
  flex-shrink: 0;
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
  color: var(--text-secondary);
  flex-shrink: 0;
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
  background: #065f46;
  color: #d1fae5;
}

.status-badge.transit {
  background: #92400e;
  color: #fef3c7;
}

.status-badge.failed {
  background: #991b1b;
  color: #fee2e2;
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
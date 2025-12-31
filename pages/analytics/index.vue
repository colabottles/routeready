<template>
  <div class="analytics-page">
    <div class="page-header">
      <div class="header-top">
        <div>
          <h1 class="page-title">Analytics</h1>
          <p class="page-subtitle">Comprehensive insights and performance metrics</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" @click="exportData">
            <span class="btn-icon">📥</span>
            Export Data
          </button>
          <button class="btn btn-primary" @click="refreshData">
            <span class="btn-icon">🔄</span>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Time Period Selector -->
    <div class="period-selector">
      <button
        v-for="period in periods"
        :key="period.value"
        :class="['period-btn', { active: selectedPeriod === period.value }]"
        @click="selectPeriod(period.value)"
      >
        {{ period.label }}
      </button>
      <div class="custom-range">
        <input v-model="startDate" type="date" class="date-input">
        <span class="date-separator">to</span>
        <input v-model="endDate" type="date" class="date-input">
      </div>
    </div>

    <!-- Executive Summary -->
    <div class="summary-section">
      <h2 class="section-title">Executive Summary</h2>
      <div class="executive-grid">
        <div class="executive-card">
          <div class="executive-icon">📦</div>
          <div class="executive-content">
            <div class="executive-label">Total Deliveries</div>
            <div class="executive-value">{{ summary.totalDeliveries.toLocaleString() }}</div>
            <div class="executive-trend positive">
              <span class="trend-arrow">↑</span>
              <span>{{ summary.deliveryGrowth }}% vs last period</span>
            </div>
          </div>
        </div>

        <div class="executive-card">
          <div class="executive-icon">💰</div>
          <div class="executive-content">
            <div class="executive-label">Revenue</div>
            <div class="executive-value">${{ summary.revenue.toLocaleString() }}</div>
            <div class="executive-trend positive">
              <span class="trend-arrow">↑</span>
              <span>{{ summary.revenueGrowth }}% vs last period</span>
            </div>
          </div>
        </div>

        <div class="executive-card">
          <div class="executive-icon">⚡</div>
          <div class="executive-content">
            <div class="executive-label">Avg Efficiency</div>
            <div class="executive-value">{{ summary.avgEfficiency }}%</div>
            <div class="executive-trend positive">
              <span class="trend-arrow">↑</span>
              <span>{{ summary.efficiencyGrowth }}% vs last period</span>
            </div>
          </div>
        </div>

        <div class="executive-card">
          <div class="executive-icon">⏱️</div>
          <div class="executive-content">
            <div class="executive-label">On-Time Rate</div>
            <div class="executive-value">{{ summary.onTimeRate }}%</div>
            <div class="executive-trend negative">
              <span class="trend-arrow">↓</span>
              <span>{{ summary.onTimeChange }}% vs last period</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="metrics-section">
      <div class="metrics-row">
        <!-- Delivery Performance -->
        <div class="metric-card large">
          <div class="metric-card-header">
            <h3 class="metric-card-title">Delivery Performance</h3>
            <select class="metric-select">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Last Year</option>
            </select>
          </div>
          <div class="metric-stats-grid">
            <div class="metric-stat">
              <div class="metric-stat-value">{{ deliveryMetrics.completed }}</div>
              <div class="metric-stat-label">Completed</div>
            </div>
            <div class="metric-stat">
              <div class="metric-stat-value">{{ deliveryMetrics.pending }}</div>
              <div class="metric-stat-label">In Progress</div>
            </div>
            <div class="metric-stat">
              <div class="metric-stat-value">{{ deliveryMetrics.failed }}</div>
              <div class="metric-stat-label">Failed</div>
            </div>
            <div class="metric-stat">
              <div class="metric-stat-value">{{ deliveryMetrics.successRate }}%</div>
              <div class="metric-stat-label">Success Rate</div>
            </div>
          </div>
          <div class="chart-area">
            <div class="bar-chart">
              <div v-for="day in deliveryChart" :key="day.day" class="bar-group">
                <div class="bar" :style="{ height: (day.value / 50 * 100) + '%' }">
                  <span class="bar-label">{{ day.value }}</span>
                </div>
                <div class="bar-day">{{ day.day }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Driver Performance -->
        <div class="metric-card">
          <div class="metric-card-header">
            <h3 class="metric-card-title">Driver Performance</h3>
          </div>
          <div class="driver-metrics">
            <div class="driver-metric-item">
              <div class="driver-metric-label">Active Drivers</div>
              <div class="driver-metric-value">{{ driverMetrics.active }}/{{ driverMetrics.total }}</div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: (driverMetrics.active / driverMetrics.total * 100) + '%' }"/>
              </div>
            </div>
            <div class="driver-metric-item">
              <div class="driver-metric-label">Avg Hours/Week</div>
              <div class="driver-metric-value">{{ driverMetrics.avgHours }}h</div>
            </div>
            <div class="driver-metric-item">
              <div class="driver-metric-label">Avg Rating</div>
              <div class="driver-metric-value">
                <span class="star">⭐</span>
                {{ driverMetrics.avgRating }}/5
              </div>
            </div>
            <div class="driver-metric-item">
              <div class="driver-metric-label">Total Deliveries</div>
              <div class="driver-metric-value">{{ driverMetrics.totalDeliveries }}</div>
            </div>
          </div>
          <div class="top-drivers-list">
            <div class="list-header">Top Performers</div>
            <div v-for="(driver, index) in topPerformers" :key="driver.id" class="driver-list-item">
              <div class="driver-rank">{{ index + 1 }}</div>
              <div class="driver-avatar-tiny">{{ driver.name.charAt(0) }}</div>
              <div class="driver-name-small">{{ driver.name }}</div>
              <div class="driver-score">{{ driver.score }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fleet Analytics -->
    <div class="fleet-section">
      <h2 class="section-title">Fleet Analytics</h2>
      <div class="fleet-grid">
        <div class="fleet-card">
          <div class="fleet-card-header">
            <h3 class="fleet-card-title">Vehicle Utilization</h3>
          </div>
          <div class="fleet-stats">
            <div class="fleet-stat-row">
              <span class="fleet-stat-label">Total Vehicles</span>
              <span class="fleet-stat-value">{{ fleetMetrics.total }}</span>
            </div>
            <div class="fleet-stat-row">
              <span class="fleet-stat-label">Active Today</span>
              <span class="fleet-stat-value highlight-green">{{ fleetMetrics.activeToday }}</span>
            </div>
            <div class="fleet-stat-row">
              <span class="fleet-stat-label">In Maintenance</span>
              <span class="fleet-stat-value highlight-orange">{{ fleetMetrics.maintenance }}</span>
            </div>
            <div class="fleet-stat-row">
              <span class="fleet-stat-label">Idle</span>
              <span class="fleet-stat-value highlight-gray">{{ fleetMetrics.idle }}</span>
            </div>
            <div class="fleet-stat-row">
              <span class="fleet-stat-label">Utilization Rate</span>
              <span class="fleet-stat-value">{{ fleetMetrics.utilizationRate }}%</span>
            </div>
          </div>
          <div class="utilization-chart">
            <div class="utilization-bar">
              <div class="utilization-segment active" :style="{ width: (fleetMetrics.activeToday / fleetMetrics.total * 100) + '%' }"/>
              <div class="utilization-segment maintenance" :style="{ width: (fleetMetrics.maintenance / fleetMetrics.total * 100) + '%' }"/>
              <div class="utilization-segment idle" :style="{ width: (fleetMetrics.idle / fleetMetrics.total * 100) + '%' }"/>
            </div>
            <div class="utilization-legend">
              <div class="legend-item">
                <span class="legend-dot active"/>
                <span class="legend-text">Active</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot maintenance"/>
                <span class="legend-text">Maintenance</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot idle"/>
                <span class="legend-text">Idle</span>
              </div>
            </div>
          </div>
        </div>

        <div class="fleet-card">
          <div class="fleet-card-header">
            <h3 class="fleet-card-title">Maintenance Schedule</h3>
          </div>
          <div class="maintenance-list">
            <div v-for="vehicle in maintenanceSchedule" :key="vehicle.id" class="maintenance-item">
              <div class="maintenance-vehicle">
                <div class="vehicle-icon-small">🚚</div>
                <div class="vehicle-info-small">
                  <div class="vehicle-name-small">{{ vehicle.name }}</div>
                  <div class="vehicle-plate-small">{{ vehicle.plate }}</div>
                </div>
              </div>
              <div class="maintenance-status" :class="vehicle.urgency">
                {{ vehicle.nextService }}
              </div>
            </div>
          </div>
        </div>

        <div class="fleet-card">
          <div class="fleet-card-header">
            <h3 class="fleet-card-title">Fuel & Costs</h3>
          </div>
          <div class="cost-breakdown">
            <div class="cost-item">
              <div class="cost-label">Total Fuel Cost</div>
              <div class="cost-value">${{ costMetrics.fuelCost.toLocaleString() }}</div>
              <div class="cost-detail">{{ costMetrics.fuelGallons }} gallons</div>
            </div>
            <div class="cost-item">
              <div class="cost-label">Maintenance Cost</div>
              <div class="cost-value">${{ costMetrics.maintenanceCost.toLocaleString() }}</div>
              <div class="cost-detail">{{ costMetrics.maintenanceEvents }} services</div>
            </div>
            <div class="cost-item">
              <div class="cost-label">Cost per Mile</div>
              <div class="cost-value">${{ costMetrics.costPerMile }}</div>
              <div class="cost-detail">{{ costMetrics.totalMiles.toLocaleString() }} miles</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Route Analytics -->
    <div class="route-section">
      <h2 class="section-title">Route Analytics</h2>
      <div class="route-grid">
        <div class="route-analytics-card">
          <div class="route-card-header">
            <h3 class="route-card-title">Route Efficiency</h3>
          </div>
          <div class="route-efficiency-list">
            <div v-for="route in routeEfficiency" :key="route.id" class="route-efficiency-item">
              <div class="route-info">
                <div class="route-name">{{ route.name }}</div>
                <div class="route-details-small">
                  {{ route.distance }} mi • {{ route.stops }} stops
                </div>
              </div>
              <div class="route-metrics">
                <div class="route-efficiency-bar">
                  <div class="efficiency-bar-fill" :style="{ width: route.efficiency + '%' }"/>
                  <span class="efficiency-bar-text">{{ route.efficiency }}%</span>
                </div>
                <div class="route-time">{{ route.avgTime }}h</div>
              </div>
            </div>
          </div>
        </div>

        <div class="route-analytics-card">
          <div class="route-card-header">
            <h3 class="route-card-title">Peak Hours Analysis</h3>
          </div>
          <div class="peak-hours-chart">
            <div v-for="hour in peakHours" :key="hour.time" class="hour-bar">
              <div class="hour-bar-fill" :style="{ height: (hour.deliveries / 30 * 100) + '%' }">
                <span class="hour-bar-label">{{ hour.deliveries }}</span>
              </div>
              <div class="hour-time">{{ hour.time }}</div>
            </div>
          </div>
        </div>

        <div class="route-analytics-card">
          <div class="route-card-header">
            <h3 class="route-card-title">Geographic Coverage</h3>
          </div>
          <div class="coverage-stats">
            <div class="coverage-item">
              <div class="coverage-label">Total Routes</div>
              <div class="coverage-value">{{ geographicCoverage.totalRoutes }}</div>
            </div>
            <div class="coverage-item">
              <div class="coverage-label">Coverage Area</div>
              <div class="coverage-value">{{ geographicCoverage.coverageArea }} mi²</div>
            </div>
            <div class="coverage-item">
              <div class="coverage-label">Avg Distance</div>
              <div class="coverage-value">{{ geographicCoverage.avgDistance }} mi</div>
            </div>
            <div class="coverage-item">
              <div class="coverage-label">Total Distance</div>
              <div class="coverage-value">{{ geographicCoverage.totalDistance.toLocaleString() }} mi</div>
            </div>
          </div>
          <div class="zone-breakdown">
            <div class="zone-header">Delivery Zones</div>
            <div v-for="zone in deliveryZones" :key="zone.name" class="zone-item">
              <div class="zone-name">{{ zone.name }}</div>
              <div class="zone-bar">
                <div class="zone-bar-fill" :style="{ width: zone.percentage + '%' }"/>
              </div>
              <div class="zone-percentage">{{ zone.percentage }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Tables -->
    <div class="tables-section">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Delivery Breakdown by Status</h2>
          <button class="btn btn-secondary btn-small">Export CSV</button>
        </div>
        <div class="card-content">
          <div class="data-table">
            <table class="table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                  <th>Percentage</th>
                  <th>Trend</th>
                  <th>Avg Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="status in deliveryStatus" :key="status.name">
                  <td>
                    <span :class="['status-badge', status.class]">{{ status.name }}</span>
                  </td>
                  <td>{{ status.count }}</td>
                  <td>
                    <div class="percentage-bar">
                      <div class="percentage-fill" :style="{ width: status.percentage + '%' }"/>
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
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Cost Analysis</h2>
          <button class="btn btn-secondary btn-small">View Details</button>
        </div>
        <div class="card-content">
          <div class="data-table">
            <table class="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>This Period</th>
                  <th>Last Period</th>
                  <th>Change</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cost in costAnalysis" :key="cost.category">
                  <td><strong>{{ cost.category }}</strong></td>
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
                  <td><strong>Total</strong></td>
                  <td><strong>${{ costTotals.current.toLocaleString() }}</strong></td>
                  <td><strong>${{ costTotals.previous.toLocaleString() }}</strong></td>
                  <td>
                    <strong :class="['change-value', costTotals.change > 0 ? 'negative' : 'positive']">
                      {{ costTotals.change > 0 ? '+' : '' }}{{ costTotals.change }}%
                    </strong>
                  </td>
                  <td><strong>100%</strong></td>
                </tr>
              </tbody>
            </table>
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
  totalDeliveries: 3456,
  deliveryGrowth: 12.5,
  revenue: 189450,
  revenueGrowth: 8.3,
  avgEfficiency: 92.8,
  efficiencyGrowth: 3.2,
  onTimeRate: 94.2,
  onTimeChange: -1.5
})

const deliveryMetrics = reactive({
  completed: 3189,
  pending: 156,
  failed: 111,
  successRate: 92.3
})

const deliveryChart = reactive([
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
  totalDeliveries: 3456
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
  { time: '6AM', deliveries: 8 },
  { time: '8AM', deliveries: 24 },
  { time: '10AM', deliveries: 28 },
  { time: '12PM', deliveries: 22 },
  { time: '2PM', deliveries: 26 },
  { time: '4PM', deliveries: 18 },
  { time: '6PM', deliveries: 12 }
])

const geographicCoverage = reactive({
  totalRoutes: 25,
  coverageArea: 450,
  avgDistance: 32,
  totalDistance: 28450
})

const deliveryZones = reactive([
  { name: 'Downtown', percentage: 35 },
  { name: 'Residential', percentage: 28 },
  { name: 'Industrial', percentage: 22 },
  { name: 'Suburban', percentage: 15 }
])

const deliveryStatus = reactive([
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
    { name: 'description', content: 'Comprehensive analytics dashboard' }
  ]
})
</script>

<style scoped>
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
  margin-bottom: 0.5rem;
}

.executive-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.executive-trend {
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
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
  margin-bottom: 0.25rem;
}

.metric-stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Bar Chart */
.chart-area {
  margin-top: 1.5rem;
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
}

/* Driver Metrics */
.driver-metrics {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.driver-metric-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.driver-metric-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.driver-metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
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
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
}

.fleet-stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fleet-stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.fleet-stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
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
  margin-top: 1rem;
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
}

.vehicle-plate-small {
  font-size: 0.75rem;
  color: var(--text-secondary);
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
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cost-item {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.cost-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.cost-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.cost-detail {
  font-size: 0.75rem;
  color: var(--text-muted);
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
  margin-bottom: 0.25rem;
}

.route-details-small {
  font-size: 0.75rem;
  color: var(--text-secondary);
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
}

/* Peak Hours Chart */
.peak-hours-chart {
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
}

/* Coverage Stats */
.coverage-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.coverage-item {
  text-align: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.coverage-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.coverage-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
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
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
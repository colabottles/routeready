<template>
  <div class="schedule-page">
    <div class="page-header">
      <div class="header-top">
        <div>
          <h1 class="page-title">Schedule</h1>
          <p class="page-subtitle">Manage driver schedules and route assignments</p>
        </div>
        <button class="btn btn-primary" @click="openNewSchedule">
          <PlusIcon :size="18" />
          <span>Add Schedule</span>
        </button>
      </div>
    </div>

    <!-- Date Navigation -->
    <div class="date-navigation">
      <button class="date-nav-btn" @click="previousWeek">
        ←
      </button>
      <div class="current-week">
        <span class="week-label">Week of</span>
        <span class="week-date">{{ currentWeekStart }}</span>
      </div>
      <button class="date-nav-btn" @click="nextWeek">
        →
      </button>
      <button class="btn btn-secondary" @click="goToToday">
        Today
      </button>
    </div>

    <!-- Schedule Grid -->
    <div class="schedule-grid">
      <div class="schedule-header">
        <div class="driver-column-header">Driver</div>
        <div v-for="day in weekDays" :key="day.date" class="day-column-header">
          <div class="day-name">{{ day.name }}</div>
          <div class="day-date">{{ day.date }}</div>
        </div>
      </div>

      <div v-for="driver in drivers" :key="driver.id" class="schedule-row">
        <div class="driver-cell">
          <div class="driver-avatar">
            {{ driver.name.charAt(0) }}
          </div>
          <div class="driver-info">
            <div class="driver-name">{{ driver.name }}</div>
            <div class="driver-hours">{{ driver.weeklyHours }}h this week</div>
          </div>
        </div>

        <div
          v-for="day in weekDays"
          :key="`${driver.id}-${day.date}`"
          class="day-cell"
          :class="{ 'has-assignment': hasAssignment(driver.id, day.date) }"
        >
          <div
            v-if="getAssignment(driver.id, day.date)"
            class="assignment"
            :class="`assignment-${getAssignment(driver.id, day.date).status}`"
          >
            <div class="assignment-route">{{ getAssignment(driver.id, day.date).route }}</div>
            <div class="assignment-time">{{ getAssignment(driver.id, day.date).time }}</div>
          </div>
          <button
            v-else
            class="add-assignment-btn"
            :aria-label="`Add assignment for ${driver.name} on ${day.name} ${day.date}`"
            @click="openAssignmentDialog(driver.id, day.date)"
          >
            <PlusIcon :size="20" />
          </button>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="schedule-summary">
      <div class="summary-card">
        <div class="summary-label">Total Assignments</div>
        <div class="summary-value">{{ stats.totalAssignments }}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Active Drivers</div>
        <div class="summary-value">{{ stats.activeDrivers }}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Avg Hours/Driver</div>
        <div class="summary-value">{{ stats.avgHours }}h</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Unassigned Routes</div>
        <div class="summary-value">{{ stats.unassignedRoutes }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const currentWeekStart = ref('Dec 29, 2024')

const weekDays = reactive([
  { name: 'Mon', date: 'Dec 30' },
  { name: 'Tue', date: 'Dec 31' },
  { name: 'Wed', date: 'Jan 1' },
  { name: 'Thu', date: 'Jan 2' },
  { name: 'Fri', date: 'Jan 3' },
  { name: 'Sat', date: 'Jan 4' },
  { name: 'Sun', date: 'Jan 5' }
])

const drivers = reactive([
  { id: 1, name: 'John Smith', weeklyHours: 40 },
  { id: 2, name: 'Sarah Johnson', weeklyHours: 38 },
  { id: 3, name: 'Mike Davis', weeklyHours: 42 },
  { id: 4, name: 'Lisa Chen', weeklyHours: 36 },
  { id: 5, name: 'Robert Wilson', weeklyHours: 0 }
])

const assignments = reactive([
  { driverId: 1, date: 'Dec 30', route: 'Downtown Route', time: '8:30 AM', status: 'scheduled' },
  { driverId: 1, date: 'Dec 31', route: 'Commercial District', time: '8:00 AM', status: 'scheduled' },
  { driverId: 1, date: 'Jan 1', route: 'Downtown Route', time: '8:30 AM', status: 'scheduled' },
  { driverId: 2, date: 'Dec 30', route: 'Residential A', time: '9:00 AM', status: 'completed' },
  { driverId: 2, date: 'Dec 31', route: 'Residential B', time: '9:00 AM', status: 'scheduled' },
  { driverId: 3, date: 'Dec 30', route: 'Industrial Park', time: '7:00 AM', status: 'completed' },
  { driverId: 3, date: 'Dec 31', route: 'Industrial Park', time: '7:00 AM', status: 'scheduled' },
  { driverId: 3, date: 'Jan 2', route: 'Warehouse District', time: '7:30 AM', status: 'scheduled' },
  { driverId: 4, date: 'Dec 31', route: 'Suburban Route', time: '8:30 AM', status: 'scheduled' },
  { driverId: 4, date: 'Jan 1', route: 'North Loop', time: '9:00 AM', status: 'scheduled' }
])

const stats = reactive({
  totalAssignments: 10,
  activeDrivers: 4,
  avgHours: 39,
  unassignedRoutes: 3
})

function hasAssignment(driverId, date) {
  return assignments.some(a => a.driverId === driverId && a.date === date)
}

function getAssignment(driverId, date) {
  return assignments.find(a => a.driverId === driverId && a.date === date)
}

function previousWeek() {
  console.log('Previous week')
}

function nextWeek() {
  console.log('Next week')
}

function goToToday() {
  console.log('Go to today')
}

function openNewSchedule() {
  console.log('Open new schedule dialog')
}

function openAssignmentDialog(driverId, date) {
  console.log('Open assignment dialog for driver', driverId, 'on', date)
}

useHead({
  title: 'Schedule - RouteReady',
  meta: [
    { name: 'description', content: 'Manage driver schedules' }
  ]
})
</script>

<style scoped>
.schedule-page {
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

/* Date Navigation - Improved Contrast */
.date-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.date-nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: var(--bg-primary);
  border: 2px solid var(--input-border);
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.date-nav-btn:hover {
  background: var(--button-primary);
  color: white;
  border-color: var(--button-primary);
}

.current-week {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.week-label {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.week-date {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* Schedule Grid - High Contrast */
.schedule-grid {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-bottom: 2rem;
  border: 1px solid var(--input-border);
}

.schedule-header {
  display: grid;
  grid-template-columns: 240px repeat(7, 1fr);
  background: var(--bg-primary);
  border-bottom: 2px solid var(--input-border);
}

.driver-column-header {
  padding: 1.25rem 1rem;
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--text-primary);
  border-right: 1px solid var(--input-border);
  background: var(--bg-secondary);
}

.day-column-header {
  padding: 1rem;
  text-align: center;
  border-right: 1px solid var(--input-border);
  background: var(--bg-secondary);
}

.day-column-header:last-child {
  border-right: none;
}

.day-name {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.9375rem;
  margin-bottom: 0.25rem;
}

.day-date {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.schedule-row {
  display: grid;
  grid-template-columns: 240px repeat(7, 1fr);
  border-bottom: 1px solid var(--input-border);
}

.schedule-row:last-child {
  border-bottom: none;
}

.driver-cell {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem 1rem;
  border-right: 1px solid var(--input-border);
  background: var(--bg-secondary);
}

.driver-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--button-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.driver-info {
  flex: 1;
  min-width: 0;
}

.driver-name {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.9375rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.driver-hours {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.day-cell {
  padding: 0.875rem;
  border-right: 1px solid var(--input-border);
  min-height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}

.day-cell:last-child {
  border-right: none;
}

.day-cell.has-assignment {
  background: var(--bg-secondary);
}

/* Assignment Cards - WCAG AA Compliant */
.assignment {
  width: 100%;
  padding: 0.875rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.assignment-scheduled {
  background: #e0f2fe;
  border-color: #0284c7;
}

.assignment-scheduled .assignment-route {
  color: #075985;
}

.assignment-scheduled .assignment-time {
  color: #0c4a6e;
}

.assignment-completed {
  background: #dcfce7;
  border-color: #16a34a;
}

.assignment-completed .assignment-route {
  color: #15803d;
}

.assignment-completed .assignment-time {
  color: #166534;
}

.assignment:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.assignment-route {
  font-weight: 700;
  font-size: 0.875rem;
  margin-bottom: 0.375rem;
  line-height: 1.3;
}

.assignment-time {
  font-size: 0.8125rem;
  font-weight: 600;
}

/* Add Assignment Button - High Contrast */
.add-assignment-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2px solid var(--input-border);
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-assignment-btn:hover {
  background: var(--button-primary);
  border-color: var(--button-primary);
  color: white;
  transform: scale(1.1);
}

.add-assignment-btn:focus {
  outline: 2px solid var(--button-primary);
  outline-offset: 2px;
}

/* Summary Cards - Improved Contrast */
.schedule-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.summary-card {
  background: var(--bg-primary);
  padding: 1.75rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  text-align: center;
  border: 1px solid var(--input-border);
  transition: transform 0.2s;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.summary-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

@media (max-width: 1400px) {
  .schedule-header,
  .schedule-row {
    grid-template-columns: 200px repeat(7, 1fr);
  }

  .driver-name {
    font-size: 0.875rem;
  }
}

@media (max-width: 1024px) {
  .schedule-grid {
    overflow-x: auto;
  }

  .schedule-header,
  .schedule-row {
    min-width: 1100px;
  }
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 1rem;
  }

  .date-navigation {
    flex-wrap: wrap;
  }

  .schedule-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
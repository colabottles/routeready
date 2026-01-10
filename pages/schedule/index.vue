<template>
  <main class="schedule-page">
    <header class="page-header">
      <h1 class="page-title">Schedule</h1>
      <p class="page-subtitle">Manage driver schedules and assignments</p>
      <nav class="header-actions">
        <button class="btn btn-secondary" @click="showPrintDialog = true">
          <span aria-hidden="true">🖨️</span>
          Print
        </button>
        <button class="btn btn-secondary" @click="showShareDialog = true">
          <span aria-hidden="true">📤</span>
          Share
        </button>
        <NuxtLink to="/schedule/new" class="btn btn-primary">
          <span aria-hidden="true">➕</span>
          Add Schedule
        </NuxtLink>
      </nav>
    </header>

    <!-- View Toggle & Date Navigation -->
    <section class="controls-section">
      <div class="view-toggle">
        <button
          :class="['view-btn', { active: currentView === 'day' }]"
          @click="currentView = 'day'"
        >
          Day
        </button>
        <button
          :class="['view-btn', { active: currentView === 'week' }]"
          @click="currentView = 'week'"
        >
          Week
        </button>
        <button
          :class="['view-btn', { active: currentView === 'month' }]"
          @click="currentView = 'month'"
        >
          Month
        </button>
      </div>

      <div class="date-navigation">
        <button class="nav-btn" aria-label="Previous period" @click="navigatePrevious">
          ←
        </button>
        <h2 class="current-period">{{ currentPeriodLabel }}</h2>
        <button class="nav-btn" aria-label="Next period" @click="navigateNext">
          →
        </button>
        <button class="btn btn-secondary btn-small" @click="goToToday">
          Today
        </button>
      </div>

      <form class="filters">
        <select v-model="selectedDriver" class="form-select" aria-label="Filter by driver" @change="loadSchedules">
          <option value="">All Drivers</option>
          <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
            {{ driver.name }}
          </option>
        </select>
        <select v-model="selectedStatus" class="form-select" aria-label="Filter by status">
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </form>
    </section>

    <!-- Loading State -->
    <section v-if="pending" class="loading-state" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true">⏳</span>
      <p>Loading schedules...</p>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-state">
      <span class="error-icon" aria-hidden="true">⚠️</span>
      <h2 class="error-title">Failed to load schedules</h2>
      <p class="error-message">{{ error.message }}</p>
      <button class="btn btn-primary" @click="loadSchedules">Try Again</button>
    </section>

    <!-- Schedule Views -->
    <template v-else>
      <!-- Day View -->
      <section v-if="currentView === 'day'" class="day-view">
        <article v-for="schedule in filteredSchedules" :key="schedule.id" class="schedule-card">
          <header class="schedule-header">
            <h3 class="driver-name">{{ schedule.driver_name }}</h3>
            <span class="schedule-status" :class="`status-${schedule.status}`">
              {{ schedule.status }}
            </span>
          </header>

          <dl class="schedule-details">
            <dt>Time:</dt>
            <dd>{{ formatTime(schedule.shift_start) }} - {{ formatTime(schedule.shift_end) }}</dd>

            <dt>Route:</dt>
            <dd>{{ schedule.route_assigned || 'Not assigned' }}</dd>

            <dt>Vehicle:</dt>
            <dd>{{ schedule.vehicle_name || 'Not assigned' }}</dd>

            <dt v-if="schedule.notes">Notes:</dt>
            <dd v-if="schedule.notes">{{ schedule.notes }}</dd>
          </dl>

          <nav class="schedule-actions">
            <NuxtLink :to="`/schedule/edit-${schedule.id}`" class="btn btn-secondary btn-small">
              Edit
            </NuxtLink>
            <button class="btn btn-danger btn-small" @click="deleteSchedule(schedule.id)">
              Delete
            </button>
          </nav>
        </article>

        <p v-if="filteredSchedules.length === 0" class="empty-state">
          No schedules for this day
        </p>
      </section>

      <!-- Week View -->
      <section v-if="currentView === 'week'" class="week-view">
        <div class="week-grid">
          <div v-for="day in weekDays" :key="day.date" class="day-column">
            <header class="day-header">
              <h3 class="day-name">{{ day.name }}</h3>
              <p class="day-date">{{ day.dateFormatted }}</p>
            </header>

            <article
              v-for="schedule in getSchedulesForDate(day.date)"
              :key="schedule.id"
              class="schedule-card-compact"
              @click="navigateTo(`/schedule/edit-${schedule.id}`)"
            >
              <strong class="driver-name-compact">{{ schedule.driver_name }}</strong>
              <p class="time-compact">{{ formatTime(schedule.shift_start) }} - {{ formatTime(schedule.shift_end) }}</p>
              <p class="route-compact">{{ schedule.route_assigned || 'No route' }}</p>
            </article>

            <p v-if="getSchedulesForDate(day.date).length === 0" class="no-schedules">
              No schedules
            </p>
          </div>
        </div>
      </section>

      <!-- Month View -->
      <section v-if="currentView === 'month'" class="month-view">
        <div class="month-header-row">
          <div class="month-weekday">Sun</div>
          <div class="month-weekday">Mon</div>
          <div class="month-weekday">Tue</div>
          <div class="month-weekday">Wed</div>
          <div class="month-weekday">Thu</div>
          <div class="month-weekday">Fri</div>
          <div class="month-weekday">Sat</div>
        </div>

        <div class="month-grid">
          <div v-for="day in monthDays" :key="day.date" class="month-day" :class="{ 'other-month': !day.isCurrentMonth, 'today': isToday(day.date) }">
            <header class="month-day-header">
              <span class="month-day-number">{{ day.dayNumber }}</span>
              <span v-if="getSchedulesForDate(day.date).length > 0" class="schedule-count">
                {{ getSchedulesForDate(day.date).length }}
              </span>
            </header>

            <div class="month-day-schedules">
              <button
                v-for="schedule in getSchedulesForDate(day.date).slice(0, 3)"
                :key="schedule.id"
                class="schedule-item-month"
                :class="`status-${schedule.status}`"
                @click="navigateTo(`/schedule/edit-${schedule.id}`)"
              >
                <span class="schedule-time">{{ formatTime(schedule.shift_start) }}</span>
                <span class="schedule-driver-name">{{ schedule.driver_name }}</span>
              </button>

              <button
                v-if="getSchedulesForDate(day.date).length > 3"
                class="more-schedules"
                @click="viewDaySchedules(day.date)"
              >
                +{{ getSchedulesForDate(day.date).length - 3 }} more
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Summary Stats -->
      <section class="stats-section">
        <article class="stat-card">
          <span class="stat-icon" aria-hidden="true">📅</span>
          <strong class="stat-value">{{ stats.total }}</strong>
          <span class="stat-label">Total Schedules</span>
        </article>
        <article class="stat-card">
          <span class="stat-icon" aria-hidden="true">✅</span>
          <strong class="stat-value">{{ stats.scheduled }}</strong>
          <span class="stat-label">Scheduled</span>
        </article>
        <article class="stat-card">
          <span class="stat-icon" aria-hidden="true">🚀</span>
          <strong class="stat-value">{{ stats.inProgress }}</strong>
          <span class="stat-label">In Progress</span>
        </article>
        <article class="stat-card">
          <span class="stat-icon" aria-hidden="true">✔️</span>
          <strong class="stat-value">{{ stats.completed }}</strong>
          <span class="stat-label">Completed</span>
        </article>
      </section>
    </template>

    <!-- Print Dialog -->
    <dialog v-if="showPrintDialog" class="dialog" open @click.self="showPrintDialog = false">
      <article class="dialog-content">
        <header class="dialog-header">
          <h2>Print Schedule</h2>
          <button class="close-btn" aria-label="Close dialog" @click="showPrintDialog = false">✕</button>
        </header>
        <form @submit.prevent="handlePrint">
          <p>Select the date range and format for printing:</p>

          <label>
            Start Date
            <input v-model="printOptions.startDate" type="date" class="form-input" required>
          </label>

          <label>
            End Date
            <input v-model="printOptions.endDate" type="date" class="form-input" required>
          </label>

          <label>
            <input v-model="printOptions.includeNotes" type="checkbox" class="form-checkbox">
            Include notes
          </label>

          <nav class="dialog-actions">
            <button type="submit" class="btn btn-primary">Print</button>
            <button type="button" class="btn btn-secondary" @click="showPrintDialog = false">Cancel</button>
          </nav>
        </form>
      </article>
    </dialog>

    <!-- Share Dialog -->
    <dialog v-if="showShareDialog" class="dialog" open @click.self="showShareDialog = false">
      <article class="dialog-content">
        <header class="dialog-header">
          <h2>Share Schedule</h2>
          <button class="close-btn" aria-label="Close dialog" @click="showShareDialog = false">✕</button>
        </header>
        <form @submit.prevent="handleShare">
          <p>Send schedule via email or text:</p>

          <label>
            Recipient Email/Phone
            <input v-model="shareOptions.recipient" type="text" class="form-input" placeholder="email@example.com or +1234567890" required>
          </label>

          <label>
            Method
            <select v-model="shareOptions.method" class="form-select" required>
              <option value="email">Email</option>
              <option value="sms">Text Message</option>
            </select>
          </label>

          <label>
            Start Date
            <input v-model="shareOptions.startDate" type="date" class="form-input" required>
          </label>

          <label>
            End Date
            <input v-model="shareOptions.endDate" type="date" class="form-input" required>
          </label>

          <p v-if="shareError" class="error-message">{{ shareError }}</p>
          <p v-if="shareSuccess" class="success-message">{{ shareSuccess }}</p>

          <nav class="dialog-actions">
            <button type="submit" class="btn btn-primary" :disabled="isSharing">
              {{ isSharing ? 'Sending...' : 'Send' }}
            </button>
            <button type="button" class="btn btn-secondary" @click="showShareDialog = false">Cancel</button>
          </nav>
        </form>
      </article>
    </dialog>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

// Load default view from settings
// Load default view from settings
const getDefaultView = () => {
  if (import.meta.client) {
    const savedSettings = localStorage.getItem('routeready-settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        return settings.preferences?.defaultScheduleView || 'week'
      } catch {
        return 'week'
      }
    }
  }
  return 'week'
}

const currentView = ref(getDefaultView())
const currentDate = ref(new Date())
const selectedDriver = ref('')
const selectedStatus = ref('')
const showPrintDialog = ref(false)
const showShareDialog = ref(false)

const printOptions = reactive({
  startDate: '',
  endDate: '',
  includeNotes: true
})

const shareOptions = reactive({
  recipient: '',
  method: 'email',
  startDate: '',
  endDate: ''
})

const shareError = ref('')
const shareSuccess = ref('')
const isSharing = ref(false)

// Fetch drivers for filter
const { data: driversData } = await useFetch('/api/drivers', {
  transform: (response) => response.data || []
})

const drivers = computed(() => driversData.value || [])

// Compute date range based on view
const dateRange = computed(() => {
  const date = new Date(currentDate.value)

  if (currentView.value === 'day') {
    const start = new Date(date)
    const end = new Date(date)
    return { start, end }
  } else if (currentView.value === 'week') {
    const start = new Date(date)
    start.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return { start, end }
  } else { // month
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return { start, end }
  }
})

// Format dates for API
const formatDateForAPI = (date) => {
  return date.toISOString().split('T')[0]
}

// Fetch schedules
const { data: schedulesData, pending, error, refresh: loadSchedules } = await useFetch('/api/schedules', {
  query: computed(() => ({
    startDate: formatDateForAPI(dateRange.value.start),
    endDate: formatDateForAPI(dateRange.value.end),
    driverId: selectedDriver.value || undefined
  })),
  transform: (response) => response.data || []
})

const schedules = computed(() => schedulesData.value || [])

// Filtered schedules
const filteredSchedules = computed(() => {
  if (!selectedStatus.value) return schedules.value
  return schedules.value.filter(s => s.status === selectedStatus.value)
})

// Stats
const stats = computed(() => {
  const all = filteredSchedules.value
  return {
    total: all.length,
    scheduled: all.filter(s => s.status === 'scheduled').length,
    inProgress: all.filter(s => s.status === 'in-progress').length,
    completed: all.filter(s => s.status === 'completed').length
  }
})

// Current period label
const currentPeriodLabel = computed(() => {
  const date = new Date(currentDate.value)

  if (currentView.value === 'day') {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  } else if (currentView.value === 'week') {
    const start = dateRange.value.start
    const end = dateRange.value.end
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  } else {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
})

// Week days
const weekDays = computed(() => {
  const days = []
  const start = new Date(dateRange.value.start)

  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push({
      date: formatDateForAPI(date),
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })
  }

  return days
})

// Month days
const monthDays = computed(() => {
  const days = []
  const date = new Date(currentDate.value)
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  // Add days from previous month to fill the first week
  const startDay = firstDay.getDay()
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(firstDay)
    d.setDate(firstDay.getDate() - i - 1)
    days.push({
      date: formatDateForAPI(d),
      dayNumber: d.getDate(),
      isCurrentMonth: false
    })
  }

  // Add all days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(date.getFullYear(), date.getMonth(), i)
    days.push({
      date: formatDateForAPI(d),
      dayNumber: i,
      isCurrentMonth: true
    })
  }

  // Add days from next month to fill the last week
  const remainingDays = 42 - days.length // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const d = new Date(lastDay)
    d.setDate(lastDay.getDate() + i)
    days.push({
      date: formatDateForAPI(d),
      dayNumber: d.getDate(),
      isCurrentMonth: false
    })
  }

  return days
})

// Get schedules for a specific date
const getSchedulesForDate = (dateString) => {
  return filteredSchedules.value.filter(s => {
    // Ensure both dates are in YYYY-MM-DD format for comparison
    const scheduleDate = s.date.split('T')[0] // Handle if date comes with time
    return scheduleDate === dateString
  })
}

// Check if date is today
const isToday = (dateString) => {
  const today = new Date()
  const todayString = formatDateForAPI(today)
  return dateString === todayString
}

// View day schedules (switch to day view for specific date)
const viewDaySchedules = (dateString) => {
  const [year, month, day] = dateString.split('-')
  currentDate.value = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  currentView.value = 'day'
}

// Navigation
const navigatePrevious = () => {
  const date = new Date(currentDate.value)

  if (currentView.value === 'day') {
    date.setDate(date.getDate() - 1)
  } else if (currentView.value === 'week') {
    date.setDate(date.getDate() - 7)
  } else {
    date.setMonth(date.getMonth() - 1)
  }

  currentDate.value = date
}

const navigateNext = () => {
  const date = new Date(currentDate.value)

  if (currentView.value === 'day') {
    date.setDate(date.getDate() + 1)
  } else if (currentView.value === 'week') {
    date.setDate(date.getDate() + 7)
  } else {
    date.setMonth(date.getMonth() + 1)
  }

  currentDate.value = date
}

const goToToday = () => {
  currentDate.value = new Date()
}

// Format time
const formatTime = (timeString) => {
  if (!timeString) return ''
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

// Delete schedule
const deleteSchedule = async (id) => {
  if (!confirm('Are you sure you want to delete this schedule?')) return

  try {
    await $fetch(`/api/schedules/${id}`, { method: 'DELETE' })
    await loadSchedules()
  } catch (error) {
    console.error('Error deleting schedule:', error)
    alert('Failed to delete schedule')
  }
}

// Print handler
const handlePrint = () => {
  // Add print date to page
  const pageElement = document.querySelector('.schedule-page')
  if (pageElement) {
    pageElement.setAttribute('data-print-date', new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }))
  }

  showPrintDialog.value = false

  // Small delay to ensure dialog closes before printing
  setTimeout(() => {
    window.print()
  }, 100)
}

// Share handler
const handleShare = async () => {
  shareError.value = ''
  shareSuccess.value = ''
  isSharing.value = true

  try {
    // In a real app, this would call an API endpoint to send email/SMS
    // For now, we'll just simulate it
    await new Promise(resolve => setTimeout(resolve, 1500))

    shareSuccess.value = `Schedule sent via ${shareOptions.method} to ${shareOptions.recipient}`

    setTimeout(() => {
      showShareDialog.value = false
      shareSuccess.value = ''
    }, 2000)
  } catch {
    shareError.value = 'Failed to share schedule. Please try again.'
  } finally {
    isSharing.value = false
  }
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
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
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

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.controls-section {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.view-toggle {
  display: flex;
  gap: 0;
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 0.25rem;
}

.view-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  color: var(--text-primary);
}

.view-btn.active {
  background: var(--button-primary);
  color: white;
}

.date-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--input-border);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  border-color: var(--button-primary);
  background: var(--button-primary);
  color: white;
}

.current-period {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  min-width: 250px;
  text-align: center;
}

.filters {
  display: flex;
  gap: 1rem;
}

.form-select {
  padding: 0.625rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: 8px;
  font-size: 0.9375rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.2s;
}

.form-select:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Day View */
.day-view {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.schedule-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  border: 2px solid transparent;
  transition: all 0.2s;
}

.schedule-card:hover {
  border-color: var(--button-primary);
  transform: translateY(-2px);
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-border);
}

.driver-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.schedule-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-scheduled {
  background: #3b82f6;
  color: #ffffff;
}

.status-in-progress {
  background: #f59e0b;
  color: #000000;
}

.status-completed {
  background: #10b981;
  color: #ffffff;
}

.status-cancelled {
  background: #6b7280;
  color: #ffffff;
}

.schedule-details {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem 1rem;
  margin: 0 0 1.25rem 0;
  align-items: baseline;
}

.schedule-details dt {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
}

.schedule-details dd {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 600;
  margin: 0;
}

.schedule-actions {
  display: flex;
  gap: 0.5rem;
}

/* Week View */
.week-view {
  margin-bottom: 2rem;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}

.day-column {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: var(--shadow);
  min-height: 300px;
}

.day-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--input-border);
}

.day-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.day-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.schedule-card-compact {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.schedule-card-compact:hover {
  border-color: var(--button-primary);
  transform: translateX(4px);
}

.driver-name-compact {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.time-compact,
.route-compact {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
}

.no-schedules {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 2rem;
}

/* Month View */
.month-view {
  margin-bottom: 2rem;
}

.month-header-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--input-border);
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  margin-bottom: 1px;
}

.month-weekday {
  background: var(--bg-secondary);
  padding: 0.75rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--input-border);
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}

.month-day {
  background: var(--bg-primary);
  min-height: 120px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
}

.month-day.other-month {
  background: var(--bg-secondary);
  opacity: 0.6;
}

.month-day.today {
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid var(--button-primary);
}

.month-day.today .month-day-number {
  background: var(--button-primary);
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.month-day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
}

.month-day-number {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
}

.schedule-count {
  background: var(--button-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  min-width: 20px;
  text-align: center;
}

.month-day-schedules {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
  overflow-x: hidden; /* Add this line */
  flex: 1;
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: var(--input-border) transparent; /* Firefox */
}

/* Webkit browsers (Chrome, Safari, Edge) */
.month-day-schedules::-webkit-scrollbar {
  width: 4px;
}

.month-day-schedules::-webkit-scrollbar-track {
  background: transparent;
}

.month-day-schedules::-webkit-scrollbar-thumb {
  background: var(--input-border);
  border-radius: 2px;
}

.month-day-schedules::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.schedule-item-month {
  background: var(--bg-secondary);
  border: none;
  border-left: 3px solid;
  padding: 0.375rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.schedule-item-month:hover {
  transform: translateX(2px);
  box-shadow: var(--shadow);
}

.schedule-item-month.status-scheduled {
  border-left-color: #3b82f6;
}

.schedule-item-month.status-in-progress {
  border-left-color: #f59e0b;
}

.schedule-item-month.status-completed {
  border-left-color: #10b981;
}

.schedule-item-month.status-cancelled {
  border-left-color: #6b7280;
  opacity: 0.6;
}

.schedule-time {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
}

.schedule-driver-name {
  font-size: 0.75rem;
  color: var(--text-secondary);
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-schedules {
  background: transparent;
  border: 1px dashed var(--input-border);
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--text-secondary);
  transition: all 0.2s;
  text-align: center;
}

.more-schedules:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-style: solid;
}

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

/* Stats */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
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

/* Dialog */
.dialog {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border: none;
  padding: 1rem;
}

.dialog-content {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-lg);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.dialog-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.dialog-content form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dialog-content label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input,
.form-checkbox {
  padding: 0.75rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-checkbox {
  width: 20px;
  height: 20px;
  padding: 0;
  cursor: pointer;
}

.dialog-content label:has(.form-checkbox) {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.success-message {
  background: var(--success-bg);
  border: 2px solid var(--success-border);
  color: var(--success-text);
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0;
}

.dialog-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

/* Print Styles */
@media print {
  /* Hide non-printable elements */
  .header-actions,
  .controls-section,
  .schedule-actions,
  .nav-btn,
  .btn,
  .filters,
  .view-toggle,
  .stats-section {
    display: none !important;
  }

  /* Reset page margins */
  @page {
    margin: 1cm;
    size: auto;
  }

  /* Portrait layout */
  @page portrait {
    size: portrait;
  }

  /* Landscape layout */
  @page landscape {
    size: landscape;
  }

  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .schedule-page {
    max-width: 100%;
    margin: 0;
  }

  .page-header {
    margin-bottom: 1rem;
    page-break-after: avoid;
  }

  .page-title {
    font-size: 1.5rem;
    color: #000;
  }

  .page-subtitle {
    color: #666;
  }

  .current-period {
    font-size: 1rem;
    text-align: left;
    min-width: auto;
    margin-bottom: 1rem;
  }

  /* Day View Print */
  .day-view {
    display: block;
  }

  .schedule-card {
    page-break-inside: avoid;
    border: 1px solid #ddd;
    box-shadow: none;
    margin-bottom: 1rem;
  }

  .schedule-header {
    border-bottom: 1px solid #ddd;
  }

  .driver-name {
    color: #000;
  }

  .schedule-status {
    border: 1px solid #000;
  }

  .schedule-details dt,
  .schedule-details dd {
    color: #000;
  }

  /* Week View Print - Portrait */
  @media print and (orientation: portrait) {
    .week-view .week-grid {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .day-column {
      page-break-inside: avoid;
      box-shadow: none;
      border: 1px solid #ddd;
      margin-bottom: 0.5rem;
    }
  }

  /* Week View Print - Landscape */
  @media print and (orientation: landscape) {
    .week-view .week-grid {
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }

    .day-column {
      box-shadow: none;
      border: 1px solid #ddd;
      min-height: auto;
      font-size: 0.75rem;
    }

    .day-header {
      margin-bottom: 0.5rem;
      padding-bottom: 0.5rem;
    }

    .day-name {
      font-size: 0.875rem;
    }

    .day-date {
      font-size: 0.75rem;
    }

    .schedule-card-compact {
      padding: 0.5rem;
      margin-bottom: 0.25rem;
      border: 1px solid #ddd;
      box-shadow: none;
    }

    .driver-name-compact {
      font-size: 0.75rem;
    }

    .time-compact,
    .route-compact {
      font-size: 0.625rem;
    }
  }

  /* Month View Print - Always Landscape */
  .month-view {
    page: landscape;
  }

  .month-header-row {
    background: #000;
    gap: 1px;
  }

  .month-weekday {
    background: #f5f5f5;
    color: #000;
    border: none;
  }

  .month-grid {
    gap: 1px;
    background: #000;
    box-shadow: none;
    page-break-inside: avoid;
  }

  .month-day {
    background: #fff;
    border: none;
    min-height: 100px;
    font-size: 0.75rem;
  }

  .month-day.other-month {
    background: #f9f9f9;
  }

  .month-day.today {
    background: #e8eeff;
    border: 2px solid #3b82f6;
  }

  .month-day-number {
    font-size: 0.75rem;
    color: #000;
  }

  .schedule-count {
    background: #666;
    color: #fff;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .schedule-item-month {
    border-left-width: 2px;
    font-size: 0.625rem;
    padding: 0.25rem;
    background: #f5f5f5;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .schedule-time,
  .schedule-driver-name {
    font-size: 0.625rem;
    color: #000;
  }

  .more-schedules {
    font-size: 0.625rem;
    border-color: #ddd;
  }

  /* Ensure status colors print */
  .status-scheduled,
  .schedule-item-month.status-scheduled {
    background: #3b82f6 !important;
    color: #fff !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .status-in-progress,
  .schedule-item-month.status-in-progress {
    background: #f59e0b !important;
    color: #000 !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .status-completed,
  .schedule-item-month.status-completed {
    background: #10b981 !important;
    color: #fff !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .status-cancelled,
  .schedule-item-month.status-cancelled {
    background: #6b7280 !important;
    color: #fff !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  /* Print footer with date */
  .schedule-page::after {
    content: "Printed: " attr(data-print-date);
    display: block;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #ddd;
    font-size: 0.75rem;
    color: #666;
    text-align: center;
  }

  /* Empty states */
  .empty-state,
  .no-schedules {
    color: #666;
    font-size: 0.875rem;
  }

  /* Hide dialogs */
  .dialog {
    display: none !important;
  }
}

/* Print-specific page breaks */
@media print {
  h1, h2, h3 {
    page-break-after: avoid;
  }

  .schedule-card,
  .day-column {
    page-break-inside: avoid;
  }

  /* Force landscape for month view */
  .month-view {
    width: 100%;
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .week-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 968px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .controls-section {
    flex-direction: column;
    align-items: stretch;
  }

  .date-navigation {
    justify-content: space-between;
  }

  .week-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .week-grid,
  .stats-section {
    grid-template-columns: 1fr;
  }

  .month-grid {
    gap: 0;
  }

  .month-day {
    min-height: 60px;
    padding: 0.25rem;
  }
}
</style>
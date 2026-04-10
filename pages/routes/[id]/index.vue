<template>
  <div class="route-detail-page">

    <!-- Page header -->
    <div class="page-header">
      <div class="header-left">
        <NuxtLink to="/routes" class="btn btn-secondary btn-small btn-back">
          ← Routes
        </NuxtLink>
        <div class="header-title">
          <div class="title-row">
            <h1 class="page-title">{{ route.name }}</h1>
            <span :class="['status-badge', `status-${route.status}`]">{{ route.status }}</span>
          </div>
          <p class="route-code">{{ route.code }}</p>
        </div>
      </div>
      <div class="header-actions">
        <NuxtLink :to="`/routes/${routeId}/map`" class="btn btn-secondary btn-small">
          View Map
        </NuxtLink>
        <button class="btn btn-secondary btn-small" @click="openAssignDriver">
          Assign Driver
        </button>
        <button class="btn btn-secondary btn-small" @click="editRoute">
          Edit
        </button>
        <button class="btn btn-danger btn-small" @click="confirmDelete">
          Delete
        </button>
      </div>
    </div>

    <div class="detail-layout">

      <!-- Left column -->
      <div class="detail-main">

        <!-- Route info -->
        <section class="detail-card">
          <h2 class="card-title">Route Info</h2>
          <p class="route-description">{{ route.description }}</p>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Status</span>
              <span :class="['status-badge', `status-${route.status}`]">{{ route.status }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Route Code</span>
              <span class="info-value">{{ route.code }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Start Point</span>
              <span class="info-value">{{ route.start }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">End Point</span>
              <span class="info-value">{{ route.end }}</span>
            </div>
          </div>
        </section>

        <!-- Schedule -->
        <section class="detail-card">
          <h2 class="card-title">Schedule</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Start Time</span>
              <span class="info-value">{{ route.startTime }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Est. Duration</span>
              <span class="info-value">{{ route.duration }} hrs</span>
            </div>
            <div class="info-item">
              <span class="info-label">Est. End Time</span>
              <span class="info-value">{{ estimatedEndTime }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Days Active</span>
              <span class="info-value">{{ route.daysActive?.join(', ') || '—' }}</span>
            </div>
          </div>
        </section>

        <!-- Stops -->
        <section class="detail-card">
          <div class="card-header">
            <h2 class="card-title">Stops</h2>
            <button class="btn btn-primary btn-small" @click="addingStop = true">
              + Add Stop
            </button>
          </div>

          <!-- Add stop form -->
          <div v-if="addingStop" class="stop-form">
            <input
              v-model="newStopAddress"
              class="form-input"
              type="text"
              placeholder="Enter address"
              @keydown.enter="addStop"
              @keydown.escape="cancelAddStop" >
            <input
              v-model="newStopName"
              class="form-input"
              type="text"
              placeholder="Stop name (optional)"
              @keydown.enter="addStop"
              @keydown.escape="cancelAddStop" >
            <div class="stop-form-actions">
              <button class="btn btn-primary btn-small" @click="addStop">Add</button>
              <button class="btn btn-secondary btn-small" @click="cancelAddStop">Cancel</button>
            </div>
          </div>

          <ol v-if="stops.length > 0" class="stops-list">
            <li
              v-for="(stop, index) in stops"
              :key="stop.id"
              class="stop-row"
              :class="{ 'stop-row--editing': editingStopId === stop.id }">
              <span class="stop-index">{{ index + 1 }}</span>
              <div class="stop-body">
                <template v-if="editingStopId === stop.id">
                  <input
                    :ref="el => { if (el) stopEditRefs[stop.id] = el }"
                    v-model="stopEditName"
                    class="form-input form-input--inline"
                    type="text"
                    placeholder="Stop name"
                    @keydown.enter="saveStopEdit(stop)"
                    @keydown.escape="cancelStopEdit" >
                  <input
                    v-model="stopEditAddress"
                    class="form-input form-input--inline"
                    type="text"
                    placeholder="Address"
                    @keydown.enter="saveStopEdit(stop)"
                    @keydown.escape="cancelStopEdit" >
                  <div class="stop-edit-actions">
                    <button
class="btn btn-primary btn-small"
                      @click="saveStopEdit(stop)">Save</button>
                    <button
class="btn btn-secondary btn-small"
                      @click="cancelStopEdit">Cancel</button>
                  </div>
                </template>
                <template v-else>
                  <span class="stop-name">{{ stop.name }}</span>
                  <span class="stop-address">{{ stop.address }}</span>
                </template>
              </div>
              <div v-if="editingStopId !== stop.id" class="stop-actions">
                <button
class="stop-btn" aria-label="Edit stop"
                  @click="startStopEdit(stop)">✎</button>
                <button
class="stop-btn stop-btn--remove" aria-label="Remove stop"
                  @click="removeStop(stop.id)">✕</button>
              </div>
            </li>
          </ol>
          <p v-else class="empty-state">No stops added yet. Use the map or add one above.</p>
        </section>

      </div>

      <!-- Right column -->
      <div class="detail-sidebar">

        <!-- Stats -->
        <section class="detail-card">
          <h2 class="card-title">Route Stats</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">{{ route.properties }}</span>
              <span class="stat-label">Properties</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ route.distance }}</span>
              <span class="stat-label">Miles</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ route.duration }}</span>
              <span class="stat-label">Hours</span>
            </div>
            <div class="stat-item">
              <span class="stat-value stat-value--highlight">{{ route.efficiency }}%</span>
              <span class="stat-label">Efficiency</span>
            </div>
          </div>
        </section>

        <!-- Driver & Vehicle -->
        <section class="detail-card">
          <div class="card-header">
            <h2 class="card-title">Driver & Vehicle</h2>
            <button class="text-btn" @click="openAssignDriver">
              {{ route.driver ? 'Reassign' : 'Assign' }}
            </button>
          </div>

          <div v-if="route.driver" class="driver-card">
            <div class="driver-avatar">{{ driverInitials }}</div>
            <div class="driver-info">
              <span class="driver-name">{{ route.driver }}</span>
              <span class="driver-meta">{{ route.vehicle || 'No vehicle assigned' }}</span>
            </div>
          </div>
          <p v-else class="empty-state">No driver assigned.</p>

          <div v-if="route.vehicle" class="vehicle-row">
            <span class="info-label">Vehicle</span>
            <span class="info-value">{{ route.vehicle }}</span>
          </div>
          <div v-if="route.licenseplate" class="vehicle-row">
            <span class="info-label">Plate</span>
            <span class="info-value">{{ route.licenseplate }}</span>
          </div>
        </section>

        <!-- Activity log -->
        <section class="detail-card">
          <h2 class="card-title">Activity</h2>
          <ol class="activity-log">
            <li v-for="entry in route.activity" :key="entry.id" class="activity-entry">
              <span class="activity-dot" />
              <div class="activity-body">
                <span class="activity-text">{{ entry.text }}</span>
                <span class="activity-time">{{ entry.time }}</span>
              </div>
            </li>
          </ol>
          <p v-if="!route.activity?.length" class="empty-state">No activity yet.</p>
        </section>

      </div>
    </div>

    <!-- Assign Driver modal -->
    <div v-if="assignDriverOpen" class="modal-backdrop" @click.self="assignDriverOpen = false">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="assign-driver-title">
        <h2 id="assign-driver-title" class="modal-title">Assign Driver</h2>
        <ul class="driver-list">
          <li
v-for="driver in availableDrivers" :key="driver.id" class="driver-option"
            :class="{ 'driver-option--selected': selectedDriverId === driver.id }"
            @click="selectedDriverId = driver.id">
            <div class="driver-avatar driver-avatar--sm">{{ driver.initials }}</div>
            <div class="driver-info">
              <span class="driver-name">{{ driver.name }}</span>
              <span class="driver-meta">{{ driver.vehicle }}</span>
            </div>
            <span v-if="selectedDriverId === driver.id" class="driver-check">✓</span>
          </li>
        </ul>
        <div class="modal-actions">
          <button class="btn btn-primary" @click="assignDriver">Confirm</button>
          <button class="btn btn-secondary" @click="assignDriverOpen = false">Cancel</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const currentRoute = useRoute()
const routeId = computed(() => currentRoute.params.id)

// Placeholder route data — replace with Supabase fetch
const route = reactive({
  id: routeId.value,
  code: `R${routeId.value}`,
  name: `Route ${routeId.value}`,
  description: 'Manage properties and service stops along this route.',
  status: 'active',
  driver: 'John Smith',
  vehicle: 'Ford Transit 2022',
  licenseplate: 'AZ-4821',
  properties: 6,
  distance: 32,
  duration: 4.5,
  efficiency: 96,
  start: '1112 W Hatcher Rd, Phoenix, AZ 85021',
  end: '1112 W Hatcher Rd, Phoenix, AZ 85021',
  startTime: '8:30 AM',
  daysActive: ['Mon', 'Wed', 'Fri'],
  activity: [
    { id: 1, text: 'Route activated', time: 'Today, 8:30 AM' },
    { id: 2, text: 'Driver John Smith assigned', time: 'Yesterday, 4:15 PM' },
    { id: 3, text: 'Route created', time: 'Mar 28, 2:00 PM' },
  ],
})

// Computed
const estimatedEndTime = computed(() => {
  if (!route.startTime || !route.duration) return '—'
  const [time, period] = route.startTime.split(' ')
  const [h, m] = time.split(':').map(Number)
  let hours = h + (period === 'PM' && h !== 12 ? 12 : 0)
  hours += Math.floor(route.duration)
  const mins = m + Math.round((route.duration % 1) * 60)
  const totalMins = hours * 60 + mins
  const endH = Math.floor(totalMins / 60) % 24
  const endM = totalMins % 60
  const endPeriod = endH >= 12 ? 'PM' : 'AM'
  const display = `${endH > 12 ? endH - 12 : endH || 12}:${String(endM).padStart(2, '0')} ${endPeriod}`
  return display
})

const driverInitials = computed(() => {
  if (!route.driver) return ''
  return route.driver.split(' ').map(n => n[0]).join('').toUpperCase()
})

// Stops — replace with Supabase fetch
const stops = ref([
  { id: 1, name: 'North Office Complex', address: '1112 W Hatcher Rd, Phoenix, AZ 85021' },
  { id: 2, name: 'Sunnyslope Plaza', address: '9375 N 7th St, Phoenix, AZ 85020' },
  { id: 3, name: 'Metro Parkway Center', address: '2929 W Dunlap Ave, Phoenix, AZ 85051' },
])

let stopCounter = stops.value.length + 1

// Add stop
const addingStop = ref(false)
const newStopAddress = ref('')
const newStopName = ref('')

function addStop() {
  if (!newStopAddress.value.trim()) return
  stops.value.push({
    id: stopCounter++,
    name: newStopName.value.trim() || newStopAddress.value.trim(),
    address: newStopAddress.value.trim(),
  })
  cancelAddStop()
}

function cancelAddStop() {
  addingStop.value = false
  newStopAddress.value = ''
  newStopName.value = ''
}

// Edit stop
const editingStopId = ref(null)
const stopEditName = ref('')
const stopEditAddress = ref('')
const stopEditRefs = {}

function startStopEdit(stop) {
  editingStopId.value = stop.id
  stopEditName.value = stop.name
  stopEditAddress.value = stop.address
  nextTick(() => stopEditRefs[stop.id]?.focus())
}

function saveStopEdit(stop) {
  if (stopEditName.value.trim()) stop.name = stopEditName.value.trim()
  if (stopEditAddress.value.trim()) stop.address = stopEditAddress.value.trim()
  editingStopId.value = null
}

function cancelStopEdit() {
  editingStopId.value = null
}

function removeStop(id) {
  stops.value = stops.value.filter(s => s.id !== id)
}

// Assign driver
const assignDriverOpen = ref(false)
const selectedDriverId = ref(null)

const availableDrivers = ref([
  { id: 1, name: 'John Smith', initials: 'JS', vehicle: 'Ford Transit 2022' },
  { id: 2, name: 'Sarah Johnson', initials: 'SJ', vehicle: 'Chevy Express 2021' },
  { id: 3, name: 'Mike Torres', initials: 'MT', vehicle: 'Ram ProMaster 2023' },
])

function openAssignDriver() {
  selectedDriverId.value = availableDrivers.value.find(d => d.name === route.driver)?.id ?? null
  assignDriverOpen.value = true
}

function assignDriver() {
  const driver = availableDrivers.value.find(d => d.id === selectedDriverId.value)
  if (driver) {
    route.driver = driver.name
    route.vehicle = driver.vehicle
    route.activity.unshift({
      id: Date.now(),
      text: `Driver ${driver.name} assigned`,
      time: 'Just now',
    })
  }
  assignDriverOpen.value = false
}

function editRoute() {
  navigateTo(`/routes/${routeId.value}/edit`)
}

function confirmDelete() {
  if (confirm(`Delete ${route.name}? This cannot be undone.`)) {
    navigateTo('/routes')
  }
}

useHead(computed(() => ({
  title: `${route.name} - RouteReady`,
})))
</script>

<style scoped>
.route-detail-page {
  width: 100%;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.route-code {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.btn-back:hover,
.btn-back:focus-visible {
  background: var(--button-primary);
  color: #fff;
  border-color: var(--button-primary);
  outline: 2px solid var(--button-primary);
  outline-offset: 2px;
}

/* Status badge */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-active {
  background: #10b981;
  color: #fff;
}

.status-completed {
  background: #3b82f6;
  color: #fff;
}

.status-planned {
  background: #f59e0b;
  color: #000;
}

/* Layout */
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
  align-items: start;
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Cards */
.detail-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.25rem 0;
}

.card-header .card-title {
  margin: 0;
}

.text-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--button-primary);
  padding: 0;
  font-weight: 600;
}

.text-btn:hover {
  text-decoration: underline;
}

/* Route info */
.route-description {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  margin: 0 0 1.25rem 0;
  line-height: 1.6;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.info-value {
  font-size: 0.9375rem;
  color: var(--text-primary);
  font-weight: 500;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-value--highlight {
  color: #10b981;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Driver */
.driver-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.875rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.driver-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--button-primary);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.driver-avatar--sm {
  width: 2rem;
  height: 2rem;
  font-size: 0.75rem;
}

.driver-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.driver-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.driver-meta {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.vehicle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-top: 1px solid var(--input-border);
}

/* Stops list */
.stop-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.stop-form-actions {
  display: flex;
  gap: 0.5rem;
}

.form-input {
  width: 100%;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.form-input:focus {
  outline: 2px solid var(--button-primary);
  outline-offset: 1px;
  border-color: var(--button-primary);
}

.form-input--inline {
  background: var(--bg-secondary);
  margin-bottom: 0.375rem;
}

.stops-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stop-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  transition: background 0.15s;
}

.stop-row--editing {
  align-items: flex-start;
  padding: 1rem;
}

.stop-index {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--button-primary);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stop-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.stop-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.stop-address {
  font-size: 0.8125rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stop-edit-actions {
  display: flex;
  gap: 0.375rem;
  margin-top: 0.375rem;
}

.stop-actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.stop-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 0.875rem;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stop-btn:hover {
  background: var(--input-border);
  color: var(--text-primary);
}

.stop-btn--remove:hover {
  background: #fef2f2;
  color: #ef4444;
}

/* Activity log */
.activity-log {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.activity-entry {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.activity-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--button-primary);
  flex-shrink: 0;
  margin-top: 0.35rem;
}

.activity-body {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.activity-text {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Empty state */
.empty-state {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
  padding: 0.5rem 0;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-lg);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.25rem 0;
}

.driver-list {
  list-style: none;
  margin: 0 0 1.25rem 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.driver-option {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.15s;
}

.driver-option:hover {
  background: var(--bg-secondary);
}

.driver-option--selected {
  border-color: var(--button-primary);
  background: var(--bg-secondary);
}

.driver-check {
  margin-left: auto;
  color: var(--button-primary);
  font-weight: 700;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 1100px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .detail-sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .detail-sidebar {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
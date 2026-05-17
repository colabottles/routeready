<template>
  <main class="properties-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">Properties</h1>
        <p class="page-subtitle">Manage maintenance locations and schedules</p>
      </div>
      <NuxtLink to="/properties/new" class="btn btn-primary">
        <svg
xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
          stroke-linejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Add Property</span>
      </NuxtLink>
    </header>

    <!-- Property Stats -->
    <section class="stats-section" aria-labelledby="stats-heading">
      <h2 id="stats-heading" class="visually-hidden">Property Statistics</h2>
      <article class="stat-card">
        <div class="stat-icon" aria-hidden="true">
          <svg
xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <strong class="stat-value">{{ stats.total }}</strong>
        <span class="stat-label">Total Properties</span>
      </article>
      <article class="stat-card">
        <div class="stat-icon stat-icon--success" aria-hidden="true">
          <svg
xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <strong class="stat-value">{{ stats.active }}</strong>
        <span class="stat-label">Active</span>
      </article>
      <article class="stat-card">
        <div class="stat-icon stat-icon--accent" aria-hidden="true">
          <svg
xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
            stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <strong class="stat-value">{{ stats.scheduled }}</strong>
        <span class="stat-label">Scheduled Today</span>
      </article>
      <article class="stat-card">
        <div class="stat-icon stat-icon--warning" aria-hidden="true">
          <svg
xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
            stroke-linejoin="round">
            <path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <strong class="stat-value">{{ stats.overdue }}</strong>
        <span class="stat-label">Overdue</span>
      </article>
    </section>

    <!-- Filters and Search -->
    <section class="filters-section" aria-label="Property filters">
      <div class="filters-container">
        <div class="filters-group">
          <label for="search-properties" class="visually-hidden">Search properties</label>
          <input
            id="search-properties"
            v-model="searchTerm"
            type="search"
            placeholder="Search properties..."
            class="form-input search-input"
            @input="filterProperties">

          <label for="type-filter" class="visually-hidden">Filter by property type</label>
          <select
            id="type-filter"
            v-model="typeFilter"
            class="form-select filter-select"
            @change="filterProperties">
            <option value="">All Types</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
            <option value="Industrial">Industrial</option>
          </select>

          <label for="status-filter" class="visually-hidden">Filter by status</label>
          <select
            id="status-filter"
            v-model="statusFilter"
            class="form-select filter-select"
            @change="filterProperties">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <label for="priority-filter" class="visually-hidden">Filter by priority</label>
          <select
            id="priority-filter"
            v-model="priorityFilter"
            class="form-select filter-select"
            @change="filterProperties">
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="normal">Normal</option>
            <option value="low">Low Priority</option>
          </select>

          <button type="button" class="btn btn-secondary export-btn" @click="exportProperties">
            <svg
xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Properties List -->
    <section class="properties-section" aria-labelledby="properties-heading">
      <h2 id="properties-heading" class="visually-hidden">Properties List</h2>
      <div class="properties-list">
        <article
          v-for="property in filteredProperties"
          :key="property.id"
          class="property-card">
          <div class="property-content">
            <div class="property-main">
              <div class="property-header">
                <div class="property-icon" aria-hidden="true">
                  <svg
xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div class="property-title-section">
                  <h3 class="property-name">{{ property.name }}</h3>
                  <p class="property-address">{{ property.address }}</p>
                </div>
              </div>

              <dl class="property-details">
                <div class="detail-item">
                  <dt>Type</dt>
                  <dd>{{ formatType(property.type) }}</dd>
                </div>
                <div class="detail-item">
                  <dt>Size</dt>
                  <dd>{{ property.size }}</dd>
                </div>
                <div class="detail-item">
                  <dt>Frequency</dt>
                  <dd>{{ property.frequency }}</dd>
                </div>
                <div class="detail-item">
                  <dt>Last Service</dt>
                  <dd>{{ property.last_service_date || 'N/A' }}</dd>
                </div>
              </dl>

              <div class="property-meta">
                <span :class="getStatusClass(property.status)">
                  {{ formatStatus(property.status) }}
                </span>
                <span v-if="property.next_service_date" class="next-service">
                  Next: {{ property.next_service_date }}
                </span>
                <span :class="getPriorityClass(property.priority)" @click="editPriority(property)">
                  {{ formatPriority(property.priority) }}
                </span>
              </div>
            </div>

            <nav class="property-actions" aria-label="Property actions">
              <NuxtLink
                :to="`/properties/${property.id}`"
                class="btn btn-secondary btn-small">
                View
              </NuxtLink>
              <NuxtLink
                :to="`/properties/edit-${property.id}`"
                class="btn btn-secondary btn-small">
                Edit
              </NuxtLink>
              <button
                type="button"
                class="btn btn-primary btn-small"
                @click="openScheduleModal(property)">
                Schedule
              </button>
              <button
                type="button"
                class="btn btn-danger btn-small"
                @click="confirmDelete(property)">
                Delete
              </button>
            </nav>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProperties.length === 0" class="empty-state">
        <svg
xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
          stroke-linejoin="round" aria-hidden="true" focusable="false" class="empty-icon">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <h3 class="empty-title">No Properties Found</h3>
        <p class="empty-text">
          {{ searchTerm || typeFilter || statusFilter || priorityFilter
            ? 'Try adjusting your filters'
            : 'Get started by adding your first property' }}
        </p>
        <NuxtLink to="/properties/new" class="btn btn-primary">
          Add First Property
        </NuxtLink>
      </div>
    </section>

    <!-- Schedule Modal -->
    <dialog v-if="showScheduleModal" class="modal" @click.self="showScheduleModal = false">
      <div class="modal-content">
        <header class="modal-header">
          <h2>Schedule Service</h2>
          <button
type="button" class="close-btn" aria-label="Close modal"
            @click="showScheduleModal = false">
            ×
          </button>
        </header>
        <form @submit.prevent="saveSchedule">
          <div class="property-info">
            <div class="property-icon-small" aria-hidden="true">
              <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <p class="property-name-small">{{ scheduleForm.propertyName }}</p>
              <p class="property-address-small">{{ scheduleForm.propertyAddress }}</p>
            </div>
          </div>

          <div class="form-group">
            <label for="schedule-driver">Assign Driver</label>
            <select
id="schedule-driver" v-model="scheduleForm.driverId" class="form-select"
              required>
              <option value="">Select Driver</option>
              <option v-for="driver in availableDrivers" :key="driver.id" :value="driver.id">
                {{ driver.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="schedule-date">Date</label>
            <input
id="schedule-date" v-model="scheduleForm.date" type="date" class="form-input"
              required>
          </div>

          <div class="form-group">
            <label for="schedule-time">Start Time</label>
            <input
id="schedule-time" v-model="scheduleForm.startTime" type="time"
              class="form-input" required>
          </div>

          <div class="form-group">
            <label for="schedule-vehicle">Vehicle</label>
            <select
id="schedule-vehicle" v-model="scheduleForm.vehicle" class="form-select"
              required>
              <option value="">Select Vehicle</option>
              <option v-for="vehicle in availableVehicles" :key="vehicle.id" :value="vehicle.name">
                {{ vehicle.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="schedule-notes">Notes (Optional)</label>
            <textarea
id="schedule-notes" v-model="scheduleForm.notes" class="form-input" rows="3"
              placeholder="Special instructions or notes..." />
          </div>

          <p v-if="scheduleSuccess" class="success-message">Schedule created successfully!</p>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="showScheduleModal = false">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Create Schedule
            </button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Delete Confirmation Modal -->
    <dialog v-if="showDeleteModal" class="modal" @click.self="showDeleteModal = false">
      <div class="modal-content modal-small">
        <header class="modal-header">
          <h2>Delete Property</h2>
          <button
type="button" class="close-btn" aria-label="Close modal"
            @click="showDeleteModal = false">
            ×
          </button>
        </header>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>{{ propertyToDelete?.name }}</strong>?</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
            Cancel
          </button>
          <button type="button" class="btn btn-danger" @click="deleteProperty">
            Delete Property
          </button>
        </div>
      </div>
    </dialog>

    <!-- Priority Edit Modal -->
    <dialog v-if="showPriorityModal" class="modal" @click.self="showPriorityModal = false">
      <div class="modal-content modal-small">
        <header class="modal-header">
          <h2>Change Priority</h2>
          <button
type="button" class="close-btn" aria-label="Close modal"
            @click="showPriorityModal = false">
            ×
          </button>
        </header>
        <form @submit.prevent="savePriority">
          <div class="modal-body">
            <div class="property-info-small">
              <div class="property-icon-tiny" aria-hidden="true">
                <svg
xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <p class="property-name-tiny">{{ propertyForPriority?.name }}</p>
            </div>

            <div class="form-group">
              <label for="priority-select">Select Priority Level</label>
              <select
id="priority-select" v-model="priorityForm.priority" class="form-select"
                required>
                <option value="low">Low Priority</option>
                <option value="normal">Normal</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div class="priority-info">
              <h4>Priority Levels:</h4>
              <ul>
                <li><strong>High:</strong> Urgent attention required</li>
                <li><strong>Normal:</strong> Standard maintenance schedule</li>
                <li><strong>Low:</strong> Can be deferred if needed</li>
              </ul>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="showPriorityModal = false">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Update Priority
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'

definePageMeta({
  layout: 'dashboard',
})

const searchTerm = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')
const showScheduleModal = ref(false)
const showDeleteModal = ref(false)
const showPriorityModal = ref(false)
const scheduleSuccess = ref(false)
const propertyToDelete = ref(null)
const propertyForPriority = ref(null)

// Fetch properties from database
const [propertiesRes, driversRes, vehiclesRes] = await Promise.all([
  useFetch('/api/properties'),
  useFetch('/api/drivers'),
  useFetch('/api/vehicles')
])

const properties = reactive(propertiesRes.data.value?.data || [])
const availableDrivers = reactive(driversRes.data.value?.data || [])
const availableVehicles = reactive(vehiclesRes.data.value?.data || [])

const stats = computed(() => ({
  total: properties.length,
  active: properties.filter(p => p.status === 'active').length,
  scheduled: properties.filter(p => p.status === 'scheduled').length,
  overdue: properties.filter(p => p.status === 'overdue').length
}))

const filteredProperties = ref([...properties])
const priorityForm = reactive({
  id: null,
  priority: ''
})

const scheduleForm = reactive({
  propertyId: null,
  propertyName: '',
  propertyAddress: '',
  propertyIcon: '',
  driverId: '',
  date: '',
  startTime: '',
  vehicle: '',
  notes: ''
})

function filterProperties() {
  filteredProperties.value = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesType = !typeFilter.value || property.type === typeFilter.value
    const matchesStatus = !statusFilter.value || property.status === statusFilter.value
    const matchesPriority = !priorityFilter.value || property.priority === priorityFilter.value

    return matchesSearch && matchesType && matchesStatus && matchesPriority
  })
}

function formatType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function getStatusClass(status) {
  switch (status) {
    case 'active':
      return 'status status-active'
    case 'maintenance':
      return 'status status-warning'
    case 'inactive':
      return 'status status-inactive'
    default:
      return 'status status-inactive'
  }
}

function formatPriority(priority) {
  switch (priority) {
    case 'high':
      return 'High Priority'
    case 'low':
      return 'Low Priority'
    case 'normal':
    default:
      return 'Normal'
  }
}

function getPriorityClass(priority) {
  switch (priority) {
    case 'high':
      return 'priority-badge priority-high'
    case 'low':
      return 'priority-badge priority-low'
    case 'normal':
    default:
      return 'priority-badge priority-normal'
  }
}

function editPriority(property) {
  propertyForPriority.value = property
  priorityForm.id = property.id
  priorityForm.priority = property.priority
  showPriorityModal.value = true
}

async function savePriority() {
  const id = priorityForm.id
  await $fetch(`/api/properties/${id}`, {
    method: 'PUT',
    body: { ...properties.find(p => p.id === id), priority: priorityForm.priority }
  })
  const index = properties.findIndex(p => p.id === id)
  if (index !== -1) properties[index].priority = priorityForm.priority
  filterProperties()
  showPriorityModal.value = false
  propertyForPriority.value = null
}

function openScheduleModal(property) {
  scheduleForm.propertyId = property.id
  scheduleForm.propertyName = property.name
  scheduleForm.propertyAddress = property.address
  scheduleForm.propertyIcon = property.icon
  scheduleForm.driverId = ''
  scheduleForm.date = ''
  scheduleForm.startTime = ''
  scheduleForm.vehicle = ''
  scheduleForm.notes = ''
  scheduleSuccess.value = false
  showScheduleModal.value = true
}

function saveSchedule() {
  console.log('Creating schedule:', scheduleForm)
  scheduleSuccess.value = true

  setTimeout(() => {
    showScheduleModal.value = false
    scheduleSuccess.value = false
  }, 1500)
}

function confirmDelete(property) {
  propertyToDelete.value = property
  showDeleteModal.value = true
}

async function deleteProperty() {
  const id = propertyToDelete.value.id
  await $fetch(`/api/properties/${id}`, { method: 'DELETE' })
  const index = properties.findIndex(p => p.id === id)
  if (index !== -1) properties.splice(index, 1)
  filterProperties()
  showDeleteModal.value = false
  propertyToDelete.value = null
}

function exportProperties() {
  const csvContent = [
    ['Name', 'Address', 'Type', 'Size', 'Frequency', 'Status', 'Last Service', 'Next Service'],
    ...filteredProperties.value.map(p => [
      p.name,
      p.address,
      p.type,
      p.size,
      p.frequency,
      p.status,
      p.last_service_date || 'N/A',
      p.next_service_date || 'N/A'
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'properties.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

useHead({
  title: 'Properties - RouteReady',
  meta: [
    { name: 'description', content: 'Manage maintenance properties and schedules' }
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

.properties-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1.5rem;
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

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.75rem 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.625rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  color: var(--button-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 50%;
}

.stat-icon--success {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.stat-icon--accent {
  color: #818cf8;
  background: rgba(129, 140, 248, 0.1);
}

.stat-icon--warning {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--button-primary);
  margin: 0 0 0.5rem 0;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Filters Section */
.filters-section {
  margin-bottom: 2rem;
}

.filters-container {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: var(--shadow);
}

.filters-group {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
}

.filter-select {
  width: 180px;
}

.export-btn {
  margin-left: auto;
}

/* Properties Section */
.properties-section {
  margin-bottom: 2rem;
}

.properties-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.property-card {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
  transition: all 0.2s;
  border: 2px solid transparent;
}

.property-card:hover {
  border-color: var(--button-primary);
  transform: translateY(-2px);
}

.property-content {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.property-main {
  flex: 1;
}

.property-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.property-icon {
  width: 48px;
  height: 48px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.property-title-section {
  flex: 1;
}

.property-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.property-address {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.property-details {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin: 0 0 1.25rem 0;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item dt {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
  margin: 0;
}

.detail-item dd {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.property-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.next-service {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.priority-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.priority-high {
  background: #fee2e2;
  color: #991b1b;
  border-color: #ef4444;
}

.priority-high:hover {
  background: #fecaca;
}

.priority-normal {
  background: #e0e7ff;
  color: #3730a3;
  border-color: #818cf8;
}

.priority-normal:hover {
  background: #c7d2fe;
}

.priority-low {
  background: #f3f4f6;
  color: #4b5563;
  border-color: #9ca3af;
}

.priority-low:hover {
  background: #e5e7eb;
}

.property-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-width: 90px;
}

/* Empty State */
.empty-state {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 4rem 2rem;
  box-shadow: var(--shadow);
  text-align: center;
}

.empty-icon {
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.empty-text {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 1.5rem 0;
}

/* Modal Styles */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  border: none;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 0;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
}

.modal-content.modal-small {
  max-width: 450px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--input-border);
}

.modal-header h2 {
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

.modal-content form {
  padding: 1.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.form-group .form-input,
.form-group .form-select,
.form-group textarea {
  width: 100%;
}

.property-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.property-icon-small {
  width: 40px;
  height: 40px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.property-name-small {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.property-address-small {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.success-message {
  background: #d1fae5;
  border: 2px solid #10b981;
  color: #065f46;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 1rem 0 0 0;
}

.warning-text {
  color: #991b1b;
  font-size: 0.875rem;
  margin: 0.5rem 0 0 0;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.property-info-small {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.property-icon-tiny {
  width: 32px;
  height: 32px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.property-name-tiny {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.priority-info {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.priority-info h4 {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
}

.priority-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.priority-info li {
  font-size: 0.875rem;
  color: var(--text-secondary);
  display: flex;
  gap: 0.5rem;
}

.priority-info li strong {
  color: var(--text-primary);
  min-width: 60px;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-active {
  background: #10b981;
  color: #ffffff;
}

.status-pending {
  background: #f59e0b;
  color: #000000;
}

.status-inactive {
  background: #6b7280;
  color: #ffffff;
}

.status-warning {
  background: #f59e0b;
  color: #000000;
}

/* Responsive */
@media (max-width: 1200px) {
  .property-details {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 968px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .property-content {
    flex-direction: column;
  }

  .property-actions {
    flex-direction: row;
    width: 100%;
  }

  .btn-small {
    flex: 1;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .filters-group {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .filter-select,
  .export-btn {
    width: 100%;
    max-width: none;
    min-width: 0;
    margin-left: 0;
  }

  .property-details {
    grid-template-columns: 1fr;
  }

  .property-actions {
    flex-wrap: wrap;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
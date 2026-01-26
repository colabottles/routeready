<template>
  <main class="properties-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">Properties</h1>
        <p class="page-subtitle">Manage maintenance locations and schedules</p>
      </div>
      <NuxtLink to="/properties/new" class="btn btn-primary">
        <span aria-hidden="true">➕</span>
        Add Property
      </NuxtLink>
    </header>

    <!-- Property Stats -->
    <section class="stats-section" aria-labelledby="stats-heading">
      <h2 id="stats-heading" class="visually-hidden">Property Statistics</h2>
      <div class="stats-grid">
        <article class="stat-card">
          <p class="stat-value">{{ stats.total }}</p>
          <p class="stat-label">Total Properties</p>
        </article>
        <article class="stat-card">
          <p class="stat-value stat-success">{{ stats.active }}</p>
          <p class="stat-label">Active</p>
        </article>
        <article class="stat-card">
          <p class="stat-value stat-accent">{{ stats.scheduled }}</p>
          <p class="stat-label">Scheduled Today</p>
        </article>
        <article class="stat-card">
          <p class="stat-value stat-warning">{{ stats.overdue }}</p>
          <p class="stat-label">Overdue</p>
        </article>
      </div>
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
            <span aria-hidden="true">📁</span>
            Export
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
                <div class="property-icon" aria-hidden="true">{{ property.icon }}</div>
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
                  <dd>{{ property.lastService }}</dd>
                </div>
              </dl>

              <div class="property-meta">
                <span :class="getStatusClass(property.status)">
                  {{ formatStatus(property.status) }}
                </span>
                <span v-if="property.nextService" class="next-service">
                  Next: {{ property.nextService }}
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
        <div class="empty-icon" aria-hidden="true">🏢</div>
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
            <div class="property-icon-small" aria-hidden="true">{{ scheduleForm.propertyIcon }}
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
              <div class="property-icon-tiny" aria-hidden="true">{{ propertyForPriority?.icon }}
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

const stats = reactive({
  total: 145,
  active: 138,
  scheduled: 12,
  overdue: 3
})

// Fetch properties from database
const { data: propertiesData } = await useFetch('/api/properties')
const properties = reactive(propertiesData.value?.data || [])

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

const availableDrivers = reactive([
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sarah Johnson' },
  { id: 3, name: 'Mike Davis' },
  { id: 4, name: 'Lisa Chen' },
  { id: 5, name: 'Robert Wilson' }
])

const availableVehicles = reactive([
  { id: 1, name: 'Truck #1 (TRK-2024)' },
  { id: 2, name: 'Truck #2 (TRK-2025)' },
  { id: 3, name: 'Van #3 (VAN-3305)' },
  { id: 4, name: 'Truck #5 (TRK-5019)' }
])

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

function savePriority() {
  const index = properties.findIndex(p => p.id === priorityForm.id)
  if (index !== -1) {
    properties[index].priority = priorityForm.priority
    filterProperties()
  }
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

function deleteProperty() {
  const index = properties.findIndex(p => p.id === propertyToDelete.value.id)
  if (index !== -1) {
    properties.splice(index, 1)
    filterProperties()
    stats.total--
    if (propertyToDelete.value.status === 'active') {
      stats.active--
    }
  }
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
      p.lastService,
      p.nextService || 'N/A'
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
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  text-align: center;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--button-primary);
  margin: 0 0 0.5rem 0;
}

.stat-value.stat-success {
  color: #10b981;
}

.stat-value.stat-accent {
  color: #818cf8;
}

.stat-value.stat-warning {
  color: #f59e0b;
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
  font-size: 4rem;
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
  background: #10b981 !important;
  color: #ffffff !important;
}

.status-pending {
  background: #f59e0b !important;
  color: #000000 !important;
}

.status-inactive {
  background: #6b7280 !important;
  color: #ffffff !important;
}

.status-warning {
  background: #f59e0b !important;
  color: #000000 !important;
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
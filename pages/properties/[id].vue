<template>
  <main class="view-property-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">{{ property.name }}</h1>
        <p class="page-subtitle">Property Details & Service History</p>
      </div>
      <nav class="header-actions" aria-label="Property actions">
        <NuxtLink to="/properties" class="btn btn-secondary">
          <span aria-hidden="true">←</span>
          Back
        </NuxtLink>
        <button type="button" class="btn btn-secondary" @click="editProperty">
          <span aria-hidden="true">✏️</span>
          Edit
        </button>
        <button type="button" class="btn btn-primary" @click="scheduleService">
          <span aria-hidden="true">📅</span>
          Schedule Service
        </button>
      </nav>
    </header>

    <div class="content-grid">
      <!-- Main Content -->
      <div class="main-content">
        <!-- Property Overview -->
        <section class="card" aria-labelledby="overview-heading">
          <header class="card-header">
            <h2 id="overview-heading" class="card-title">Property Overview</h2>
            <div class="header-badges">
              <span :class="getStatusClass(property.status)">
                {{ formatStatus(property.status) }}
              </span>
              <span :class="getPriorityClass(property.priority)">
                {{ formatPriority(property.priority) }}
              </span>
            </div>
          </header>
          <div class="card-content">
            <div class="property-header-section">
              <div class="property-icon-large" aria-hidden="true">{{ property.icon }}</div>
              <div class="property-main-info">
                <dl class="info-grid">
                  <div class="info-item">
                    <dt>Address</dt>
                    <dd>{{ property.address }}</dd>
                  </div>
                  <div class="info-item">
                    <dt>Type</dt>
                    <dd>{{ formatType(property.type) }}</dd>
                  </div>
                  <div class="info-item">
                    <dt>Size</dt>
                    <dd>{{ property.size }}</dd>
                  </div>
                  <div class="info-item">
                    <dt>Service Frequency</dt>
                    <dd>{{ property.frequency }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <!-- Service Schedule -->
        <section class="card" aria-labelledby="schedule-heading">
          <header class="card-header">
            <h2 id="schedule-heading" class="card-title">Service Schedule</h2>
          </header>
          <div class="card-content">
            <dl class="schedule-info">
              <div class="schedule-item">
                <dt>Last Service</dt>
                <dd class="schedule-value">{{ property.lastService }}</dd>
              </div>
              <div class="schedule-item">
                <dt>Next Service</dt>
                <dd class="schedule-value highlight">{{ property.nextService || 'Not scheduled' }}
                </dd>
              </div>
              <div class="schedule-item">
                <dt>Preferred Time</dt>
                <dd class="schedule-value">{{ property.preferredTime || 'Any time' }}</dd>
              </div>
            </dl>
          </div>
        </section>

        <!-- Contact Information -->
        <section class="card" aria-labelledby="contact-heading">
          <header class="card-header">
            <h2 id="contact-heading" class="card-title">Contact Information</h2>
          </header>
          <div class="card-content">
            <dl class="contact-info">
              <div class="contact-item">
                <dt>
                  <span class="contact-icon" aria-hidden="true">👤</span>
                  Contact Name
                </dt>
                <dd>{{ property.contactName || 'Not provided' }}</dd>
              </div>
              <div class="contact-item">
                <dt>
                  <span class="contact-icon" aria-hidden="true">📞</span>
                  Phone
                </dt>
                <dd>
                  <a
v-if="property.contactPhone" :href="`tel:${property.contactPhone}`"
                    class="contact-link">
                    {{ property.contactPhone }}
                  </a>
                  <span v-else>Not provided</span>
                </dd>
              </div>
              <div class="contact-item">
                <dt>
                  <span class="contact-icon" aria-hidden="true">✉️</span>
                  Email
                </dt>
                <dd>
                  <a
v-if="property.contactEmail" :href="`mailto:${property.contactEmail}`"
                    class="contact-link">
                    {{ property.contactEmail }}
                  </a>
                  <span v-else>Not provided</span>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <!-- Additional Details -->
        <section class="card" aria-labelledby="details-heading">
          <header class="card-header">
            <h2 id="details-heading" class="card-title">Additional Details</h2>
          </header>
          <div class="card-content">
            <div v-if="property.accessInstructions" class="detail-section">
              <h3 class="detail-title">
                <span aria-hidden="true">🔑</span>
                Access Instructions
              </h3>
              <p class="detail-text">{{ property.accessInstructions }}</p>
            </div>
            <div v-if="property.specialRequirements" class="detail-section">
              <h3 class="detail-title">
                <span aria-hidden="true">⚠️</span>
                Special Requirements
              </h3>
              <p class="detail-text">{{ property.specialRequirements }}</p>
            </div>
            <div
v-if="!property.accessInstructions && !property.specialRequirements"
              class="empty-details">
              <p>No additional details provided</p>
            </div>
          </div>
        </section>

        <!-- Service History -->
        <section class="card" aria-labelledby="history-heading">
          <header class="card-header">
            <h2 id="history-heading" class="card-title">Service History</h2>
            <button type="button" class="btn btn-secondary btn-small" @click="exportHistory">
              Export History
            </button>
          </header>
          <div class="card-content">
            <div class="history-timeline">
              <article
                v-for="entry in serviceHistory"
                :key="entry.id"
                class="history-entry">
                <div class="entry-marker" :class="`marker-${entry.status}`" aria-hidden="true"/>
                <div class="entry-content">
                  <div class="entry-header">
                    <h3 class="entry-title">{{ entry.type }}</h3>
                    <time :datetime="entry.date" class="entry-date">{{ formatDate(entry.date)
                      }}</time>
                  </div>
                  <dl class="entry-details">
                    <div class="entry-detail">
                      <dt>Driver</dt>
                      <dd>{{ entry.driver }}</dd>
                    </div>
                    <div class="entry-detail">
                      <dt>Duration</dt>
                      <dd>{{ entry.duration }}</dd>
                    </div>
                    <div class="entry-detail">
                      <dt>Status</dt>
                      <dd>
                        <span :class="`status-badge status-${entry.status}`">
                          {{ formatStatus(entry.status) }}
                        </span>
                      </dd>
                    </div>
                  </dl>
                  <p v-if="entry.notes" class="entry-notes">{{ entry.notes }}</p>
                </div>
              </article>
            </div>
            <div v-if="serviceHistory.length === 0" class="empty-history">
              <span class="empty-icon" aria-hidden="true">📋</span>
              <p>No service history available yet</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <aside class="info-sidebar" aria-labelledby="sidebar-heading">
        <h2 id="sidebar-heading" class="sidebar-title">Quick Actions & Info</h2>

        <!-- Quick Actions -->
        <article class="info-card" aria-labelledby="actions-heading">
          <h3 id="actions-heading" class="info-card-title">
            <span class="info-icon" aria-hidden="true">⚡</span>
            Quick Actions
          </h3>
          <nav class="quick-actions" aria-label="Quick actions">
            <button type="button" class="action-btn" @click="scheduleService">
              <span class="action-icon" aria-hidden="true">📅</span>
              <span class="action-text">Schedule Service</span>
            </button>
            <button type="button" class="action-btn" @click="editProperty">
              <span class="action-icon" aria-hidden="true">✏️</span>
              <span class="action-text">Edit Property</span>
            </button>
            <button type="button" class="action-btn" @click="viewOnMap">
              <span class="action-icon" aria-hidden="true">🗺️</span>
              <span class="action-text">View on Map</span>
            </button>
            <button type="button" class="action-btn action-danger" @click="deleteProperty">
              <span class="action-icon" aria-hidden="true">🗑️</span>
              <span class="action-text">Delete Property</span>
            </button>
          </nav>
        </article>

        <!-- Statistics -->
        <article class="info-card" aria-labelledby="stats-heading">
          <h3 id="stats-heading" class="info-card-title">
            <span class="info-icon" aria-hidden="true">📊</span>
            Statistics
          </h3>
          <dl class="info-stats">
            <div class="stat-row">
              <dt>Total Services</dt>
              <dd>{{ stats.totalServices }}</dd>
            </div>
            <div class="stat-row">
              <dt>Completed</dt>
              <dd class="stat-success">{{ stats.completed }}</dd>
            </div>
            <div class="stat-row">
              <dt>Avg Duration</dt>
              <dd>{{ stats.avgDuration }}</dd>
            </div>
            <div class="stat-row">
              <dt>Last Driver</dt>
              <dd>{{ stats.lastDriver }}</dd>
            </div>
          </dl>
        </article>

        <!-- Property Info -->
        <article class="info-card" aria-labelledby="info-heading">
          <h3 id="info-heading" class="info-card-title">
            <span class="info-icon" aria-hidden="true">ℹ️</span>
            Property Info
          </h3>
          <dl class="info-stats">
            <div class="stat-row">
              <dt>Added</dt>
              <dd>{{ property.createdAt || 'Jan 15, 2025' }}</dd>
            </div>
            <div class="stat-row">
              <dt>Last Updated</dt>
              <dd>{{ property.updatedAt || '2 days ago' }}</dd>
            </div>
            <div class="stat-row">
              <dt>Property ID</dt>
              <dd>#{{ property.id }}</dd>
            </div>
          </dl>
        </article>
      </aside>
    </div>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const router = useRouter()
const propertyId = route.params.id

// In a real app, this would fetch from API
const property = reactive({
  id: propertyId,
  routeId: 2, // replace with actual route ID from Supabase
  name: 'Westfield Shopping Center',
  address: '123 Main St, Downtown',
  type: 'commercial',
  size: '50,000 sq ft',
  frequency: 'Weekly',
  lastService: '3 days ago',
  nextService: 'Today',
  preferredTime: '8:00 AM',
  status: 'active',
  priority: 'normal',
  icon: '🏬',
  contactName: 'John Manager',
  contactPhone: '(555) 123-4567',
  contactEmail: 'john@westfield.com',
  accessInstructions: 'Main entrance is accessible via the north parking lot. Gate code is #1234. Keys are available at the security desk.',
  specialRequirements: 'High-traffic area - service should be performed during off-peak hours (before 8 AM or after 8 PM). Extra attention needed for entrances and food court area.',
  createdAt: 'Jan 15, 2025',
  updatedAt: '2 days ago'
})

const stats = reactive({
  totalServices: 47,
  completed: 45,
  avgDuration: '3.2 hrs',
  lastDriver: 'John Smith'
})

const serviceHistory = reactive([
  {
    id: 1,
    type: 'Weekly Maintenance',
    date: '2025-01-11',
    driver: 'John Smith',
    duration: '3.5 hrs',
    status: 'completed',
    notes: 'All areas serviced. Extra attention given to main entrance as requested.'
  },
  {
    id: 2,
    type: 'Weekly Maintenance',
    date: '2025-01-04',
    driver: 'Sarah Johnson',
    duration: '3.0 hrs',
    status: 'completed',
    notes: 'Standard service completed. Food court required additional cleaning.'
  },
  {
    id: 3,
    type: 'Weekly Maintenance',
    date: '2024-12-28',
    driver: 'Mike Davis',
    duration: '3.2 hrs',
    status: 'completed',
    notes: 'Holiday cleaning completed. All decorations area cleaned.'
  },
  {
    id: 4,
    type: 'Weekly Maintenance',
    date: '2024-12-21',
    driver: 'John Smith',
    duration: '2.8 hrs',
    status: 'completed',
    notes: null
  }
])

function formatType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatPriority(priority) {
  switch (priority) {
    case 'high':
      return 'High Priority'
    case 'low':
      return 'Low Priority'
    default:
      return 'Normal'
  }
}

function getStatusClass(status) {
  return `status status-${status}`
}

function getPriorityClass(priority) {
  return `priority-badge priority-${priority}`
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function editProperty() {
  router.push(`/properties/edit-${propertyId}`)
}

function scheduleService() {
  router.push(`/schedule?property=${propertyId}`)
}

function viewOnMap() {
  if (property.routeId) {
    router.push(`/routes/${property.routeId}/map`)
  }
}

function deleteProperty() {
  if (confirm(`Are you sure you want to delete ${property.name}?`)) {
    // In a real app, this would call an API
    router.push('/properties')
  }
}

function exportHistory() {
  // In a real app, this would generate and download a CSV/PDF
  const csvContent = [
    ['Date', 'Type', 'Driver', 'Duration', 'Status', 'Notes'],
    ...serviceHistory.map(entry => [
      entry.date,
      entry.type,
      entry.driver,
      entry.duration,
      entry.status,
      entry.notes || ''
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${property.name.replace(/\s+/g, '-')}-history.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

useHead({
  title: `${property.name} - RouteReady`,
  meta: [
    { name: 'description', content: `View details for ${property.name}` }
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

.view-property-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
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
  flex-wrap: wrap;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--input-border);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.header-badges {
  display: flex;
  gap: 0.75rem;
}

.card-content {
  padding: 1.5rem;
}

/* Property Overview */
.property-header-section {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.property-icon-large {
  width: 80px;
  height: 80px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  flex-shrink: 0;
}

.property-main-info {
  flex: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item dt {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
  margin: 0;
}

.info-item dd {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* Service Schedule */
.schedule-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 0;
}

.schedule-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}

.schedule-item dt {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
}

.schedule-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.schedule-value.highlight {
  color: var(--button-primary);
}

/* Contact Information */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.contact-item dt {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.contact-icon {
  font-size: 1.25rem;
}

.contact-item dd {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0;
}

.contact-link {
  color: var(--button-primary);
  text-decoration: none;
  font-weight: 600;
}

.contact-link:hover {
  text-decoration: underline;
}

/* Additional Details */
.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
}

.detail-text {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.empty-details {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

/* Service History */
.history-timeline {
  position: relative;
  padding-left: 2rem;
}

.history-timeline::before {
  content: '';
  position: absolute;
  left: 0.625rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--input-border);
}

.history-entry {
  position: relative;
  margin-bottom: 2rem;
}

.history-entry:last-child {
  margin-bottom: 0;
}

.entry-marker {
  position: absolute;
  left: -1.375rem;
  top: 0.25rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid var(--bg-primary);
  background: var(--button-primary);
}

.marker-completed {
  background: #10b981;
}

.marker-pending {
  background: #f59e0b;
}

.marker-cancelled {
  background: #ef4444;
}

.entry-content {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.entry-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.entry-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-style: normal;
}

.entry-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 0 0 1rem 0;
}

.entry-detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.entry-detail dt {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.entry-detail dd {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.entry-notes {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  padding-top: 0.75rem;
  border-top: 1px solid var(--input-border);
}

.empty-history {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Sidebar */
.info-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
}

.info-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: var(--shadow);
}

.info-card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.info-icon {
  font-size: 1.25rem;
}

.info-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.stat-row dt {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
}

.stat-row dd {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.stat-row dd.stat-success {
  color: #10b981;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--input-border);
  border-radius: 8px;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.action-btn:hover {
  background: var(--button-primary);
  color: white;
  border-color: var(--button-primary);
  transform: translateX(4px);
}

.action-btn.action-danger:hover {
  background: #ef4444;
  border-color: #ef4444;
}

.action-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.action-text {
  flex: 1;
}

/* Status & Priority Badges */
.status {
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-inactive {
  background: #f3f4f6;
  color: #4b5563;
}

.status-maintenance {
  background: #fef3c7;
  color: #92400e;
}

.priority-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.priority-high {
  background: #fee2e2;
  color: #991b1b;
}

.priority-normal {
  background: #e0e7ff;
  color: #3730a3;
}

.priority-low {
  background: #f3f4f6;
  color: #4b5563;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .info-sidebar {
    order: -1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .info-sidebar {
    grid-template-columns: 1fr;
  }

  .info-grid,
  .schedule-info,
  .entry-details {
    grid-template-columns: 1fr;
  }

  .property-header-section {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .btn {
    flex: 1;
  }
}
</style>
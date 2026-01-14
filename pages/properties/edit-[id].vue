<template>
  <main class="edit-property-page">
    <header class="page-header">
      <hgroup>
        <h1 class="page-title">Edit Property</h1>
        <p class="page-subtitle">Update property information and maintenance schedule</p>
      </hgroup>
      <nav class="header-actions" aria-label="Page actions">
        <NuxtLink to="/properties" class="btn btn-secondary">
          <span aria-hidden="true">←</span>
          Back to Properties
        </NuxtLink>
        <NuxtLink :to="`/properties/${propertyId}`" class="btn btn-secondary">
          <span aria-hidden="true">👁️</span>
          View Property
        </NuxtLink>
      </nav>
    </header>

    <section class="form-container">
      <form class="property-form" @submit.prevent="saveProperty">
        <!-- Basic Information -->
        <section class="form-section" aria-labelledby="basic-info-heading">
          <h2 id="basic-info-heading" class="section-title">Basic Information</h2>

          <fieldset class="form-row">
            <legend class="visually-hidden">Property name and type</legend>
            <div class="form-group">
              <label for="property-name">Property Name <span class="required">*</span></label>
              <input
                id="property-name"
                v-model="formData.name"
                type="text"
                class="form-input"
                placeholder="e.g., Westfield Shopping Center"
                required>
            </div>

            <div class="form-group">
              <label for="property-type">Property Type <span class="required">*</span></label>
              <select id="property-type" v-model="formData.type" class="form-select" required>
                <option value="">Select Type</option>
                <option value="commercial">Commercial</option>
                <option value="residential">Residential</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
          </fieldset>

          <div class="form-group">
            <label for="property-address">Address <span class="required">*</span></label>
            <input
              id="property-address"
              v-model="formData.address"
              type="text"
              class="form-input"
              placeholder="123 Main St, City, State ZIP"
              required>
          </div>

          <fieldset class="form-row">
            <legend class="visually-hidden">Property size and icon</legend>
            <div class="form-group">
              <label for="property-size">Size <span class="required">*</span></label>
              <input
                id="property-size"
                v-model="formData.size"
                type="text"
                class="form-input"
                placeholder="e.g., 50,000 sq ft or 25 units"
                required>
            </div>

            <div class="form-group">
              <label for="property-icon">Icon</label>
              <select id="property-icon" v-model="formData.icon" class="form-select">
                <option value="🏢">🏢 Office Building</option>
                <option value="🏬">🏬 Shopping Center</option>
                <option value="🏠">🏠 Residential</option>
                <option value="🏭">🏭 Industrial</option>
                <option value="🏥">🏥 Medical Center</option>
                <option value="🏨">🏨 Hotel</option>
                <option value="🏫">🏫 School</option>
                <option value="⛪">⛪ Church</option>
                <option value="🏪">🏪 Store</option>
              </select>
            </div>
          </fieldset>
        </section>

        <!-- Maintenance Schedule -->
        <section class="form-section" aria-labelledby="maintenance-heading">
          <h2 id="maintenance-heading" class="section-title">Maintenance Schedule</h2>

          <fieldset class="form-row">
            <legend class="visually-hidden">Service frequency and priority</legend>
            <div class="form-group">
              <label for="frequency">Service Frequency <span class="required">*</span></label>
              <select id="frequency" v-model="formData.frequency" class="form-select" required>
                <option value="">Select Frequency</option>
                <option value="Daily">Daily</option>
                <option value="Twice weekly">Twice Weekly</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>

            <div class="form-group">
              <label for="priority">Priority Level <span class="required">*</span></label>
              <select id="priority" v-model="formData.priority" class="form-select" required>
                <option value="">Select Priority</option>
                <option value="high">High Priority</option>
                <option value="normal">Normal</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </fieldset>

          <fieldset class="form-row">
            <legend class="visually-hidden">Service start date and preferred time</legend>
            <div class="form-group">
              <label for="start-date">Service Start Date</label>
              <input
                id="start-date"
                v-model="formData.startDate"
                type="date"
                class="form-input">
            </div>

            <div class="form-group">
              <label for="preferred-time">Preferred Time</label>
              <input
                id="preferred-time"
                v-model="formData.preferredTime"
                type="time"
                class="form-input">
            </div>
          </fieldset>
        </section>

        <!-- Contact Information -->
        <section class="form-section" aria-labelledby="contact-heading">
          <h2 id="contact-heading" class="section-title">Contact Information</h2>

          <fieldset class="form-row">
            <legend class="visually-hidden">Contact name and phone</legend>
            <div class="form-group">
              <label for="contact-name">Contact Name</label>
              <input
                id="contact-name"
                v-model="formData.contactName"
                type="text"
                class="form-input"
                placeholder="Property Manager Name">
            </div>

            <div class="form-group">
              <label for="contact-phone">Contact Phone</label>
              <input
                id="contact-phone"
                v-model="formData.contactPhone"
                type="tel"
                class="form-input"
                placeholder="(555) 123-4567">
            </div>
          </fieldset>

          <div class="form-group">
            <label for="contact-email">Contact Email</label>
            <input
              id="contact-email"
              v-model="formData.contactEmail"
              type="email"
              class="form-input"
              placeholder="manager@property.com">
          </div>
        </section>

        <!-- Additional Details -->
        <section class="form-section" aria-labelledby="details-heading">
          <h2 id="details-heading" class="section-title">Additional Details</h2>

          <div class="form-group">
            <label for="access-instructions">Access Instructions</label>
            <textarea
              id="access-instructions"
              v-model="formData.accessInstructions"
              class="form-input"
              rows="3"
              placeholder="Enter gate codes, key locations, or special access requirements..."/>
          </div>

          <div class="form-group">
            <label for="special-requirements">Special Requirements</label>
            <textarea
              id="special-requirements"
              v-model="formData.specialRequirements"
              class="form-input"
              rows="3"
              placeholder="Any special cleaning requirements, hazards, or important notes..."/>
          </div>

          <div class="form-group">
            <label for="status">Status <span class="required">*</span></label>
            <select id="status" v-model="formData.status" class="form-select" required>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </section>

        <!-- Success Message -->
        <div v-if="successMessage" class="success-banner" role="alert">
          <span class="success-icon" aria-hidden="true">✓</span>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-banner" role="alert">
          <span class="error-icon" aria-hidden="true">✕</span>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Form Actions -->
        <nav class="form-actions" aria-label="Form actions">
          <button type="button" class="btn btn-danger btn-large" @click="confirmDelete">
            Delete Property
          </button>
          <div class="action-group">
            <NuxtLink to="/properties" class="btn btn-secondary btn-large">
              Cancel
            </NuxtLink>
            <button type="submit" class="btn btn-primary btn-large" :disabled="isSaving">
              <span v-if="isSaving">Saving...</span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </nav>
      </form>

      <!-- Info Sidebar -->
      <aside class="info-sidebar" aria-labelledby="info-heading">
        <h2 id="info-heading" class="sidebar-title">Property Information</h2>

        <article class="info-card">
          <h3 class="info-card-title">
            <span class="info-icon" aria-hidden="true">📊</span>
            Quick Stats
          </h3>
          <dl class="info-stats">
            <div class="stat-row">
              <dt>Total Services</dt>
              <dd>{{ propertyStats.totalServices }}</dd>
            </div>
            <div class="stat-row">
              <dt>Last Service</dt>
              <dd>{{ propertyStats.lastService }}</dd>
            </div>
            <div class="stat-row">
              <dt>Next Service</dt>
              <dd>{{ propertyStats.nextService }}</dd>
            </div>
          </dl>
        </article>

        <article class="info-card">
          <h3 class="info-card-title">
            <span class="info-icon" aria-hidden="true">📝</span>
            Change History
          </h3>
          <ul class="change-list">
            <li v-for="change in changeHistory" :key="change.id" class="change-item">
              <time :datetime="change.date" class="change-date">{{ formatDate(change.date) }}</time>
              <p class="change-text">{{ change.description }}</p>
            </li>
          </ul>
        </article>

        <article class="info-card warning-card">
          <h3 class="info-card-title">
            <span class="info-icon" aria-hidden="true">⚠️</span>
            Important Notes
          </h3>
          <ul class="note-list">
            <li>Changes will affect future scheduled services</li>
            <li>Contact information updates notify assigned drivers</li>
            <li>Priority changes may require schedule adjustments</li>
          </ul>
        </article>
      </aside>
    </section>

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
          <p>Are you sure you want to delete <strong>{{ formData.name }}</strong>?</p>
          <p class="warning-text">This action cannot be undone. All associated service history and
            schedules will be permanently deleted.</p>
        </div>
        <nav class="modal-actions" aria-label="Confirmation actions">
          <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
            Cancel
          </button>
          <button type="button" class="btn btn-danger" @click="deleteProperty">
            Delete Property
          </button>
        </nav>
      </div>
    </dialog>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const router = useRouter()
const propertyId = route.params.id

const isSaving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showDeleteModal = ref(false)

// In a real app, this would fetch from API based on propertyId
// const { data: propertyData, pending, error } = await useFetch(`/api/properties/${propertyId}`)

const formData = reactive({
  name: 'Westfield Shopping Center',
  type: 'commercial',
  address: '123 Main St, Downtown',
  size: '50,000 sq ft',
  icon: '🏬',
  frequency: 'Weekly',
  priority: 'normal',
  startDate: '2024-01-15',
  preferredTime: '08:00',
  contactName: 'John Manager',
  contactPhone: '(555) 123-4567',
  contactEmail: 'john@westfield.com',
  accessInstructions: 'Main entrance is accessible via the north parking lot. Gate code is #1234. Keys are available at the security desk.',
  specialRequirements: 'High-traffic area - service should be performed during off-peak hours (before 8 AM or after 8 PM). Extra attention needed for entrances and food court area.',
  status: 'active'
})

const propertyStats = reactive({
  totalServices: 47,
  lastService: '3 days ago',
  nextService: 'Tomorrow'
})

const changeHistory = reactive([
  {
    id: 1,
    date: '2025-01-10',
    description: 'Contact phone number updated'
  },
  {
    id: 2,
    date: '2025-01-05',
    description: 'Service frequency changed to Weekly'
  },
  {
    id: 3,
    date: '2024-12-20',
    description: 'Priority level set to Normal'
  }
])

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function saveProperty() {
  try {
    isSaving.value = true
    errorMessage.value = ''

    // Validate required fields
    if (!formData.name || !formData.type || !formData.address || !formData.size || !formData.frequency || !formData.priority) {
      errorMessage.value = 'Please fill in all required fields'
      isSaving.value = false
      return
    }

    // In a real app, this would be an API call
    // await $fetch(`/api/properties/${propertyId}`, { method: 'PUT', body: formData })

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    successMessage.value = 'Property updated successfully!'
    isSaving.value = false

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

  } catch {
    errorMessage.value = 'Failed to update property. Please try again.'
    isSaving.value = false
  }
}

function confirmDelete() {
  showDeleteModal.value = true
}

function deleteProperty() {
  // In a real app, this would call an API
  // await $fetch(`/api/properties/${propertyId}`, { method: 'DELETE' })
  router.push('/properties')
}

useHead({
  title: `Edit ${formData.name} - RouteReady`,
  meta: [
    { name: 'description', content: `Edit property information for ${formData.name}` }
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

.edit-property-page {
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
}

.form-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.property-form {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow);
}

.form-section {
  margin-bottom: 2.5rem;
}

.form-section:last-of-type {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--input-border);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  border: none;
  padding: 0;
}

fieldset.form-row {
  border: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

fieldset.form-row legend {
  padding: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.required {
  color: #ef4444;
}

.form-input,
.form-select {
  width: 100%;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.success-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #d1fae5;
  border: 2px solid #10b981;
  border-radius: 8px;
  color: #065f46;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #fee2e2;
  border: 2px solid #ef4444;
  border-radius: 8px;
  color: #991b1b;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 2px solid var(--input-border);
}

.action-group {
  display: flex;
  gap: 1rem;
}

.btn-large {
  padding: 0.875rem 2rem;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

/* Info Sidebar */
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

.change-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.change-item {
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border-left: 3px solid var(--button-primary);
}

.change-date {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-style: normal;
}

.change-text {
  font-size: 0.875rem;
  color: var(--text-primary);
  margin: 0;
}

.warning-card {
  border: 2px solid #fbbf24;
  background: #fef3c7;
}

.warning-card .info-card-title {
  color: #92400e;
}

.note-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.note-list li {
  font-size: 0.875rem;
  color: #92400e;
  padding-left: 1.25rem;
  position: relative;
  line-height: 1.5;
}

.note-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  font-weight: 700;
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

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.modal-body p:last-child {
  margin-bottom: 0;
}

.warning-text {
  color: #991b1b;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  justify-content: flex-end;
  border-top: 1px solid var(--input-border);
}

/* Responsive */
@media (max-width: 1024px) {
  .form-container {
    grid-template-columns: 1fr;
  }

  .info-sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .property-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .action-group {
    width: 100%;
    flex-direction: column-reverse;
  }

  .btn-large {
    width: 100%;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .btn {
    flex: 1;
  }
}
</style>
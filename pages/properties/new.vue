<template>
  <main class="add-property-page">
    <header class="page-header">
      <hgroup>
        <h1 class="page-title">Add New Property</h1>
        <p class="page-subtitle">Create a new property for maintenance scheduling</p>
      </hgroup>
      <NuxtLink to="/properties" class="btn btn-secondary">
        <span aria-hidden="true">←</span>
        Back to Properties
      </NuxtLink>
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
            <label for="status">Initial Status <span class="required">*</span></label>
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
          <NuxtLink to="/properties" class="btn btn-secondary btn-large">
            Cancel
          </NuxtLink>
          <button type="submit" class="btn btn-primary btn-large" :disabled="isSaving">
            <span v-if="isSaving">Saving...</span>
            <span v-else>Create Property</span>
          </button>
        </nav>
      </form>

      <!-- Info Sidebar -->
      <aside class="info-sidebar" aria-labelledby="tips-heading">
        <h3 id="tips-heading" class="sidebar-title">Tips for Adding Properties</h3>

        <article class="tip-card">
          <div class="tip-icon" aria-hidden="true">📋</div>
          <div class="tip-content">
            <h4>Required Information</h4>
            <p>Make sure to fill in all required fields marked with an asterisk (*)</p>
          </div>
        </article>

        <article class="tip-card">
          <div class="tip-icon" aria-hidden="true">📅</div>
          <div class="tip-content">
            <h4>Service Frequency</h4>
            <p>Choose a frequency that matches the property's maintenance needs</p>
          </div>
        </article>

        <article class="tip-card">
          <div class="tip-icon" aria-hidden="true">⚡</div>
          <div class="tip-content">
            <h4>Priority Levels</h4>
            <ul>
              <li><strong>High:</strong> Urgent or critical facilities</li>
              <li><strong>Normal:</strong> Standard maintenance</li>
              <li><strong>Low:</strong> Can be deferred if needed</li>
            </ul>
          </div>
        </article>

        <article class="tip-card">
          <div class="tip-icon" aria-hidden="true">📞</div>
          <div class="tip-content">
            <h4>Contact Information</h4>
            <p>Add property manager details for easy communication during service</p>
          </div>
        </article>
      </aside>
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const isSaving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const formData = reactive({
  name: '',
  type: '',
  address: '',
  size: '',
  icon: '🏢',
  frequency: '',
  priority: 'normal',
  startDate: '',
  preferredTime: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  accessInstructions: '',
  specialRequirements: '',
  status: 'active'
})

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
    // await $fetch('/api/properties', { method: 'POST', body: formData })

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    successMessage.value = 'Property created successfully!'
    isSaving.value = false

    // Reset form after successful save
    setTimeout(() => {
      Object.keys(formData).forEach(key => {
        if (key === 'icon') formData[key] = '🏢'
        else if (key === 'priority') formData[key] = 'normal'
        else if (key === 'status') formData[key] = 'active'
        else formData[key] = ''
      })
      successMessage.value = ''
    }, 3000)

  } catch {
    errorMessage.value = 'Failed to create property. Please try again.'
    isSaving.value = false
  }
}

useHead({
  title: 'Add Property - RouteReady',
  meta: [
    { name: 'description', content: 'Add a new property to RouteReady' }
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

.add-property-page {
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
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 2px solid var(--input-border);
}

.btn-large {
  padding: 0.875rem 2rem;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  margin: 0;
}

.tip-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: var(--shadow);
  display: flex;
  gap: 1rem;
}

.tip-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.tip-content h4 {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.tip-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.tip-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tip-content li {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.tip-content li strong {
  color: var(--text-primary);
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
    flex-direction: column-reverse;
  }

  .btn-large {
    width: 100%;
  }
}
</style>
<template>
  <main class="new-driver-page">
    <header class="page-header">
      <NuxtLink to="/drivers" class="back-link">
        ← Back to Drivers
      </NuxtLink>
      <h1 class="page-title">Add New Driver</h1>
      <p class="page-subtitle">Create a new driver profile</p>
    </header>

    <article class="form-card">
      <div class="form-card-header">
        <h2 class="form-card-title">Driver Information</h2>
        <p class="form-card-subtitle">Fields marked with <span
class="required-star"
            aria-hidden="true">*</span> are required</p>
      </div>

      <form class="form-body" @submit.prevent="handleSubmit">
        <fieldset class="form-grid">
          <legend class="visually-hidden">Driver Information</legend>

          <div class="form-group">
            <label for="driver-name" class="form-label">
              Full Name
              <span class="required-star" aria-label="required">*</span>
            </label>
            <input
              id="driver-name"
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="e.g. John Smith"
              required
              autocomplete="name">
          </div>

          <div class="form-group">
            <label for="driver-email" class="form-label">
              Email Address
              <span class="required-star" aria-label="required">*</span>
            </label>
            <input
              id="driver-email"
              v-model="formData.email"
              type="email"
              class="form-input"
              placeholder="e.g. john@company.com"
              required
              autocomplete="email">
          </div>

          <div class="form-group">
            <label for="driver-phone" class="form-label">
              Phone Number
              <span class="required-star" aria-label="required">*</span>
            </label>
            <PhoneInput
              id="driver-phone"
              v-model="formData.phone"
              label="Phone Number"
              :required="true"
              autocomplete="tel" />
          </div>

          <div class="form-group">
            <label for="driver-license" class="form-label">
              License Number
              <span class="required-star" aria-label="required">*</span>
            </label>
            <input
              id="driver-license"
              v-model="formData.license"
              type="text"
              class="form-input"
              placeholder="e.g. D1234567"
              required>
          </div>

          <div class="form-group">
            <label for="driver-status" class="form-label">Status</label>
            <select
              id="driver-status"
              v-model="formData.status"
              class="form-select">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div class="form-group">
            <label for="driver-route" class="form-label">Current Route</label>
            <select
              id="driver-route"
              v-model="formData.currentRoute"
              class="form-select">
              <option value="">None</option>
              <option value="Downtown Route">Downtown Route</option>
              <option value="Commercial District">Commercial District</option>
              <option value="Industrial Park">Industrial Park</option>
              <option value="Residential A">Residential A</option>
            </select>
          </div>
        </fieldset>

        <div v-if="error" class="error-message" role="alert">
          <span class="error-icon" aria-hidden="true">⚠</span>
          {{ error }}
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating…' : 'Create Driver' }}
          </button>
          <NuxtLink to="/drivers" class="btn btn-secondary">
            Cancel
          </NuxtLink>
        </div>
      </form>
    </article>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const router = useRouter()

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  license: '',
  status: 'active',
  currentRoute: ''
})

const error = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  error.value = ''
  isSubmitting.value = true

  try {
    const { data } = await $fetch('/api/drivers', {
      method: 'POST',
      body: formData
    })

    if (data) {
      router.push('/drivers')
    }
  } catch (err) {
    error.value = err?.data?.message || err?.message || 'Failed to create driver. Please try again.'
    console.error('Error creating driver:', err)
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Add New Driver - RouteReady',
  meta: [
    { name: 'description', content: 'Add a new driver to your fleet' }
  ]
})
</script>

<style scoped>
.new-driver-page {
  width: 100%;
  max-width: 860px;
}

.page-header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: var(--button-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  margin-bottom: 1.25rem;
  transition: opacity 0.15s;
}

.back-link:hover {
  text-decoration: underline;
  opacity: 0.85;
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

/* Card */
.form-card {
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.form-card-header {
  padding: 1.75rem 2rem;
  border-bottom: 1px solid var(--input-border);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.form-card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.form-card-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.form-body {
  padding: 2rem;
}

/* Fieldset */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.75rem;
  margin: 0 0 2rem 0;
  padding: 0;
  border: none;
}

/* Form groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required-star {
  color: #ef4444;
  font-size: 0.875rem;
  line-height: 1;
}

.form-input,
.form-select {
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--input-border);
  border-radius: 8px;
  font-size: 0.9375rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.2s;
  width: 100%;
}

.form-input::placeholder {
  color: var(--text-muted);
  font-weight: 400;
}

.form-input:hover,
.form-select:hover {
  border-color: var(--text-muted);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

/* Error */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: var(--error-bg);
  border: 1.5px solid var(--error-border);
  color: var(--error-text);
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.75rem;
  font-size: 0.9375rem;
  font-weight: 500;
}

.error-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

/* Actions */
.form-actions {
  display: flex;
  gap: 0.875rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--input-border);
}

/* Accessibility */
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

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-card-header {
    flex-direction: column;
    gap: 0.25rem;
  }

  .form-body {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
<template>
  <main class="edit-driver-page">

    <!-- Loading State -->
    <section v-if="pending" class="loading-state" aria-live="polite">
      <svg
xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" aria-hidden="true" class="loading-spinner">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <p>Loading driver...</p>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-state">
      <svg
xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" aria-hidden="true" class="error-icon">
        <path
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <h2 class="error-title">Failed to load driver</h2>
      <p class="error-message">{{ error.message }}</p>
      <NuxtLink to="/drivers" class="btn btn-primary">Back to Drivers</NuxtLink>
    </section>

    <!-- Edit Form -->
    <template v-else-if="formData.name !== undefined">
      <header class="page-header">
        <NuxtLink :to="`/drivers/${driverId}`" class="back-link">
          <svg
xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Driver
        </NuxtLink>
        <div class="header-main">
          <div>
            <h1 class="page-title">Edit Driver</h1>
            <p class="page-subtitle">{{ formData.name }}</p>
          </div>
          <div class="header-actions">
            <NuxtLink :to="`/drivers/${driverId}`" class="btn btn-secondary">
              Cancel
            </NuxtLink>
            <button
type="button" class="btn btn-primary" :disabled="isSubmitting"
              @click="handleSubmit">
              <svg
xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>{{ isSubmitting ? 'Saving...' : 'Save Changes' }}</span>
            </button>
          </div>
        </div>
      </header>

      <article class="card">
        <header class="card-header">
          <h2 class="card-title">Driver Information</h2>
        </header>
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <fieldset class="form-grid">
              <legend class="visually-hidden">Driver Information</legend>

              <div class="form-group">
                <label for="edit-name">
                  Full Name
                  <span class="required-star" aria-label="required">*</span>
                </label>
                <input
                  id="edit-name"
                  v-model="formData.name"
                  type="text"
                  class="form-input"
                  required
                  autocomplete="name">
              </div>

              <div class="form-group">
                <label for="edit-email">
                  Email Address
                  <span class="required-star" aria-label="required">*</span>
                </label>
                <input
                  id="edit-email"
                  v-model="formData.email"
                  type="email"
                  class="form-input"
                  required
                  autocomplete="email">
              </div>

              <div class="form-group">
                <label for="edit-phone">
                  Phone Number
                  <span class="required-star" aria-label="required">*</span>
                </label>
                <PhoneInput
                  id="edit-phone"
                  v-model="formData.phone"
                  label="Phone Number"
                  :required="true"
                  autocomplete="tel" />
              </div>

              <div class="form-group">
                <label for="edit-license">
                  License Number
                  <span class="required-star" aria-label="required">*</span>
                </label>
                <input
                  id="edit-license"
                  v-model="formData.license"
                  type="text"
                  class="form-input"
                  required>
              </div>

              <div class="form-group">
                <label for="edit-status">Status</label>
                <select id="edit-status" v-model="formData.status" class="form-select">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-route">On Route</option>
                </select>
              </div>

              <div class="form-group">
                <label for="edit-rating">Performance Rating (0–5)</label>
                <input
                  id="edit-rating"
                  v-model.number="formData.rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  class="form-input">
              </div>
            </fieldset>

            <p v-if="submitError" class="error-message" role="alert">{{ submitError }}</p>
            <p v-if="success" class="success-message" role="status">{{ success }}</p>

            <div class="form-actions">
              <button
                type="button"
                class="btn btn-danger"
                :aria-label="`Delete ${formData.name} permanently`"
                @click="handleDelete">
                Delete Driver
              </button>
            </div>
          </form>
        </div>
      </article>
    </template>
  </main>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const router = useRouter()
const driverId = route.params.id

const { data: driverData, pending, error } = await useFetch(`/api/drivers/${driverId}`, {
  transform: (response) => response.data
})

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  license: '',
  status: 'active',
  rating: 0
})

const submitError = ref('')
const success = ref('')
const isSubmitting = ref(false)

watch(driverData, (newData) => {
  if (newData) {
    formData.name = newData.name
    formData.email = newData.email
    formData.phone = newData.phone
    formData.license = newData.license
    formData.status = newData.status
    formData.rating = Number(newData.rating)
  }
}, { immediate: true })

async function handleSubmit() {
  submitError.value = ''
  success.value = ''
  isSubmitting.value = true

  try {
    const { data } = await $fetch(`/api/drivers/${driverId}`, {
      method: 'PUT',
      body: formData
    })

    if (data) {
      success.value = 'Driver updated successfully!'
      setTimeout(() => router.push(`/drivers/${driverId}`), 1500)
    }
  } catch (err) {
    submitError.value = err?.data?.message || err?.message || 'Failed to update driver.'
    console.error('Error updating driver:', err)
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete() {
  if (!confirm(`Are you sure you want to delete ${formData.name}? This cannot be undone.`)) return

  try {
    await $fetch(`/api/drivers/${driverId}`, { method: 'DELETE' })
    router.push('/drivers')
  } catch (err) {
    submitError.value = err?.data?.message || err?.message || 'Failed to delete driver.'
    console.error('Error deleting driver:', err)
  }
}

useHead({
  title: computed(() => formData.name ? `Edit ${formData.name} - RouteReady` : 'Edit Driver - RouteReady')
})
</script>

<style scoped>
.edit-driver-page {
  width: 100%;
  max-width: 900px;
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

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--button-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  margin-bottom: 1.5rem;
}

.back-link:hover {
  text-decoration: underline;
}

.page-header {
  margin-bottom: 2rem;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
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

.card {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--input-border);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.card-body {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 0 0 1.5rem 0;
  padding: 0;
  border: none;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.required-star {
  color: #ef4444;
  margin-left: 0.25rem;
}

.form-input,
.form-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  background: var(--error-bg);
  border: 2px solid var(--error-border);
  color: var(--error-text);
  padding: 1rem;
  border-radius: 8px;
  margin: 0 0 1.5rem 0;
  font-size: 0.9375rem;
  font-weight: 600;
}

.success-message {
  background: var(--success-bg);
  border: 2px solid var(--success-border);
  color: var(--success-text);
  padding: 1rem;
  border-radius: 8px;
  margin: 0 0 1.5rem 0;
  font-size: 0.9375rem;
  font-weight: 600;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid var(--input-border);
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: 2px solid #ef4444;
}

.btn-danger:hover {
  background: #dc2626;
  border-color: #dc2626;
}

/* Loading/Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
  gap: 1rem;
}

.loading-spinner {
  color: var(--button-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.error-icon {
  color: #ef4444;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.error-message {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

@media (max-width: 768px) {
  .header-main {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .header-actions .btn {
    width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
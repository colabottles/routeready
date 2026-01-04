<template>
  <main class="edit-driver-page">
    <!-- Loading State -->
    <section v-if="pending" class="loading-state" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true">⏳</span>
      <p>Loading driver...</p>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-state">
      <span class="error-icon" aria-hidden="true">⚠️</span>
      <h2 class="error-title">Failed to load driver</h2>
      <p class="error-message">{{ error.message }}</p>
      <NuxtLink to="/drivers" class="btn btn-primary">Back to Drivers</NuxtLink>
    </section>

    <!-- Edit Form -->
    <template v-else-if="formData.name">
      <header class="page-header">
        <NuxtLink :to="`/drivers/${driverId}`" class="back-link">
          ← Back to Driver
        </NuxtLink>
        <h1 class="page-title">Edit Driver</h1>
        <p class="page-subtitle">Update driver information</p>
      </header>

      <article class="card">
        <form @submit.prevent="handleSubmit">
          <fieldset class="form-grid">
            <legend class="visually-hidden">Driver Information</legend>

            <label>
              Full Name <span aria-label="required">*</span>
              <input
                v-model="formData.name"
                type="text"
                class="form-input"
                required
                autocomplete="name"
              >
            </label>

            <label>
              Email Address <span aria-label="required">*</span>
              <input
                v-model="formData.email"
                type="email"
                class="form-input"
                required
                autocomplete="email"
              >
            </label>

            <label>
              Phone Number <span aria-label="required">*</span>
              <input
                v-model="formData.phone"
                type="tel"
                class="form-input"
                required
                autocomplete="tel"
              >
            </label>

            <label>
              License Number <span aria-label="required">*</span>
              <input
                v-model="formData.license"
                type="text"
                class="form-input"
                required
              >
            </label>

            <label>
              Status
              <select
                v-model="formData.status"
                class="form-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-route">On Route</option>
              </select>
            </label>

            <label>
              Current Route
              <select
                v-model="formData.current_route"
                class="form-select"
              >
                <option value="">None</option>
                <option value="Downtown Route">Downtown Route</option>
                <option value="Commercial District">Commercial District</option>
                <option value="Industrial Park">Industrial Park</option>
                <option value="Residential A">Residential A</option>
              </select>
            </label>

            <label>
              Performance Rating (0-5)
              <input
                v-model.number="formData.rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                class="form-input"
              >
            </label>
          </fieldset>

          <p v-if="submitError" class="error-message">{{ submitError }}</p>
          <p v-if="success" class="success-message">{{ success }}</p>

          <nav class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
            <NuxtLink :to="`/drivers/${driverId}`" class="btn btn-secondary">
              Cancel
            </NuxtLink>
            <button
              type="button"
              class="btn btn-danger"
              :aria-label="`Delete ${formData.name} permanently`"
              @click="handleDelete"
            >
              Delete Driver
            </button>
          </nav>
        </form>
      </article>
    </template>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const router = useRouter()
const driverId = parseInt(route.params.id)

const { data: driverData, pending, error } = await useFetch(`/api/drivers/${driverId}`, {
  transform: (response) => response.data
})

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  license: '',
  status: 'active',
  current_route: '',
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
    formData.current_route = newData.current_route || ''
    formData.rating = Number(newData.rating)
  }
}, { immediate: true })

const handleSubmit = async () => {
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

      setTimeout(() => {
        router.push(`/drivers/${driverId}`)
      }, 1500)
    }
  } catch (err) {
    submitError.value = err?.data?.message || err?.message || 'Failed to update driver. Please try again.'
    console.error('Error updating driver:', err)
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm(`Are you sure you want to delete ${formData.name}? This action cannot be undone.`)) {
    return
  }

  try {
    await $fetch(`/api/drivers/${driverId}`, {
      method: 'DELETE'
    })

    router.push('/drivers')
  } catch (err) {
    submitError.value = err?.data?.message || err?.message || 'Failed to delete driver. Please try again.'
    console.error('Error deleting driver:', err)
  }
}

useHead({
  title: 'Edit Driver - RouteReady',
  meta: [
    { name: 'description', content: 'Edit driver information' }
  ]
})
</script>

<style scoped>
.edit-driver-page {
  width: 100%;
  max-width: 900px;
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
  margin-bottom: 1rem;
}

.back-link:hover {
  text-decoration: underline;
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 0 0 1.5rem 0;
  padding: 0;
  border: none;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
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
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--input-border);
}

.btn-danger {
  background: #ef4444;
  color: white;
  margin-left: auto;
}

.btn-danger:hover {
  background: #dc2626;
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

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }

  .btn-danger {
    margin-left: 0;
  }
}
</style>
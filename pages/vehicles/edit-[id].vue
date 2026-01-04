<template>
  <main class="edit-vehicle-page">
    <!-- Loading State -->
    <section v-if="pending" class="loading-state" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true">⏳</span>
      <p>Loading vehicle...</p>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-state">
      <span class="error-icon" aria-hidden="true">⚠️</span>
      <h2 class="error-title">Failed to load vehicle</h2>
      <p class="error-message">{{ error.message }}</p>
      <NuxtLink to="/vehicles" class="btn btn-primary">Back to Vehicles</NuxtLink>
    </section>

    <!-- Edit Form -->
    <template v-else-if="formData.name">
      <header class="page-header">
        <NuxtLink :to="`/vehicles/${vehicleId}`" class="back-link">
          ← Back to Vehicle
        </NuxtLink>
        <h1 class="page-title">Edit Vehicle</h1>
        <p class="page-subtitle">Update vehicle information</p>
      </header>

      <article class="card">
        <form @submit.prevent="handleSubmit">
          <fieldset class="form-grid">
            <legend class="visually-hidden">Vehicle Information</legend>

            <label>
              Vehicle Name <span aria-label="required">*</span>
              <input
                v-model="formData.name"
                type="text"
                class="form-input"
                required
              >
            </label>

            <label>
              License Plate <span aria-label="required">*</span>
              <input
                v-model="formData.license_plate"
                type="text"
                class="form-input"
                required
              >
            </label>

            <label>
              Vehicle Type <span aria-label="required">*</span>
              <select
                v-model="formData.type"
                class="form-select"
                required
                @change="updateIcon"
              >
                <option value="">Select type</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Car">Car</option>
              </select>
            </label>

            <label>
              Make <span aria-label="required">*</span>
              <input
                v-model="formData.make"
                type="text"
                class="form-input"
                required
              >
            </label>

            <label>
              Model <span aria-label="required">*</span>
              <input
                v-model="formData.model"
                type="text"
                class="form-input"
                required
              >
            </label>

            <label>
              Year <span aria-label="required">*</span>
              <input
                v-model.number="formData.year"
                type="number"
                class="form-input"
                min="1900"
                max="2030"
                required
              >
            </label>

            <label>
              Current Mileage <span aria-label="required">*</span>
              <input
                v-model.number="formData.mileage"
                type="number"
                class="form-input"
                min="0"
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
                <option value="maintenance">Maintenance</option>
              </select>
            </label>

            <label>
              Assigned Driver
              <select
                v-model="formData.assigned_driver"
                class="form-select"
              >
                <option value="">Unassigned</option>
                <option v-for="driver in drivers" :key="driver.id" :value="driver.name">
                  {{ driver.name }}
                </option>
              </select>
            </label>

            <label>
              Next Service
              <input
                v-model="formData.next_service"
                type="text"
                class="form-input"
                placeholder="e.g., Oil Change - 5000 mi"
              >
            </label>

            <label class="checkbox-label">
              <input
                v-model="formData.service_due"
                type="checkbox"
                class="form-checkbox"
              >
              Service Due
            </label>
          </fieldset>

          <p v-if="submitError" class="error-message">{{ submitError }}</p>
          <p v-if="success" class="success-message">{{ success }}</p>

          <nav class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
            <NuxtLink :to="`/vehicles/${vehicleId}`" class="btn btn-secondary">
              Cancel
            </NuxtLink>
            <button
              type="button"
              class="btn btn-danger"
              :aria-label="`Delete ${formData.name} permanently`"
              @click="handleDelete"
            >
              Delete Vehicle
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
const vehicleId = parseInt(route.params.id)

const { data: vehicleData, pending, error } = await useFetch(`/api/vehicles/${vehicleId}`, {
  transform: (response) => response.data
})

const { data: driversData } = await useFetch('/api/drivers', {
  transform: (response) => response.data || []
})

const drivers = computed(() => driversData.value || [])

const formData = reactive({
  name: '',
  license_plate: '',
  type: '',
  icon: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  mileage: 0,
  status: 'active',
  assigned_driver: '',
  next_service: '',
  service_due: false
})

const submitError = ref('')
const success = ref('')
const isSubmitting = ref(false)

watch(vehicleData, (newData) => {
  if (newData) {
    formData.name = newData.name
    formData.license_plate = newData.license_plate
    formData.type = newData.type
    formData.icon = newData.icon
    formData.make = newData.make
    formData.model = newData.model
    formData.year = newData.year
    formData.mileage = newData.mileage
    formData.status = newData.status
    formData.assigned_driver = newData.assigned_driver || ''
    formData.next_service = newData.next_service || ''
    formData.service_due = newData.service_due || false
  }
}, { immediate: true })

const updateIcon = () => {
  const icons = {
    'Truck': '🚚',
    'Van': '🚐',
    'Car': '🚗'
  }
  formData.icon = icons[formData.type] || '🚗'
}

const handleSubmit = async () => {
  submitError.value = ''
  success.value = ''
  isSubmitting.value = true

  try {
    const { data } = await $fetch(`/api/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: formData
    })

    if (data) {
      success.value = 'Vehicle updated successfully!'

      setTimeout(() => {
        router.push(`/vehicles/${vehicleId}`)
      }, 1500)
    }
  } catch (err) {
    submitError.value = err?.data?.message || err?.message || 'Failed to update vehicle. Please try again.'
    console.error('Error updating vehicle:', err)
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm(`Are you sure you want to delete ${formData.name}? This action cannot be undone.`)) {
    return
  }

  try {
    await $fetch(`/api/vehicles/${vehicleId}`, {
      method: 'DELETE'
    })

    router.push('/vehicles')
  } catch (err) {
    submitError.value = err?.data?.message || err?.message || 'Failed to delete vehicle. Please try again.'
    console.error('Error deleting vehicle:', err)
  }
}

useHead({
  title: 'Edit Vehicle - RouteReady',
  meta: [
    { name: 'description', content: 'Edit vehicle information' }
  ]
})
</script>

<style scoped>
.edit-vehicle-page {
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

.checkbox-label {
  flex-direction: row !important;
  align-items: center;
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

.form-checkbox {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
  cursor: pointer;
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
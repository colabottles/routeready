<template>
  <main class="service-vehicle-page">
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

    <!-- Service Form -->
    <template v-else-if="vehicle">
      <header class="page-header">
        <NuxtLink :to="`/vehicles/${vehicleId}`" class="back-link">
          ← Back to Vehicle
        </NuxtLink>
        <h1 class="page-title">Schedule Service</h1>
        <p class="page-subtitle">{{ vehicle.name }} - {{ vehicle.license_plate }}</p>
      </header>

      <article class="card">
        <form @submit.prevent="handleSubmit">
          <fieldset class="form-grid">
            <legend class="visually-hidden">Service Information</legend>

            <label class="full-width">
              Service Type <span aria-label="required">*</span>
              <select
                v-model="formData.serviceType"
                class="form-select"
                required
              >
                <option value="">Select service type</option>
                <option value="Oil Change">Oil Change</option>
                <option value="Tire Rotation">Tire Rotation</option>
                <option value="Brake Inspection">Brake Inspection</option>
                <option value="General Maintenance">General Maintenance</option>
                <option value="Repair">Repair</option>
                <option value="Annual Inspection">Annual Inspection</option>
              </select>
            </label>

            <label>
              Service Date <span aria-label="required">*</span>
              <input
                v-model="formData.serviceDate"
                type="date"
                class="form-input"
                required
              >
            </label>

            <label>
              Service Time
              <input
                v-model="formData.serviceTime"
                type="time"
                class="form-input"
              >
            </label>

            <label>
              Current Mileage <span aria-label="required">*</span>
              <input
                v-model.number="formData.currentMileage"
                type="number"
                class="form-input"
                min="0"
                required
              >
            </label>

            <label>
              Estimated Cost
              <input
                v-model.number="formData.estimatedCost"
                type="number"
                class="form-input"
                min="0"
                step="0.01"
                placeholder="0.00"
              >
            </label>

            <label class="full-width">
              Service Provider
              <input
                v-model="formData.serviceProvider"
                type="text"
                class="form-input"
                placeholder="e.g., ABC Auto Shop"
              >
            </label>

            <label class="full-width">
              Notes
              <textarea
                v-model="formData.notes"
                class="form-textarea"
                rows="4"
                placeholder="Additional notes or details about the service..."
              />
            </label>

            <label class="checkbox-label full-width">
              <input
                v-model="formData.notifyDriver"
                type="checkbox"
                class="form-checkbox"
              >
              Notify assigned driver
            </label>
          </fieldset>

          <p v-if="submitError" class="error-message">{{ submitError }}</p>
          <p v-if="success" class="success-message">{{ success }}</p>

          <nav class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Scheduling...' : 'Schedule Service' }}
            </button>
            <NuxtLink :to="`/vehicles/${vehicleId}`" class="btn btn-secondary">
              Cancel
            </NuxtLink>
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
const vehicleId = parseInt(route.query.id)

// Redirect if no ID provided
if (!vehicleId) {
  navigateTo('/vehicles')
}

const { data: vehicleData, pending, error } = await useFetch(`/api/vehicles/${vehicleId}`, {
  transform: (response) => response.data
})

const vehicle = computed(() => vehicleData.value)

const formData = reactive({
  serviceType: '',
  serviceDate: '',
  serviceTime: '',
  currentMileage: vehicle.value?.mileage || 0,
  estimatedCost: 0,
  serviceProvider: '',
  notes: '',
  notifyDriver: false
})

watch(vehicle, (newVehicle) => {
  if (newVehicle && !formData.currentMileage) {
    formData.currentMileage = newVehicle.mileage
  }
}, { immediate: true })

const submitError = ref('')
const success = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  submitError.value = ''
  success.value = ''
  isSubmitting.value = true

  try {
    const serviceDescription = `${formData.serviceType} - ${formData.currentMileage.toLocaleString()} mi`

    const { data } = await $fetch(`/api/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: {
        ...vehicle.value,
        next_service: serviceDescription,
        service_due: true,
        mileage: formData.currentMileage
      }
    })

    if (data) {
      success.value = 'Service scheduled successfully!'

      setTimeout(() => {
        router.push(`/vehicles/${vehicleId}`)
      }, 1500)
    }
  } catch (err) {
    submitError.value = err?.data?.message || err?.message || 'Failed to schedule service. Please try again.'
    console.error('Error scheduling service:', err)
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Schedule Service - RouteReady',
  meta: [
    { name: 'description', content: 'Schedule vehicle service' }
  ]
})
</script>

<style scoped>
.service-vehicle-page {
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

.full-width {
  grid-column: 1 / -1;
}

.checkbox-label {
  flex-direction: row !important;
  align-items: center;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.2s;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
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
}
</style>
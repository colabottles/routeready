<template>
  <main class="new-schedule-page">
    <header class="page-header">
      <NuxtLink to="/schedule" class="back-link">
        ← Back to Schedule
      </NuxtLink>
      <h1 class="page-title">Add New Schedule</h1>
      <p class="page-subtitle">Create a new schedule entry</p>
    </header>

    <article class="card">
      <form @submit.prevent="handleSubmit">
        <fieldset class="form-grid">
          <legend class="visually-hidden">Schedule Information</legend>

          <label>
            Driver <span aria-label="required">*</span>
            <select
              v-model="formData.driver_id"
              class="form-select"
              required
            >
              <option value="">Select driver</option>
              <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
                {{ driver.name }}
              </option>
            </select>
          </label>

          <label>
            Date <span aria-label="required">*</span>
            <input
              v-model="formData.date"
              type="date"
              class="form-input"
              required
            >
          </label>

          <label>
            Shift Start <span aria-label="required">*</span>
            <input
              v-model="formData.shift_start"
              type="time"
              class="form-input"
              required
            >
          </label>

          <label>
            Shift End <span aria-label="required">*</span>
            <input
              v-model="formData.shift_end"
              type="time"
              class="form-input"
              required
            >
          </label>

          <label>
            Route Assigned
            <select
              v-model="formData.route_assigned"
              class="form-select"
            >
              <option value="">No route</option>
              <option value="Downtown Route">Downtown Route</option>
              <option value="Commercial District">Commercial District</option>
              <option value="Industrial Park">Industrial Park</option>
              <option value="Residential A">Residential A</option>
              <option value="Residential B">Residential B</option>
            </select>
          </label>

          <label>
            Vehicle Assigned
            <select
              v-model="formData.vehicle_id"
              class="form-select"
            >
              <option value="">No vehicle</option>
              <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
                {{ vehicle.name }} ({{ vehicle.license_plate }})
              </option>
            </select>
          </label>

          <label>
            Status
            <select
              v-model="formData.status"
              class="form-select"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>

          <label class="full-width">
            Notes
            <textarea
              v-model="formData.notes"
              class="form-textarea"
              rows="4"
              placeholder="Additional notes about this schedule..."
            />
          </label>
        </fieldset>

        <p v-if="error" class="error-message">{{ error }}</p>

        <nav class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating...' : 'Create Schedule' }}
          </button>
          <NuxtLink to="/schedule" class="btn btn-secondary">
            Cancel
          </NuxtLink>
        </nav>
      </form>
    </article>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const router = useRouter()

// Fetch drivers
const { data: driversData } = await useFetch('/api/drivers', {
  transform: (response) => response.data || []
})

const drivers = computed(() => driversData.value || [])

// Fetch vehicles
const { data: vehiclesData } = await useFetch('/api/vehicles', {
  transform: (response) => response.data || []
})

const vehicles = computed(() => vehiclesData.value || [])

const formData = reactive({
  driver_id: '',
  date: '',
  shift_start: '08:00',
  shift_end: '17:00',
  route_assigned: '',
  vehicle_id: '',
  status: 'scheduled',
  notes: ''
})

const error = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  error.value = ''
  isSubmitting.value = true

  try {
    const { data } = await $fetch('/api/schedules', {
      method: 'POST',
      body: {
        driver_id: parseInt(formData.driver_id),
        date: formData.date,
        shift_start: formData.shift_start,
        shift_end: formData.shift_end,
        route_assigned: formData.route_assigned || null,
        vehicle_id: formData.vehicle_id ? parseInt(formData.vehicle_id) : null,
        status: formData.status,
        notes: formData.notes || null
      }
    })

    if (data) {
      router.push('/schedule')
    }
  } catch (err) {
    error.value = err?.data?.message || err?.message || 'Failed to create schedule. Please try again.'
    console.error('Error creating schedule:', err)
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Add New Schedule - RouteReady',
  meta: [
    { name: 'description', content: 'Create a new schedule entry' }
  ]
})
</script>

<style scoped>
.new-schedule-page {
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

.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--input-border);
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
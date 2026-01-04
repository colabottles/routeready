<template>
  <main class="new-vehicle-page">
    <header class="page-header">
      <NuxtLink to="/vehicles" class="back-link">
        ← Back to Vehicles
      </NuxtLink>
      <h1 class="page-title">Add New Vehicle</h1>
      <p class="page-subtitle">Add a vehicle to your fleet</p>
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
              v-model="formData.licensePlate"
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
              v-model="formData.assignedDriver"
              class="form-select"
            >
              <option value="">Unassigned</option>
              <option v-for="driver in drivers" :key="driver.id" :value="driver.name">
                {{ driver.name }}
              </option>
            </select>
          </label>
        </fieldset>

        <p v-if="error" class="error-message">{{ error }}</p>

        <nav class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Adding...' : 'Add Vehicle' }}
          </button>
          <NuxtLink to="/vehicles" class="btn btn-secondary">
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

const { data: driversData } = await useFetch('/api/drivers', {
  transform: (response) => response.data || []
})

const drivers = computed(() => driversData.value || [])

const formData = reactive({
  name: '',
  licensePlate: '',
  type: '',
  icon: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  mileage: 0,
  status: 'active',
  assignedDriver: ''
})

const error = ref('')
const isSubmitting = ref(false)

const updateIcon = () => {
  const icons = {
    'Truck': '🚚',
    'Van': '🚐',
    'Car': '🚗'
  }
  formData.icon = icons[formData.type] || '🚗'
}

const handleSubmit = async () => {
  error.value = ''
  isSubmitting.value = true

  try {
    const { data } = await $fetch('/api/vehicles', {
      method: 'POST',
      body: formData
    })

    if (data) {
      router.push('/vehicles')
    }
  } catch (err) {
    error.value = err?.data?.message || err?.message || 'Failed to create vehicle. Please try again.'
    console.error('Error creating vehicle:', err)
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Add New Vehicle - RouteReady',
  meta: [
    { name: 'description', content: 'Add a new vehicle to your fleet' }
  ]
})
</script>

<style scoped>
.new-vehicle-page {
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
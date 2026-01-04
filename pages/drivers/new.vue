<template>
  <main class="new-driver-page">
    <header class="page-header">
      <NuxtLink to="/drivers" class="back-link">
        ← Back to Drivers
      </NuxtLink>
      <h1 class="page-title">Add New Driver</h1>
      <p class="page-subtitle">Create a new driver profile</p>
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
            </select>
          </label>

          <label>
            Current Route
            <select
              v-model="formData.currentRoute"
              class="form-select"
            >
              <option value="">None</option>
              <option value="Downtown Route">Downtown Route</option>
              <option value="Commercial District">Commercial District</option>
              <option value="Industrial Park">Industrial Park</option>
              <option value="Residential A">Residential A</option>
            </select>
          </label>
        </fieldset>

        <p v-if="error" class="error-message">{{ error }}</p>

        <nav class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating...' : 'Create Driver' }}
          </button>
          <NuxtLink to="/drivers" class="btn btn-secondary">
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
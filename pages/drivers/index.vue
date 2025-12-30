<template>
  <div>
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Drivers</h1>
          <p class="page-subtitle">Manage your driver team and assignments</p>
        </div>
        <NuxtLink to="/drivers/new" class="btn btn-primary">
          <span class="mr-2">➕</span>
          Add New Driver
        </NuxtLink>
      </div>
    </div>

    <!-- Driver Stats -->
    <div class="stats-grid">
      <div class="card">
        <div class="card-content stat-content">
          <p class="stat-value stat-success">{{ stats.active }}</p>
          <p class="stat-label">Active Today</p>
        </div>
      </div>
      <div class="card">
        <div class="card-content stat-content">
          <p class="stat-value">{{ stats.total }}</p>
          <p class="stat-label">Total Drivers</p>
        </div>
      </div>
      <div class="card">
        <div class="card-content stat-content">
          <p class="stat-value stat-accent">{{ stats.avgRating }}</p>
          <p class="stat-label">Avg Performance</p>
        </div>
      </div>
    </div>

    <!-- Drivers Table -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Driver List</h2>
        <div class="filters">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search drivers..."
            class="form-input"
            @input="filterDrivers"
          >
          <select
            v-model="statusFilter"
            class="form-select"
            @change="filterDrivers"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-route">On Route</option>
          </select>
        </div>
      </div>
      <div class="card-content">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>License #</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Current Route</th>
                <th>Performance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="driver in filteredDrivers" :key="driver.id">
                <td>
                  <div class="driver-info">
                    <div class="avatar-wrapper">
                      <Avatar
                        :src="driver.avatarUrl"
                        :alt="driver.name"
                        :fallback="driver.name.charAt(0)"
                      />
                    </div>
                    <div class="driver-details">
                      <p class="driver-name">{{ driver.name }}</p>
                      <p class="driver-email">{{ driver.email }}</p>
                    </div>
                  </div>
                </td>
                <td>{{ driver.license }}</td>
                <td>{{ driver.phone }}</td>
                <td>
                  <span :class="getStatusClass(driver.status)">
                    {{ driver.status }}
                  </span>
                </td>
                <td>
                  <span v-if="driver.currentRoute">{{ driver.currentRoute }}</span>
                  <span v-else class="no-route">None</span>
                </td>
                <td>
                  <div class="rating">
                    <span class="star">⭐</span>
                    <span>{{ driver.rating }}/5</span>
                  </div>
                </td>
                <td>
                  <div class="actions">
                    <NuxtLink :to="`/drivers/${driver.id}`" class="btn btn-secondary btn-small">
                      View
                    </NuxtLink>
                    <NuxtLink :to="`/drivers/${driver.id}/edit`" class="btn btn-secondary btn-small">
                      Edit
                    </NuxtLink>
                    <button
                      :class="['btn', 'btn-small', driver.status === 'active' ? 'btn-warning' : 'btn-success']"
                      @click="toggleDriverStatus(driver)"
                    >
                      {{ driver.status === 'active' ? 'Deactivate' : 'Activate' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const searchTerm = ref('')
const statusFilter = ref('')

definePageMeta({
  layout: 'dashboard',
})

const stats = reactive({
  active: 8,
  total: 12,
  avgRating: 4.6
})

const drivers = reactive([
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    license: 'CDL-123456',
    phone: '(555) 123-4567',
    status: 'on-route',
    currentRoute: 'Downtown Route',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    license: 'CDL-234567',
    phone: '(555) 234-5678',
    status: 'active',
    currentRoute: null,
    rating: 4.9
  },
  {
    id: 3,
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    license: 'CDL-345678',
    phone: '(555) 345-6789',
    status: 'on-route',
    currentRoute: 'Industrial Route',
    rating: 4.5
  },
  {
    id: 4,
    name: 'Lisa Chen',
    email: 'lisa.chen@company.com',
    license: 'CDL-456789',
    phone: '(555) 456-7890',
    status: 'active',
    currentRoute: null,
    rating: 4.7
  },
  {
    id: 5,
    name: 'Robert Wilson',
    email: 'robert.w@company.com',
    license: 'CDL-567890',
    phone: '(555) 567-8901',
    status: 'inactive',
    currentRoute: null,
    rating: 4.3
  }
])

const filteredDrivers = ref([...drivers])

function filterDrivers() {
  filteredDrivers.value = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesStatus = !statusFilter.value || driver.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
}

function getStatusClass(status) {
  switch (status) {
    case 'active':
      return 'status status-active'
    case 'on-route':
      return 'status status-pending'
    case 'inactive':
      return 'status status-inactive'
    default:
      return 'status status-inactive'
  }
}

function toggleDriverStatus(driver) {
  if (driver.status === 'active') {
    driver.status = 'inactive'
    stats.active--
  } else if (driver.status === 'inactive') {
    driver.status = 'active'
    stats.active++
  }
}

useHead({
  title: 'Drivers - RouteReady',
  meta: [
    { name: 'description', content: 'Manage drivers and assignments' }
  ]
})
</script>

<style scoped>
.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
}

.mr-2 {
  margin-right: 0.5rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.stat-value.stat-success {
  color: #10b981;
}

.stat-value.stat-accent {
  color: var(--button-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Filters */
.filters {
  display: flex;
  gap: 1rem;
}

.form-input {
  width: 16rem;
}

/* Driver Info */
.driver-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar-wrapper {
  width: 2rem;
  height: 2rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--button-primary);
}

.driver-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.driver-name {
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.driver-email {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.no-route {
  color: var(--text-muted);
}

/* Rating */
.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-primary);
}

.star {
  color: #eab308;
}

/* Actions */
.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}

.btn-warning {
  background: #f59e0b;
  color: black !important; /* TODO Don't rely on !important */
}

.btn-warning:hover {
  background: #d97706;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

/* Responsive */
@media (max-width: 968px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filters {
    flex-direction: column;
    width: 100%;
  }

  .form-input {
    width: 100%;
  }
}

/* Status badges with better contrast */
.status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-active {
  background: #10b981;
  color: #ffffff;
}

.status-pending {
  background: #f59e0b;
  color: #000000 !important; /* TODO Do not rely on !important */
}

.status-inactive {
  background: #6b7280;
  color: #ffffff;
}
</style>


<template>
  <div>
    <div class="page-header">
      <div
        class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Drivers</h1>
          <p class="page-subtitle">Manage
            your driver team and assignments
          </p>
        </div>
        <NuxtLink
          to="/drivers/new"
          class="btn btn-primary">
          <span class="mr-2">➕</span>
          Add New Driver
        </NuxtLink>
      </div>
    </div>

    <!-- Driver Stats -->
    <div class="grid grid-cols-3 mb-8">
      <div class="card">
        <div
          class="card-content text-center">
          <p
            class="text-2xl font-bold text-success-600">
            {{ stats.active }}</p>
          <p class="text-sm text-gray-600">
            Active Today</p>
        </div>
      </div>
      <div class="card">
        <div
          class="card-content text-center">
          <p
            class="text-2xl font-bold text-gray-600">
            {{ stats.total }}</p>
          <p class="text-sm text-gray-600">
            Total Drivers</p>
        </div>
      </div>
      <div class="card">
        <div
          class="card-content text-center">
          <p
            class="text-2xl font-bold text-accent-600">
            {{ stats.avgRating }}</p>
          <p class="text-sm text-gray-600">
            Avg Performance</p>
        </div>
      </div>
    </div>

    <!-- Drivers Table -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Driver List
        </h2>
        <div class="flex gap-4">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search drivers..."
            class="form-input w-64"
            @input="filterDrivers">
          <select
            v-model="statusFilter"
            class="form-select"
            @change="filterDrivers">
            <option value="">All Status
            </option>
            <option value="active">Active
            </option>
            <option value="inactive">Inactive
            </option>
            <option value="on-route">On Route
            </option>
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
              <tr
                v-for="driver in filteredDrivers"
                :key="driver.id">
                <td>
                  <div
                    class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center font-semibold text-primary-700">
                      <Avatar
                        :src="driver.avatarUrl"
                        :alt="driver.name"
                        :fallback="driver.name.charAt(0)"
                      />
                    </div>
                    <div>
                      <p
                        class="font-semibold">
                        {{ driver.name }}</p>
                      <p
                        class="text-sm text-gray-600">
                        {{ driver.email }}
                      </p>
                    </div>
                  </div>
                </td>
                <td>{{ driver.license }}</td>
                <td>{{ driver.phone }}</td>
                <td>
                  <span
                    :class="getStatusClass(driver.status)">
                    {{ driver.status }}
                  </span>
                </td>
                <td>
                  <span
                    v-if="driver.currentRoute">{{
                      driver.currentRoute
                    }}</span>
                  <span
                    v-else
                    class="text-gray-400">None</span>
                </td>
                <td>
                  <div
                    class="flex items-center gap-1">
                    <span
                      class="text-yellow-500">⭐</span>
                    <span>{{ driver.rating
                    }}/5</span>
                  </div>
                </td>
                <td>
                  <div class="flex gap-2">
                    <NuxtLink
                      :to="`/drivers/${driver.id}`"
                      class="btn btn-secondary text-xs">
                      View
                    </NuxtLink>
                    <NuxtLink
                      :to="`/drivers/${driver.id}/edit`"
                      class="btn btn-secondary text-xs">
                      Edit
                    </NuxtLink>
                    <button
                      :class="driver.status === 'active' ? 'btn-warning' : 'btn-success'"
                      class="btn text-xs"
                      @click="toggleDriverStatus(driver)">
                      {{ driver.status ===
                        'active' ? 'Deactivate'
                        : 'Activate' }}
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

// Set page title
useHead({
  title: 'Drivers - RouteReady',
  meta: [
    { name: 'description', content: 'Manage drivers and assignments' }
  ]
})
</script>
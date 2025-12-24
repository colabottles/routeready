<template>
  <NuxtLayout>
  <div>
    <div class="page-header">
      <div
        class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Properties
          </h1>
          <p class="page-subtitle">Manage
            maintenance locations and
            schedules</p>
        </div>
        <NuxtLink
to="/properties/new"
          class="btn btn-primary">
          <span class="mr-2">➕</span>
          Add New Property
        </NuxtLink>
      </div>
    </div>

    <!-- Property Stats -->
    <div class="grid grid-cols-4 mb-8">
      <div class="card">
        <div
          class="card-content text-center">
          <p
            class="text-2xl font-bold text-primary-600">
            {{ stats.total }}</p>
          <p class="text-sm text-gray-600">
            Total Properties</p>
        </div>
      </div>
      <div class="card">
        <div
          class="card-content text-center">
          <p
            class="text-2xl font-bold text-success-600">
            {{ stats.active }}</p>
          <p class="text-sm text-gray-600">
            Active</p>
        </div>
      </div>
      <div class="card">
        <div
          class="card-content text-center">
          <p
            class="text-2xl font-bold text-accent-600">
            {{ stats.scheduled }}</p>
          <p class="text-sm text-gray-600">
            Scheduled Today</p>
        </div>
      </div>
      <div class="card">
        <div
          class="card-content text-center">
          <p
            class="text-2xl font-bold text-warning-600">
            {{ stats.overdue }}</p>
          <p class="text-sm text-gray-600">
            Overdue</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card mb-6">
      <div class="card-content">
        <div
          class="flex gap-4 items-center flex-wrap">
          <input
v-model="searchTerm"
            type="text"
            placeholder="Search properties..."
            class="form-input w-64"
            @input="filterProperties">
          <select
v-model="typeFilter"
            class="form-select"
            @change="filterProperties">
            <option value="">All Types
            </option>
            <option value="commercial">
              Commercial</option>
            <option value="residential">
              Residential</option>
            <option value="industrial">
              Industrial</option>
          </select>
          <select
v-model="statusFilter"
            class="form-select"
            @change="filterProperties">
            <option value="">All Status
            </option>
            <option value="active">Active
            </option>
            <option value="inactive">Inactive
            </option>
            <option value="maintenance">
              Maintenance</option>
          </select>
          <button
class="btn btn-secondary"
            @click="exportProperties">
            <span class="mr-2">📁</span>
            Export
          </button>
        </div>
      </div>
    </div>

    <!-- Properties Grid -->
    <div class="grid grid-cols-1 gap-6">
      <div
        v-for="property in filteredProperties"
        :key="property.id" class="card">
        <div class="card-content">
          <div
            class="flex items-start justify-between">
            <div class="flex-1">
              <div
                class="flex items-center gap-3 mb-3">
                <div
                  class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-xl">
                  {{ property.icon }}
                </div>
                <div>
                  <h3
                    class="font-semibold text-lg">
                    {{ property.name }}</h3>
                  <p
                    class="text-sm text-gray-600">
                    {{ property.address }}
                  </p>
                </div>
              </div>

              <div
                class="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <p
                    class="text-xs text-gray-500">
                    Type</p>
                  <p class="font-semibold">{{
                    property.type }}</p>
                </div>
                <div>
                  <p
                    class="text-xs text-gray-500">
                    Size</p>
                  <p class="font-semibold">{{
                    property.size }}</p>
                </div>
                <div>
                  <p
                    class="text-xs text-gray-500">
                    Frequency</p>
                  <p class="font-semibold">{{
                    property.frequency }}</p>
                </div>
                <div>
                  <p
                    class="text-xs text-gray-500">
                    Last Service</p>
                  <p class="font-semibold">{{
                    property.lastService }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-4">
                <span
                  :class="getStatusClass(property.status)">
                  {{ property.status }}
                </span>
                <span
                  v-if="property.nextService"
                  class="text-sm text-gray-600">
                  Next: {{
                    property.nextService }}
                </span>
                <span
                  v-if="property.priority === 'high'"
                  class="status status-error">
                  High Priority
                </span>
              </div>
            </div>

            <div class="flex gap-2 ml-4">
              <NuxtLink
                :to="`/properties/${property.id}`"
                class="btn btn-secondary text-xs">
                View
              </NuxtLink>
              <NuxtLink
                :to="`/properties/${property.id}/edit`"
                class="btn btn-secondary text-xs">
                Edit
              </NuxtLink>
              <button
                class="btn btn-primary text-xs"
                @click="scheduleService(property)">
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredProperties.length === 0"
      class="card">
      <div
        class="card-content text-center py-12">
        <div class="text-6xl mb-4">🏢</div>
        <h3
          class="text-xl font-semibold mb-2">
          No Properties Found</h3>
        <p class="text-gray-600 mb-4">
          {{ searchTerm || typeFilter ||
            statusFilter ? 'Try adjusting your filters' : 'Get started by adding your first property' }}
        </p>
        <NuxtLink
to="/properties/new"
          class="btn btn-primary">
          Add First Property
        </NuxtLink>
      </div>
    </div>
  </div>
  </NuxtLayout>
</template>

<script setup>
const searchTerm = ref('')
const typeFilter = ref('')
const statusFilter = ref('')

definePageMeta({
  layout: 'dashboard',
})

const stats = reactive({
  total: 145,
  active: 138,
  scheduled: 12,
  overdue: 3
})

const properties = reactive([
  {
    id: 1,
    name: 'Westfield Shopping Center',
    address: '123 Main St, Downtown',
    type: 'commercial',
    size: '50,000 sq ft',
    frequency: 'Weekly',
    lastService: '3 days ago',
    nextService: 'Today',
    status: 'active',
    priority: 'normal',
    icon: '🏬'
  },
  {
    id: 2,
    name: 'Riverside Apartments',
    address: '456 River Rd, Riverside',
    type: 'residential',
    size: '25 units',
    frequency: 'Bi-weekly',
    lastService: '1 week ago',
    nextService: 'Tomorrow',
    status: 'active',
    priority: 'normal',
    icon: '🏠'
  },
  {
    id: 3,
    name: 'Industrial Park Complex',
    address: '789 Industrial Blvd, South Side',
    type: 'industrial',
    size: '100,000 sq ft',
    frequency: 'Monthly',
    lastService: '2 weeks ago',
    nextService: 'Next week',
    status: 'maintenance',
    priority: 'high',
    icon: '🏭'
  },
  {
    id: 4,
    name: 'City Office Building',
    address: '321 Government Ave, Downtown',
    type: 'commercial',
    size: '75,000 sq ft',
    frequency: 'Weekly',
    lastService: '2 days ago',
    nextService: 'Friday',
    status: 'active',
    priority: 'normal',
    icon: '🏢'
  },
  {
    id: 5,
    name: 'Sunset Medical Center',
    address: '654 Health Way, Midtown',
    type: 'commercial',
    size: '120,000 sq ft',
    frequency: 'Twice weekly',
    lastService: '1 day ago',
    nextService: 'Tomorrow',
    status: 'active',
    priority: 'high',
    icon: '🏥'
  }
])

const filteredProperties = ref([...properties])

function filterProperties() {
  filteredProperties.value = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesType = !typeFilter.value || property.type === typeFilter.value
    const matchesStatus = !statusFilter.value || property.status === statusFilter.value

    return matchesSearch && matchesType && matchesStatus
  })
}

function getStatusClass(status) {
  switch (status) {
    case 'active':
      return 'status status-active'
    case 'maintenance':
      return 'status status-warning'
    case 'inactive':
      return 'status status-inactive'
    default:
      return 'status status-inactive'
  }
}

function scheduleService(property) {
  // In a real app, this would open a scheduling modal or navigate to schedule page
  alert(`Scheduling service for ${property.name}`)
}

function exportProperties() {
  // In a real app, this would generate and download a CSV/Excel file
  alert('Export functionality would be implemented here')
}

// Set page title
useHead({
  title: 'Properties - RouteReady',
  meta: [
    { name: 'description', content: 'Manage maintenance properties and schedules' }
  ]
})
</script>
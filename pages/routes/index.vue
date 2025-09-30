<template>
  <NuxtLayout>
  <div>
    <div class="page-header">
      <div
        class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Routes</h1>
          <p class="page-subtitle">Optimize
            and manage maintenance routes</p>
        </div>
        <div class="flex gap-3">
          <button @click="optimizeAllRoutes"
            class="btn btn-secondary">
            <span class="mr-2">⚡</span>
            Optimize Routes
          </button>
          <NuxtLink to="/routes/new"
            class="btn btn-primary">
            <span class="mr-2">➕</span>
            Create Route
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Route Stats -->
    <div class="grid grid-cols-4 mb-8">
      <div class="card">
        <div
          class="card-content text-center">
          <p
            class="text-2xl font-bold text-primary-600">
            {{ stats.total }}</p>
          <p class="text-sm text-gray-600">
            Total Routes</p>
        </div>
      </div>
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
            class="text-2xl font-bold text-accent-600">
            {{ stats.avgDistance }}</p>
          <p class="text-sm text-gray-600">
            Avg Distance</p>
        </div>
      </div>
      <div class="card">
        <div
          class="card-content text-center">
          <p
            class="text-2xl font-bold text-warning-600">
            {{ stats.efficiency }}%</p>
          <p class="text-sm text-gray-600">
            Efficiency</p>
        </div>
      </div>
    </div>

    <!-- Route Map Placeholder -->
    <div class="card mb-6">
      <div class="card-header">
        <h2 class="card-title">Route Overview
        </h2>
        <div class="flex gap-2">
          <button v-for="view in mapViews"
            :key="view"
            @click="currentMapView = view"
            :class="currentMapView === view ? 'btn-primary' : 'btn-secondary'"
            class="btn text-xs">
            {{ view }}
          </button>
        </div>
      </div>
      <div class="card-content">
        <div
          class="bg-gray-100 rounded-lg p-8 text-center min-h-80 flex items-center justify-center">
          <div>
            <div class="text-6xl mb-4">🗺️
            </div>
            <p
              class="text-lg font-semibold mb-2">
              Interactive Route Map</p>
            <p class="text-gray-600">
              Map integration would display
              {{ currentMapView.toLowerCase()
              }} routes with real-time
              tracking
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Routes List -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Route
          Management</h2>
        <div class="flex gap-4">
          <select v-model="filterStatus"
            @change="filterRoutes"
            class="form-select">
            <option value="">All Routes
            </option>
            <option value="active">Active
            </option>
            <option value="completed">
              Completed</option>
            <option value="planned">Planned
            </option>
          </select>
          <select v-model="filterDriver"
            @change="filterRoutes"
            class="form-select">
            <option value="">All Drivers
            </option>
            <option value="john-smith">John
              Smith</option>
            <option value="sarah-johnson">
              Sarah Johnson</option>
            <option value="mike-davis">Mike
              Davis</option>
          </select>
        </div>
      </div>
      <div class="card-content">
        <div class="space-y-4">
          <div
            v-for="route in filteredRoutes"
            :key="route.id"
            class="border border-gray-200 rounded-lg p-4">
            <div
              class="flex items-start justify-between">
              <div class="flex-1">
                <div
                  class="flex items-center gap-3 mb-3">
                  <div
                    class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center font-semibold text-primary-700">
                    R{{ route.id }}
                  </div>
                  <div>
                    <h3
                      class="font-semibold text-lg">
                      {{ route.name }}</h3>
                    <p
                      class="text-sm text-gray-600">
                      {{ route.description }}
                    </p>
                  </div>
                  <span
                    :class="getStatusClass(route.status)">{{
                      route.status }}</span>
                </div>

                <div
                  class="grid grid-cols-5 gap-4 mb-4">
                  <div>
                    <p
                      class="text-xs text-gray-500">
                      Driver</p>
                    <p class="font-semibold">
                      {{ route.driver }}</p>
                  </div>
                  <div>
                    <p
                      class="text-xs text-gray-500">
                      Properties</p>
                    <p class="font-semibold">
                      {{ route.propertyCount
                      }}</p>
                  </div>
                  <div>
                    <p
                      class="text-xs text-gray-500">
                      Distance</p>
                    <p class="font-semibold">
                      {{ route.distance }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-xs text-gray-500">
                      Duration</p>
                    <p class="font-semibold">
                      {{ route.estimatedTime
                      }}</p>
                  </div>
                  <div>
                    <p
                      class="text-xs text-gray-500">
                      Efficiency</p>
                    <p
                      class="font-semibold text-success-600">
                      {{ route.efficiency }}%
                    </p>
                  </div>
                </div>

                <div
                  class="flex items-center gap-4 text-sm text-gray-600">
                  <span>📍 Start: {{
                    route.startLocation
                  }}</span>
                  <span>🏁 End: {{
                    route.endLocation
                  }}</span>
                  <span
                    v-if="route.startTime">⏰
                    {{ route.startTime
                    }}</span>
                </div>
              </div>

              <div class="flex gap-2 ml-4">
                <button
                  @click="viewRoute(route)"
                  class="btn btn-secondary text-xs">
                  View Map
                </button>
                <button
                  @click="optimizeRoute(route)"
                  class="btn btn-accent text-xs"
                  :disabled="route.status === 'active'">
                  Optimize
                </button>
                <NuxtLink
                  :to="`/routes/${route.id}/edit`"
                  class="btn btn-secondary text-xs">
                  Edit
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </NuxtLayout>
</template>

<script setup>
const currentMapView = ref('All Routes')
const filterStatus = ref('')
const filterDriver = ref('')

const mapViews = ['All Routes', 'Today', 'Tomorrow', 'This Week']

const stats = reactive({
  total: 24,
  active: 8,
  avgDistance: '45 mi',
  efficiency: 94
})

const routes = reactive([
  {
    id: 1,
    name: 'Downtown Commercial Route',
    description: 'Shopping centers and office buildings',
    driver: 'John Smith',
    status: 'active',
    propertyCount: 6,
    distance: '32 miles',
    estimatedTime: '4.5 hrs',
    efficiency: 96,
    startLocation: 'Main Office',
    endLocation: 'Downtown Depot',
    startTime: '8:30 AM'
  },
  {
    id: 2,
    name: 'Residential District A',
    description: 'Apartment complexes and condos',
    driver: 'Sarah Johnson',
    status: 'completed',
    propertyCount: 8,
    distance: '28 miles',
    estimatedTime: '3.5 hrs',
    efficiency: 98,
    startLocation: 'Main Office',
    endLocation: 'North Station',
    startTime: '9:00 AM'
  },
  {
    id: 3,
    name: 'Industrial Zone Route',
    description: 'Warehouses and manufacturing facilities',
    driver: 'Mike Davis',
    status: 'active',
    propertyCount: 5,
    distance: '55 miles',
    estimatedTime: '6 hrs',
    efficiency: 92,
    startLocation: 'Main Office',
    endLocation: 'Industrial Park',
    startTime: '8:00 AM'
  },
  {
    id: 4,
    name: 'Medical Center Circuit',
    description: 'Hospitals and medical facilities',
    driver: 'Lisa Chen',
    status: 'planned',
    propertyCount: 4,
    distance: '22 miles',
    estimatedTime: '3 hrs',
    efficiency: 94,
    startLocation: 'Main Office',
    endLocation: 'Medical District',
    startTime: null
  },
  {
    id: 5,
    name: 'Shopping Mall Route',
    description: 'Large retail complexes',
    driver: 'Robert Wilson',
    status: 'planned',
    propertyCount: 3,
    distance: '38 miles',
    estimatedTime: '5 hrs',
    efficiency: 89,
    startLocation: 'Main Office',
    endLocation: 'West Mall',
    startTime: null
  }
])

const filteredRoutes = ref([...routes])

function filterRoutes() {
  filteredRoutes.value = routes.filter(route => {
    const matchesStatus = !filterStatus.value || route.status === filterStatus.value
    const matchesDriver = !filterDriver.value ||
      route.driver.toLowerCase().replace(' ', '-') === filterDriver.value

    return matchesStatus && matchesDriver
  })
}

function getStatusClass(status) {
  switch (status) {
    case 'active':
      return 'status status-pending'
    case 'completed':
      return 'status status-active'
    case 'planned':
      return 'status status-inactive'
    default:
      return 'status status-inactive'
  }
}

function viewRoute(route) {
  // In a real app, this would show the route on the map
  alert(`Viewing route: ${route.name}`)
}

function optimizeRoute(route) {
  if (route.status === 'active') return

  // Simulate route optimization
  const oldEfficiency = route.efficiency
  route.efficiency = Math.min(100, route.efficiency + Math.floor(Math.random() * 5) + 1)

  alert(`Route optimized! Efficiency improved from ${oldEfficiency}% to ${route.efficiency}%`)
}

function optimizeAllRoutes() {
  routes.forEach(route => {
    if (route.status !== 'active') {
      route.efficiency = Math.min(100, route.efficiency + Math.floor(Math.random() * 3) + 1)
    }
  })

  alert('All non-active routes have been optimized!')
}

// Set page title
useHead({
  title: 'Routes - RouteFlow',
  meta: [
    { name: 'description', content: 'Manage and optimize maintenance routes' }
  ]
})
</script>
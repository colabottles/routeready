<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <div class="page-header">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Vehicles</h1>
          <p class="page-subtitle">Manage fleet, fuel, maintenance, and assignments</p>
        </div>
        <div class="flex gap-3">
          <button class="btn btn-secondary" @click="scheduleMaintenance">
            <span class="mr-2">🔧</span>
            Schedule Maintenance
          </button>
          <NuxtLink to="/vehicles/new" class="btn btn-primary">
            <span class="mr-2">➕</span>
            Add Vehicle
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Vehicle Stats -->
    <div class="grid grid-cols-5 mb-8">
      <div class="card">
        <div class="card-content text-center">
          <p class="text-2xl font-bold text-primary-600">{{ stats.total }}</p>
          <p class="text-sm text-gray-600">Total Vehicles</p>
        </div>
      </div>
      <div class="card">
        <div class="card-content text-center">
          <p class="text-2xl font-bold text-success-600">{{ stats.active }}</p>
          <p class="text-sm text-gray-600">On Route</p>
        </div>
      </div>
      <div class="card">
        <div class="card-content text-center">
          <p class="text-2xl font-bold text-warning-600">{{ stats.maintenance }}</p>
          <p class="text-sm text-gray-600">Maintenance Due</p>
        </div>
      </div>
      <div class="card">
        <div class="card-content text-center">
          <p class="text-2xl font-bold text-accent-600">${{ stats.fuelCost }}</p>
          <p class="text-sm text-gray-600">Fuel This Month</p>
        </div>
      </div>
      <div class="card">
        <div class="card-content text-center">
          <p class="text-2xl font-bold text-gray-600">{{ stats.avgMpg }}</p>
          <p class="text-sm text-gray-600">Avg MPG</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card mb-6">
      <div class="card-header">
        <h2 class="card-title">Quick Actions</h2>
      </div>
      <div class="card-content">
        <div class="grid grid-cols-4 gap-4">
          <button class="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors" @click="showFuelLog = true">
            <div class="text-3xl mb-2">⛽</div>
            <p class="font-semibold">Log Fuel</p>
            <p class="text-xs text-gray-600">Record gas purchase</p>
          </button>
          <button class="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors" @click="showMaintenanceLog = true">
            <div class="text-3xl mb-2">🔧</div>
            <p class="font-semibold">Log Maintenance</p>
            <p class="text-xs text-gray-600">Record service work</p>
          </button>
          <button class="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors" @click="showInspection = true">
            <div class="text-3xl mb-2">📋</div>
            <p class="font-semibold">Vehicle Inspection</p>
            <p class="text-xs text-gray-600">Daily check</p>
          </button>
          <button class="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors" @click="generateReport">
            <div class="text-3xl mb-2">📊</div>
            <p class="font-semibold">Fleet Report</p>
            <p class="text-xs text-gray-600">View analytics</p>
          </button>
        </div>
      </div>
    </div>

    <!-- Vehicles List -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Fleet Management</h2>
        <div class="flex gap-4">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search vehicles..."
            class="form-input w-64"
            @input="filterVehicles">
          <select v-model="filterStatus" class="form-select" @change="filterVehicles">
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="on-route">On Route</option>
            <option value="maintenance">Maintenance</option>
            <option value="out-of-service">Out of Service</option>
          </select>
          <select v-model="filterType" class="form-select" @change="filterVehicles">
            <option value="">All Types</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
            <option value="suv">SUV</option>
          </select>
        </div>
      </div>
      <div class="card-content">
        <div class="space-y-4">
          <div
            v-for="vehicle in filteredVehicles"
            :key="vehicle.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-4 mb-3">
                  <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                    {{ vehicle.icon }}
                  </div>
                  <div>
                    <div class="flex items-center gap-3">
                      <h3 class="font-semibold text-lg">{{ vehicle.name }}</h3>
                      <span :class="getStatusClass(vehicle.status)">{{ vehicle.status }}</span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ vehicle.make }} {{ vehicle.model }} {{ vehicle.year }} • {{ vehicle.licensePlate }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-6 gap-4 mb-4">
                  <div>
                    <p class="text-xs text-gray-500">Assigned To</p>
                    <p class="font-semibold">{{ vehicle.assignedDriver || 'Unassigned' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Current Location</p>
                    <p class="font-semibold">{{ vehicle.location }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Mileage</p>
                    <p class="font-semibold">{{ vehicle.mileage.toLocaleString() }} mi</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Fuel Level</p>
                    <div class="flex items-center gap-2">
                      <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          :class="getFuelLevelColor(vehicle.fuelLevel)"
                          :style="{ width: vehicle.fuelLevel + '%' }"
                          class="h-2 rounded-full"></div>
                      </div>
                      <span class="text-xs font-semibold">{{ vehicle.fuelLevel }}%</span>
                    </div>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Next Service</p>
                    <p :class="getMaintenanceClass(vehicle.nextService, vehicle.mileage)" class="font-semibold">
                      {{ vehicle.nextService }} mi
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">MPG (Avg)</p>
                    <p class="font-semibold">{{ vehicle.avgMpg }}</p>
                  </div>
                </div>

                <!-- Recent Activity -->
                <div class="bg-gray-50 rounded-lg p-3">
                  <p class="text-xs font-semibold text-gray-700 mb-2">Recent Activity</p>
                  <div class="flex gap-4 text-xs text-gray-600">
                    <span v-if="vehicle.lastFuel">⛽ Fueled {{ vehicle.lastFuel }}</span>
                    <span v-if="vehicle.lastMaintenance">🔧 Service {{ vehicle.lastMaintenance }}</span>
                    <span v-if="vehicle.lastInspection">📋 Inspected {{ vehicle.lastInspection }}</span>
                  </div>
                </div>

                <!-- Alerts -->
                <div v-if="vehicle.alerts && vehicle.alerts.length > 0" class="mt-3 space-y-2">
                  <div
                    v-for="(alert, idx) in vehicle.alerts"
                    :key="idx"
                    :class="getAlertClass(alert.type)"
                    class="text-xs px-3 py-2 rounded">
                    <span class="font-semibold">{{ alert.type }}:</span> {{ alert.message }}
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-2 ml-4">
                <NuxtLink :to="`/vehicles/${vehicle.id}`" class="btn btn-secondary text-xs">
                  Details
                </NuxtLink>
                <button class="btn btn-accent text-xs" @click="assignDriver(vehicle)">
                  {{ vehicle.assignedDriver ? 'Reassign' : 'Assign' }}
                </button>
                <button class="btn btn-secondary text-xs" @click="logFuel(vehicle)">
                  Add Fuel
                </button>
                <NuxtLink :to="`/vehicles/${vehicle.id}/edit`" class="btn btn-secondary text-xs">
                  Edit
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fuel Log Modal -->
    <div v-if="showFuelLog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showFuelLog = false">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">Log Fuel Purchase</h3>
        <form @submit.prevent="submitFuelLog">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Vehicle</label>
              <select v-model="fuelLogForm.vehicleId" class="form-select w-full" required>
                <option value="">Select vehicle</option>
                <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
                  {{ vehicle.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Gallons</label>
              <input v-model.number="fuelLogForm.gallons" type="number" step="0.01" class="form-input w-full" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Cost per Gallon</label>
              <input v-model.number="fuelLogForm.pricePerGallon" type="number" step="0.01" class="form-input w-full" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Current Mileage</label>
              <input v-model.number="fuelLogForm.mileage" type="number" class="form-input w-full" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Location</label>
              <input v-model="fuelLogForm.location" type="text" class="form-input w-full" placeholder="Gas station name">
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="submit" class="btn btn-primary flex-1">Save</button>
            <button type="button" class="btn btn-secondary flex-1" @click="showFuelLog = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Vehicles - RouteReady',
  meta: [
    { name: 'description', content: 'Manage fleet, fuel, and maintenance' }
  ]
})

const searchTerm = ref('')
const filterStatus = ref('')
const filterType = ref('')
const showFuelLog = ref(false)
const showMaintenanceLog = ref(false)
const showInspection = ref(false)

const stats = reactive({
  total: 15,
  active: 8,
  maintenance: 2,
  fuelCost: '3,847',
  avgMpg: '16.2'
})

const fuelLogForm = reactive({
  vehicleId: '',
  gallons: null,
  pricePerGallon: null,
  mileage: null,
  location: ''
})

const vehicles = reactive([
  {
    id: 1,
    name: 'Truck 1',
    icon: '🚛',
    make: 'Ford',
    model: 'F-250',
    year: 2022,
    type: 'truck',
    licensePlate: 'ABC-1234',
    status: 'on-route',
    assignedDriver: 'John Smith',
    location: 'Downtown District',
    mileage: 45230,
    fuelLevel: 35,
    nextService: 48000,
    avgMpg: '15.2',
    lastFuel: '2 days ago',
    lastMaintenance: '1 week ago',
    lastInspection: 'Today',
    alerts: [
      { type: 'Low Fuel', message: 'Fuel level below 40%' }
    ]
  },
  {
    id: 2,
    name: 'Van 1',
    icon: '🚐',
    make: 'Mercedes',
    model: 'Sprinter',
    year: 2023,
    type: 'van',
    licensePlate: 'XYZ-5678',
    status: 'available',
    assignedDriver: null,
    location: 'Main Office',
    mileage: 32150,
    fuelLevel: 85,
    nextService: 35000,
    avgMpg: '18.5',
    lastFuel: '1 day ago',
    lastMaintenance: '3 weeks ago',
    lastInspection: 'Yesterday',
    alerts: []
  },
  {
    id: 3,
    name: 'Truck 2',
    icon: '🚚',
    make: 'Chevrolet',
    model: 'Silverado 2500',
    year: 2021,
    type: 'truck',
    licensePlate: 'DEF-9012',
    status: 'maintenance',
    assignedDriver: 'Mike Davis',
    location: 'Service Center',
    mileage: 67890,
    fuelLevel: 45,
    nextService: 68000,
    avgMpg: '14.8',
    lastFuel: '4 days ago',
    lastMaintenance: 'Today',
    lastInspection: '2 days ago',
    alerts: [
      { type: 'Maintenance', message: 'Oil change in progress' }
    ]
  },
  {
    id: 4,
    name: 'SUV 1',
    icon: '🚙',
    make: 'Toyota',
    model: 'Tacoma',
    year: 2023,
    type: 'suv',
    licensePlate: 'GHI-3456',
    status: 'on-route',
    assignedDriver: 'Sarah Johnson',
    location: 'Residential Zone',
    mileage: 18450,
    fuelLevel: 92,
    nextService: 20000,
    avgMpg: '19.1',
    lastFuel: 'Yesterday',
    lastMaintenance: '2 months ago',
    lastInspection: 'Today',
    alerts: []
  },
  {
    id: 5,
    name: 'Van 2',
    icon: '🚐',
    make: 'Ram',
    model: 'ProMaster',
    year: 2022,
    type: 'van',
    licensePlate: 'JKL-7890',
    status: 'available',
    assignedDriver: 'Lisa Chen',
    location: 'Main Office',
    mileage: 41200,
    fuelLevel: 55,
    nextService: 45000,
    avgMpg: '16.9',
    lastFuel: '3 days ago',
    lastMaintenance: '1 month ago',
    lastInspection: 'Yesterday',
    alerts: []
  },
  {
    id: 6,
    name: 'Truck 3',
    icon: '🚛',
    make: 'GMC',
    model: 'Sierra 2500',
    year: 2020,
    type: 'truck',
    licensePlate: 'MNO-2345',
    status: 'on-route',
    assignedDriver: 'Robert Wilson',
    location: 'Industrial Park',
    mileage: 89340,
    fuelLevel: 28,
    nextService: 90000,
    avgMpg: '13.7',
    lastFuel: '3 days ago',
    lastMaintenance: '2 weeks ago',
    lastInspection: 'Today',
    alerts: [
      { type: 'Low Fuel', message: 'Fuel level below 30%' },
      { type: 'Service Soon', message: 'Maintenance due in 660 miles' }
    ]
  }
])

const filteredVehicles = ref([...vehicles])

function filterVehicles() {
  filteredVehicles.value = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesStatus = !filterStatus.value || vehicle.status === filterStatus.value
    const matchesType = !filterType.value || vehicle.type === filterType.value

    return matchesSearch && matchesStatus && matchesType
  })
}

function getStatusClass(status) {
  switch (status) {
    case 'available':
      return 'status status-active'
    case 'on-route':
      return 'status status-pending'
    case 'maintenance':
      return 'status status-warning'
    case 'out-of-service':
      return 'status status-inactive'
    default:
      return 'status status-inactive'
  }
}

function getFuelLevelColor(level) {
  if (level <= 25) return 'bg-red-500'
  if (level <= 50) return 'bg-yellow-500'
  return 'bg-green-500'
}

function getMaintenanceClass(nextService, currentMileage) {
  const milesUntilService = nextService - currentMileage
  if (milesUntilService <= 500) return 'text-red-600 font-bold'
  if (milesUntilService <= 2000) return 'text-yellow-600'
  return 'text-gray-900'
}

function getAlertClass(type) {
  switch (type) {
    case 'Low Fuel':
      return 'bg-red-50 text-red-700 border border-red-200'
    case 'Service Soon':
      return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    case 'Maintenance':
      return 'bg-blue-50 text-blue-700 border border-blue-200'
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200'
  }
}

function assignDriver(vehicle) {
  alert(`Assign driver to ${vehicle.name}`)
}

function logFuel(vehicle) {
  fuelLogForm.vehicleId = vehicle.id
  fuelLogForm.mileage = vehicle.mileage
  showFuelLog.value = true
}

function submitFuelLog() {
  const vehicle = vehicles.find(v => v.id === fuelLogForm.vehicleId)
  if (vehicle) {
    const totalCost = (fuelLogForm.gallons * fuelLogForm.pricePerGallon).toFixed(2)
    vehicle.fuelLevel = Math.min(100, vehicle.fuelLevel + (fuelLogForm.gallons * 3)) // rough estimate
    vehicle.lastFuel = 'Just now'
    alert(`Fuel logged: ${fuelLogForm.gallons} gallons for $${totalCost} at ${vehicle.mileage} miles`)
  }

  // Reset form
  Object.keys(fuelLogForm).forEach(key => {
    fuelLogForm[key] = key === 'vehicleId' ? '' : null
  })
  fuelLogForm.location = ''
  showFuelLog.value = false
}

function scheduleMaintenance() {
  alert('Opening maintenance scheduler...')
}

function generateReport() {
  alert('Generating fleet analytics report...')
}
</script>
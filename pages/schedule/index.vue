<template>
  <div>
    <div class="page-header">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Schedule</h1>
          <p class="page-subtitle">Manage driver assignments, routes, and daily tasks</p>
        </div>
        <div class="flex gap-3">
          <button class="btn btn-secondary" @click="showImportModal = true">
            <span class="mr-2">📥</span>
            Import from Properties
          </button>
          <button class="btn btn-secondary" @click="autoSchedule">
            <span class="mr-2">✨</span>
            Auto-Schedule
          </button>
          <button class="btn btn-secondary" @click="showTemplates = true">
            <span class="mr-2">📋</span>
            Templates
          </button>
          <button class="btn btn-primary" @click="publishSchedule">
            <span class="mr-2">📤</span>
            Publish Schedule
          </button>
        </div>
      </div>
    </div>

    <!-- Date Navigation -->
    <div class="card mb-6">
      <div class="card-content">
        <div class="flex items-center justify-between">
          <button class="btn btn-secondary" @click="changeWeek(-1)">
            <span>← Previous Week</span>
          </button>

          <div class="flex gap-2">
            <button
              v-for="day in weekDays"
              :key="day.date"
              :class="selectedDate === day.date ? 'btn-primary' : 'btn-secondary'"
              class="btn"
              @click="selectedDate = day.date">
              <div class="text-center">
                <div class="text-xs">{{ day.dayName }}</div>
                <div class="font-bold">{{ day.dayNumber }}</div>
              </div>
            </button>
          </div>

          <button class="btn btn-secondary" @click="changeWeek(1)">
            <span>Next Week →</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Schedule Stats for Selected Day -->
    <div class="grid grid-cols-4 mb-6">
      <div class="card">
        <div class="card-content text-center">
          <p class="text-2xl font-bold text-primary-600">{{ dayStats.totalDrivers }}</p>
          <p class="text-sm text-gray-600">Drivers Scheduled</p>
        </div>
      </div>
      <div class="card">
        <div class="card-content text-center">
          <p class="text-2xl font-bold text-success-600">{{ dayStats.totalRoutes }}</p>
          <p class="text-sm text-gray-600">Routes Assigned</p>
        </div>
      </div>
      <div class="card">
        <div class="card-content text-center">
          <p class="text-2xl font-bold text-accent-600">{{ dayStats.totalTasks }}</p>
          <p class="text-sm text-gray-600">Tasks Scheduled</p>
        </div>
      </div>
      <div class="card">
        <div class="card-content text-center">
          <p class="text-2xl font-bold text-warning-600">{{ dayStats.unassigned }}</p>
          <p class="text-sm text-gray-600">Unassigned Routes</p>
        </div>
      </div>
    </div>

    <!-- Main Schedule Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Available Resources Sidebar -->
      <div class="col-span-3 space-y-4">
        <!-- Available Drivers -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title text-sm">Available Drivers</h3>
          </div>
          <div class="card-content">
            <div class="space-y-2">
              <div
                v-for="driver in availableDrivers"
                :key="driver.id"
                class="p-3 border border-gray-200 rounded-lg hover:border-primary-400 cursor-pointer bg-white"
                @click="selectDriver(driver)">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center font-semibold text-primary-700 text-sm">
                    {{ driver.name.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <p class="font-semibold text-sm">{{ driver.name }}</p>
                    <p class="text-xs text-gray-600">{{ driver.status }}</p>
                  </div>
                </div>
              </div>
              <div v-if="availableDrivers.length === 0" class="text-center py-4 text-gray-500 text-sm">
                All drivers assigned
              </div>
            </div>
          </div>
        </div>

        <!-- Unassigned Routes -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title text-sm">Unassigned Routes</h3>
          </div>
          <div class="card-content">
            <div class="space-y-2">
              <div
                v-for="route in unassignedRoutes"
                :key="route.id"
                class="p-3 border border-gray-200 rounded-lg hover:border-accent-400 cursor-pointer bg-white"
                @click="selectRoute(route)">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center font-semibold text-accent-700 text-xs">
                    R{{ route.id }}
                  </div>
                  <div class="flex-1">
                    <p class="font-semibold text-sm">{{ route.name }}</p>
                    <p class="text-xs text-gray-600">{{ route.propertyCount }} properties</p>
                  </div>
                </div>
              </div>
              <div v-if="unassignedRoutes.length === 0" class="text-center py-4 text-gray-500 text-sm">
                All routes assigned
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scheduled Assignments -->
      <div class="col-span-9">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Schedule for {{ formatDate(selectedDate) }}</h3>
            <div class="flex gap-2">
              <button class="btn btn-secondary text-xs" @click="copySchedule">
                Copy Day
              </button>
              <button class="btn btn-secondary text-xs" @click="clearSchedule">
                Clear Day
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="space-y-4">
              <div
                v-for="assignment in scheduledAssignments"
                :key="assignment.id"
                class="border-2 border-gray-200 rounded-lg p-4 bg-gradient-to-r from-primary-50 to-white">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center font-semibold text-primary-700">
                      {{ assignment.driver.name.charAt(0) }}
                    </div>
                    <div>
                      <h4 class="font-bold text-lg">{{ assignment.driver.name }}</h4>
                      <p class="text-sm text-gray-600">{{ assignment.vehicle || 'No vehicle assigned' }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="btn btn-secondary text-xs" @click="editAssignment(assignment)">
                      Edit
                    </button>
                    <button class="btn btn-warning text-xs" @click="removeAssignment(assignment)">
                      Remove
                    </button>
                  </div>
                </div>

                <!-- Time and Route Info -->
                <div class="grid grid-cols-4 gap-4 mb-4 bg-white rounded-lg p-3">
                  <div>
                    <p class="text-xs text-gray-500">Start Time</p>
                    <input
                      v-model="assignment.startTime"
                      type="time"
                      class="form-input text-sm mt-1">
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">End Time</p>
                    <input
                      v-model="assignment.endTime"
                      type="time"
                      class="form-input text-sm mt-1">
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Route</p>
                    <select v-model="assignment.routeId" class="form-select text-sm mt-1">
                      <option value="">Select route</option>
                      <option v-for="route in allRoutes" :key="route.id" :value="route.id">
                        {{ route.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Vehicle</p>
                    <select v-model="assignment.vehicle" class="form-select text-sm mt-1">
                      <option value="">Select vehicle</option>
                      <option v-for="vehicle in allVehicles" :key="vehicle.id" :value="vehicle.name">
                        {{ vehicle.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Job Functions/Tasks -->
                <div class="bg-white rounded-lg p-3">
                  <div class="flex items-center justify-between mb-3">
                    <p class="text-sm font-semibold">Job Functions</p>
                    <button class="btn btn-primary text-xs" @click="addTask(assignment)">
                      + Add Task
                    </button>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(task, idx) in assignment.tasks"
                      :key="idx"
                      class="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-200">
                      <input
                        v-model="task.completed"
                        type="checkbox"
                        class="w-4 h-4">
                      <select v-model="task.type" class="form-select text-xs flex-1">
                        <option value="maintenance">Maintenance</option>
                        <option value="inspection">Inspection</option>
                        <option value="repair">Repair</option>
                        <option value="installation">Installation</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="pickup">Pickup</option>
                        <option value="delivery">Delivery</option>
                      </select>
                      <input
                        v-model="task.description"
                        type="text"
                        placeholder="Task description..."
                        class="form-input text-xs flex-1">
                      <input
                        v-model="task.estimatedTime"
                        type="text"
                        placeholder="Est. time"
                        class="form-input text-xs w-20">
                      <button class="text-red-500 hover:text-red-700" @click="removeTask(assignment, idx)">
                        ✕
                      </button>
                    </div>
                    <div v-if="assignment.tasks.length === 0" class="text-center py-3 text-gray-500 text-sm">
                      No tasks assigned. Click "Add Task" to get started.
                    </div>
                  </div>
                </div>

                <!-- Notes -->
                <div class="mt-3">
                  <textarea
                    v-model="assignment.notes"
                    placeholder="Add notes or special instructions..."
                    class="form-input text-sm w-full"
                    rows="2"/>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="scheduledAssignments.length === 0" class="text-center py-12">
                <div class="text-6xl mb-4">📅</div>
                <p class="text-lg font-semibold mb-2">No assignments for this day</p>
                <p class="text-gray-600 mb-4">Click on a driver from the sidebar to create an assignment</p>
                <button class="btn btn-primary" @click="quickAddAssignment">
                  Quick Add Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Assignment Modal -->
    <div v-if="showQuickAdd" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showQuickAdd = false">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h3 class="text-xl font-semibold mb-4">Quick Add Assignment</h3>
        <form @submit.prevent="submitQuickAdd">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Driver</label>
              <select v-model="quickAddForm.driverId" class="form-select w-full" required>
                <option value="">Select driver</option>
                <option v-for="driver in allDrivers" :key="driver.id" :value="driver.id">
                  {{ driver.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Vehicle</label>
              <select v-model="quickAddForm.vehicle" class="form-select w-full">
                <option value="">Select vehicle</option>
                <option v-for="vehicle in allVehicles" :key="vehicle.id" :value="vehicle.name">
                  {{ vehicle.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Route</label>
              <select v-model="quickAddForm.routeId" class="form-select w-full">
                <option value="">Select route</option>
                <option v-for="route in allRoutes" :key="route.id" :value="route.id">
                  {{ route.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Start Time</label>
              <input v-model="quickAddForm.startTime" type="time" class="form-input w-full" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">End Time</label>
              <input v-model="quickAddForm.endTime" type="time" class="form-input w-full" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Primary Task Type</label>
              <select v-model="quickAddForm.taskType" class="form-select w-full">
                <option value="maintenance">Maintenance</option>
                <option value="inspection">Inspection</option>
                <option value="repair">Repair</option>
                <option value="installation">Installation</option>
                <option value="cleaning">Cleaning</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium mb-1">Notes</label>
            <textarea v-model="quickAddForm.notes" class="form-input w-full" rows="3"/>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="submit" class="btn btn-primary flex-1">Create Assignment</button>
            <button type="button" class="btn btn-secondary flex-1" @click="showQuickAdd = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Import from Properties Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showImportModal = false">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-semibold mb-4">Import Scheduled Properties</h3>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium mb-2">Date Range</label>
            <div class="flex gap-2">
              <input v-model="importDateRange.start" type="date" class="form-input flex-1">
              <span class="flex items-center">to</span>
              <input v-model="importDateRange.end" type="date" class="form-input flex-1">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Filter by Route</label>
            <select v-model="importFilter.route" class="form-select w-full">
              <option value="">All Routes</option>
              <option v-for="route in allRoutes" :key="route.id" :value="route.id">
                {{ route.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="mb-4 flex items-center justify-between">
          <p class="text-sm font-semibold">{{ filteredPropertyVisits.length }} property visits scheduled in date range</p>
          <div class="flex gap-2">
            <button class="btn btn-secondary text-xs" @click="selectAllPropertyVisits">
              Select All
            </button>
            <button class="btn btn-secondary text-xs" @click="deselectAllPropertyVisits">
              Deselect All
            </button>
            <button class="btn btn-secondary text-xs" @click="sortPropertyVisits">
              Sort by Address
            </button>
          </div>
        </div>

        <!-- Property Visits List -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
          <div class="space-y-2">
            <div
              v-for="visit in filteredPropertyVisits"
              :key="visit.id"
              :class="visit.selected ? 'bg-primary-50 border-primary-300' : 'bg-white border-gray-200'"
              class="border-2 rounded-lg p-3 cursor-pointer hover:border-primary-300 transition-colors"
              @click="toggleVisitSelection(visit)">
              <div class="flex items-start gap-3">
                <input
                  type="checkbox"
                  :checked="visit.selected"
                  class="mt-1 w-4 h-4"
                  @click.stop="toggleVisitSelection(visit)">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <p class="font-semibold">{{ visit.propertyName }}</p>
                    <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {{ visit.scheduledDate }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-700">{{ visit.address }}</p>
                  <p class="text-sm text-gray-600">{{ visit.city }}, {{ visit.state }} {{ visit.zipCode }}</p>
                  <div class="flex gap-2 mt-2 flex-wrap">
                    <span
                      v-for="service in visit.services"
                      :key="service"
                      class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {{ service }}
                    </span>
                  </div>
                  <p v-if="visit.notes" class="text-xs text-gray-600 mt-2 italic">
                    Notes: {{ visit.notes }}
                  </p>
                </div>
              </div>
            </div>
            <div v-if="filteredPropertyVisits.length === 0" class="text-center py-8 text-gray-500">
              No scheduled property visits found in this date range
            </div>
          </div>
        </div>

        <!-- Import Options -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p class="font-semibold text-blue-900 mb-3">Import Options</p>
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input v-model="importOptions.autoAssignDrivers" type="checkbox" class="w-4 h-4">
              <span class="text-sm">Auto-assign drivers based on availability</span>
            </label>
            <label class="flex items-center gap-2">
              <input v-model="importOptions.autoAssignVehicles" type="checkbox" class="w-4 h-4">
              <span class="text-sm">Auto-assign vehicles to drivers</span>
            </label>
            <label class="flex items-center gap-2">
              <input v-model="importOptions.groupByLocation" type="checkbox" class="w-4 h-4">
              <span class="text-sm">Group properties by geographic location</span>
            </label>
            <label class="flex items-center gap-2">
              <input v-model="importOptions.createTasks" type="checkbox" class="w-4 h-4">
              <span class="text-sm">Create tasks from property service types</span>
            </label>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p class="font-semibold text-green-900 mb-2">Import Summary</p>
          <div class="text-sm text-green-800">
            <p>Selected visits: {{ selectedPropertyVisits.length }}</p>
            <p>Estimated assignments: {{ estimatedAssignments }}</p>
            <p>Date range: {{ importDateRange.start }} to {{ importDateRange.end }}</p>
          </div>
        </div>

        <div class="flex gap-3">
          <button class="btn btn-primary flex-1" :disabled="selectedPropertyVisits.length === 0" @click="confirmImport">
            Import {{ selectedPropertyVisits.length }} Visits
          </button>
          <button class="btn btn-secondary flex-1" @click="showImportModal = false">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Schedule - RouteReady',
  meta: [
    { name: 'description', content: 'Manage driver schedules and route assignments' }
  ]
})

const selectedDate = ref('2024-12-23')
const showQuickAdd = ref(false)
const showTemplates = ref(false)
const showImportModal = ref(false)

const importDateRange = reactive({
  start: '2024-12-23',
  end: '2024-12-31'
})

const importFilter = reactive({
  route: ''
})

const importOptions = reactive({
  autoAssignDrivers: true,
  autoAssignVehicles: true,
  groupByLocation: true,
  createTasks: true
})

// Get current week days
const weekDays = computed(() => {
  const days = []
  const current = new Date(selectedDate.value)
  const startOfWeek = new Date(current)
  startOfWeek.setDate(current.getDate() - current.getDay())

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    days.push({
      date: day.toISOString().split('T')[0],
      dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: day.getDate()
    })
  }
  return days
})

const dayStats = computed(() => {
  const assignments = scheduledAssignments.value
  return {
    totalDrivers: assignments.length,
    totalRoutes: assignments.filter(a => a.routeId).length,
    totalTasks: assignments.reduce((sum, a) => sum + a.tasks.length, 0),
    unassigned: unassignedRoutes.value.length
  }
})

const allDrivers = reactive([
  { id: 1, name: 'John Smith', status: 'Available' },
  { id: 2, name: 'Sarah Johnson', status: 'Available' },
  { id: 3, name: 'Mike Davis', status: 'Available' },
  { id: 4, name: 'Lisa Chen', status: 'Available' },
  { id: 5, name: 'Robert Wilson', status: 'Available' }
])

const allRoutes = reactive([
  { id: 1, name: 'Downtown Commercial Route', propertyCount: 6 },
  { id: 2, name: 'Residential District A', propertyCount: 8 },
  { id: 3, name: 'Industrial Zone Route', propertyCount: 5 },
  { id: 4, name: 'Medical Center Circuit', propertyCount: 4 },
  { id: 5, name: 'Shopping Mall Route', propertyCount: 3 }
])

const allVehicles = reactive([
  { id: 1, name: 'Truck 1' },
  { id: 2, name: 'Van 1' },
  { id: 3, name: 'Truck 2' },
  { id: 4, name: 'SUV 1' },
  { id: 5, name: 'Van 2' }
])

// Simulated property visits data (would come from Properties page in real app)
const propertyVisits = reactive([
  {
    id: 1,
    propertyId: 1,
    propertyName: 'Sunshine Apartments',
    address: '123 Main Street',
    city: 'Phoenix',
    state: 'AZ',
    zipCode: '85001',
    scheduledDate: '2024-12-23',
    services: ['Property Maintenance', 'Pool Service'],
    notes: 'Gate code: 1234. Park in visitor spots.',
    routeId: 1,
    selected: false
  },
  {
    id: 2,
    propertyId: 2,
    propertyName: 'Tech Plaza Office Building',
    address: '456 Business Ave',
    city: 'Phoenix',
    state: 'AZ',
    zipCode: '85002',
    scheduledDate: '2024-12-24',
    services: ['Property Maintenance', 'Fire System Inspection'],
    notes: 'Check in at front desk. Service after 6 PM preferred.',
    routeId: 1,
    selected: false
  },
  {
    id: 3,
    propertyId: 3,
    propertyName: 'Green Valley Shopping Center',
    address: '789 Retail Road',
    city: 'Tempe',
    state: 'AZ',
    zipCode: '85281',
    scheduledDate: '2024-12-26',
    services: ['Generator Maintenance'],
    notes: 'Service on first Saturday of month only.',
    routeId: 2,
    selected: false
  },
  {
    id: 4,
    propertyId: 4,
    propertyName: 'Riverside Condos',
    address: '321 River Drive',
    city: 'Scottsdale',
    state: 'AZ',
    zipCode: '85251',
    scheduledDate: '2024-12-27',
    services: ['Pool Service', 'Landscape Maintenance'],
    notes: 'Multiple buildings. Start with Building A.',
    routeId: 3,
    selected: false
  },
  {
    id: 5,
    propertyId: 5,
    propertyName: 'Industrial Park West',
    address: '555 Factory Lane',
    city: 'Mesa',
    state: 'AZ',
    zipCode: '85201',
    scheduledDate: '2024-12-28',
    services: ['Property Maintenance', 'Loading Dock Repair'],
    notes: 'Wear safety gear. Check in at security gate.',
    routeId: 3,
    selected: false
  },
  {
    id: 6,
    propertyId: 6,
    propertyName: 'Desert View Medical Center',
    address: '888 Healthcare Blvd',
    city: 'Phoenix',
    state: 'AZ',
    zipCode: '85003',
    scheduledDate: '2024-12-23',
    services: ['Property Maintenance', 'Emergency Systems Check'],
    notes: 'Critical facility. Must maintain 24/7 uptime.',
    routeId: 4,
    selected: false
  },
  {
    id: 7,
    propertyId: 1,
    propertyName: 'Sunshine Apartments',
    address: '123 Main Street',
    city: 'Phoenix',
    state: 'AZ',
    zipCode: '85001',
    scheduledDate: '2024-12-30',
    services: ['Property Maintenance', 'Pool Service'],
    notes: 'Gate code: 1234. Park in visitor spots.',
    routeId: 1,
    selected: false
  }
])

const filteredPropertyVisits = computed(() => {
  return propertyVisits.filter(visit => {
    const visitDate = new Date(visit.scheduledDate)
    const startDate = new Date(importDateRange.start)
    const endDate = new Date(importDateRange.end)

    const inDateRange = visitDate >= startDate && visitDate <= endDate
    const matchesRoute = !importFilter.route || visit.routeId === importFilter.route

    return inDateRange && matchesRoute
  })
})

const selectedPropertyVisits = computed(() => {
  return propertyVisits.filter(v => v.selected)
})

const estimatedAssignments = computed(() => {
  if (!importOptions.groupByLocation) {
    return selectedPropertyVisits.value.length
  }
  // Group by date and route for estimation
  const groups = new Set()
  selectedPropertyVisits.value.forEach(visit => {
    groups.add(`${visit.scheduledDate}-${visit.routeId}`)
  })
  return groups.size
})

const scheduledAssignments = ref([
  {
    id: 1,
    date: '2024-12-23',
    driver: { id: 1, name: 'John Smith' },
    vehicle: 'Truck 1',
    routeId: 1,
    startTime: '08:00',
    endTime: '16:00',
    tasks: [
      { type: 'maintenance', description: 'Property maintenance at Building A', estimatedTime: '2 hrs', completed: false },
      { type: 'inspection', description: 'Fire system inspection', estimatedTime: '1 hr', completed: false }
    ],
    notes: 'Priority client - arrive early'
  },
  {
    id: 2,
    date: '2024-12-23',
    driver: { id: 3, name: 'Mike Davis' },
    vehicle: 'Truck 2',
    routeId: 3,
    startTime: '07:30',
    endTime: '15:30',
    tasks: [
      { type: 'repair', description: 'Fix loading dock gate', estimatedTime: '3 hrs', completed: false },
      { type: 'maintenance', description: 'Generator maintenance', estimatedTime: '1.5 hrs', completed: false }
    ],
    notes: ''
  }
])

const availableDrivers = computed(() => {
  const scheduledDriverIds = scheduledAssignments.value
    .filter(a => a.date === selectedDate.value)
    .map(a => a.driver.id)
  return allDrivers.filter(d => !scheduledDriverIds.includes(d.id))
})

const unassignedRoutes = computed(() => {
  const assignedRouteIds = scheduledAssignments.value
    .filter(a => a.date === selectedDate.value && a.routeId)
    .map(a => a.routeId)
  return allRoutes.filter(r => !assignedRouteIds.includes(r.id))
})

const quickAddForm = reactive({
  driverId: '',
  vehicle: '',
  routeId: '',
  startTime: '08:00',
  endTime: '16:00',
  taskType: 'maintenance',
  notes: ''
})

function changeWeek(direction) {
  const current = new Date(selectedDate.value)
  current.setDate(current.getDate() + (direction * 7))
  selectedDate.value = current.toISOString().split('T')[0]
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function selectDriver(driver) {
  quickAddForm.driverId = driver.id
  showQuickAdd.value = true
}

function selectRoute(route) {
  if (scheduledAssignments.value.filter(a => a.date === selectedDate.value).length > 0) {
    const lastAssignment = scheduledAssignments.value
      .filter(a => a.date === selectedDate.value)
      .slice(-1)[0]
    lastAssignment.routeId = route.id
  } else {
    alert('Please add a driver assignment first')
  }
}

function quickAddAssignment() {
  showQuickAdd.value = true
}

function submitQuickAdd() {
  const driver = allDrivers.find(d => d.id === quickAddForm.driverId)
  if (!driver) return

  const newAssignment = {
    id: Date.now(),
    date: selectedDate.value,
    driver: { id: driver.id, name: driver.name },
    vehicle: quickAddForm.vehicle,
    routeId: quickAddForm.routeId,
    startTime: quickAddForm.startTime,
    endTime: quickAddForm.endTime,
    tasks: quickAddForm.taskType ? [{
      type: quickAddForm.taskType,
      description: '',
      estimatedTime: '',
      completed: false
    }] : [],
    notes: quickAddForm.notes
  }

  scheduledAssignments.value.push(newAssignment)

  // Reset form
  quickAddForm.driverId = ''
  quickAddForm.vehicle = ''
  quickAddForm.routeId = ''
  quickAddForm.startTime = '08:00'
  quickAddForm.endTime = '16:00'
  quickAddForm.taskType = 'maintenance'
  quickAddForm.notes = ''

  showQuickAdd.value = false
}

function addTask(assignment) {
  assignment.tasks.push({
    type: 'maintenance',
    description: '',
    estimatedTime: '',
    completed: false
  })
}

function removeTask(assignment, index) {
  assignment.tasks.splice(index, 1)
}

function editAssignment(assignment) {
  alert(`Editing assignment for ${assignment.driver.name}`)
}

function removeAssignment(assignment) {
  const index = scheduledAssignments.value.findIndex(a => a.id === assignment.id)
  if (index > -1) {
    scheduledAssignments.value.splice(index, 1)
  }
}

function autoSchedule() {
  alert('Auto-scheduling based on driver availability, route optimization, and task priorities...')
}

function copySchedule() {
  alert('Copy this day\'s schedule to another date')
}

function clearSchedule() {
  if (confirm('Are you sure you want to clear all assignments for this day?')) {
    scheduledAssignments.value = scheduledAssignments.value.filter(a => a.date !== selectedDate.value)
  }
}

function publishSchedule() {
  alert(`Publishing schedule for ${formatDate(selectedDate.value)}. Drivers will be notified.`)
}

function toggleVisitSelection(visit) {
  visit.selected = !visit.selected
}

function selectAllPropertyVisits() {
  filteredPropertyVisits.value.forEach(visit => {
    visit.selected = true
  })
}

function deselectAllPropertyVisits() {
  propertyVisits.forEach(visit => {
    visit.selected = false
  })
}

function sortPropertyVisits() {
  propertyVisits.sort((a, b) => a.address.localeCompare(b.address))
}

function confirmImport() {
  const selected = selectedPropertyVisits.value

  if (selected.length === 0) {
    alert('Please select at least one property visit to import')
    return
  }

  // Group visits by date if groupByLocation is enabled
  if (importOptions.groupByLocation) {
    const groupedByDate = {}

    selected.forEach(visit => {
      if (!groupedByDate[visit.scheduledDate]) {
        groupedByDate[visit.scheduledDate] = []
      }
      groupedByDate[visit.scheduledDate].push(visit)
    })

    // Create assignments for each date group
    Object.keys(groupedByDate).forEach(date => {
      const visitsForDate = groupedByDate[date]

      // Group by route if multiple properties on same route
      const routeGroups = {}
      visitsForDate.forEach(visit => {
        const routeKey = visit.routeId || 'unassigned'
        if (!routeGroups[routeKey]) {
          routeGroups[routeKey] = []
        }
        routeGroups[routeKey].push(visit)
      })

      // Create one assignment per route group
      Object.keys(routeGroups).forEach((routeKey, index) => {
        const visits = routeGroups[routeKey]

        // Auto-assign driver if option is enabled
        let assignedDriver = null
        if (importOptions.autoAssignDrivers) {
          const availableOnDate = allDrivers.filter(driver => {
            return !scheduledAssignments.value.some(a =>
              a.date === date && a.driver.id === driver.id
            )
          })
          if (availableOnDate.length > 0) {
            assignedDriver = availableOnDate[0]
          }
        }

        if (!assignedDriver) {
          assignedDriver = allDrivers[index % allDrivers.length]
        }

        // Create tasks from services if option is enabled
        const tasks = []
        if (importOptions.createTasks) {
          visits.forEach(visit => {
            visit.services.forEach(service => {
              tasks.push({
                type: 'maintenance',
                description: `${service} at ${visit.propertyName}`,
                estimatedTime: '1 hr',
                completed: false
              })
            })
          })
        }

        // Create the assignment
        const newAssignment = {
          id: Date.now() + index,
          date: date,
          driver: { id: assignedDriver.id, name: assignedDriver.name },
          vehicle: importOptions.autoAssignVehicles ? allVehicles[index % allVehicles.length].name : '',
          routeId: routeKey !== 'unassigned' ? parseInt(routeKey) : null,
          startTime: '08:00',
          endTime: '16:00',
          tasks: tasks,
          notes: `Properties: ${visits.map(v => v.propertyName).join(', ')}`
        }

        scheduledAssignments.value.push(newAssignment)
      })
    })
  } else {
    // Create individual assignments for each visit
    selected.forEach((visit, index) => {
      const assignedDriver = allDrivers[index % allDrivers.length]

      const tasks = importOptions.createTasks ? visit.services.map(service => ({
        type: 'maintenance',
        description: service,
        estimatedTime: '1 hr',
        completed: false
      })) : []

      const newAssignment = {
        id: Date.now() + index,
        date: visit.scheduledDate,
        driver: { id: assignedDriver.id, name: assignedDriver.name },
        vehicle: importOptions.autoAssignVehicles ? allVehicles[index % allVehicles.length].name : '',
        routeId: visit.routeId,
        startTime: '08:00',
        endTime: '16:00',
        tasks: tasks,
        notes: `${visit.propertyName} - ${visit.address}`
      }

      scheduledAssignments.value.push(newAssignment)
    })
  }

  // Clear selections
  propertyVisits.forEach(visit => {
    visit.selected = false
  })

  alert(`Successfully imported ${selected.length} property visits and created ${estimatedAssignments.value} assignments!`)
  showImportModal.value = false

  // Navigate to the first imported date
  if (selected.length > 0) {
    selectedDate.value = selected[0].scheduledDate
  }
}
</script>

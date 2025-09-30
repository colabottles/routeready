<template>
  <NuxtLayout>
  <div>
    <div class="page-header">
      <div
        class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Schedules
          </h1>
          <p class="page-subtitle">Manage
            maintenance schedules and
            assignments</p>
        </div>
        <div class="flex gap-3">
          <button @click="generateSchedule"
            class="btn btn-secondary">
            <span class="mr-2">🔄</span>
            Auto Generate
          </button>
          <NuxtLink to="/schedules/new"
            class="btn btn-primary">
            <span class="mr-2">➕</span>
            Create Schedule
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Schedule Overview -->
    <div class="grid grid-cols-4 mb-8">
      <div class="card">
        <div
          class="card-content text-center">
          <p
            class="text-2xl font-bold text-primary-600">
            {{ stats.todayJobs }}</p>
          <p class="text-sm text-gray-600">
            Today's Jobs</p>
        </div>
      </div>
      <div class="card">
        <div
          class="card-content text-center">
          <p
            class="text-2xl font-bold text-success-600">
            {{ stats.weeklyJobs }}</p>
          <p class="text-sm text-gray-600">
            This Week</p>
        </div>
      </div>
      <div class="card">
        <div
          class="card-content text-center">
          <p
            class="text-2xl font-bold text-accent-600">
            {{ stats.utilization }}%</p>
          <p class="text-sm text-gray-600">
            Driver Utilization</p>
        </div>
      </div>
      <div class="card">
        <div
          class="card-content text-center">
          <p
            class="text-2xl font-bold text-warning-600">
            {{ stats.conflicts }}</p>
          <p class="text-sm text-gray-600">
            Schedule Conflicts</p>
        </div>
      </div>
    </div>

    <!-- Calendar View -->
    <div class="grid grid-cols-3 gap-6 mb-8">
      <div class="col-span-2">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Weekly
              Schedule</h2>
            <div class="flex gap-2">
              <button @click="changeWeek(-1)"
                class="btn btn-secondary text-xs">
                ← Prev
              </button>
              <span
                class="flex items-center px-3 font-medium">
                {{ currentWeek }}
              </span>
              <button @click="changeWeek(1)"
                class="btn btn-secondary text-xs">
                Next →
              </button>
            </div>
          </div>
          <div class="card-content">
            <div
              class="grid grid-cols-7 gap-2 mb-4">
              <div v-for="day in weekDays"
                :key="day"
                class="text-center font-semibold text-sm text-gray-600 p-2">
                {{ day }}
              </div>
            </div>
            <div
              class="grid grid-cols-7 gap-2">
              <div
                v-for="day in calendarDays"
                :key="day.date"
                class="min-h-32 border border-gray-200 rounded p-2">
                <div
                  class="text-sm font-semibold mb-2">
                  {{ day.day }}</div>
                <div class="space-y-1">
                  <div
                    v-for="schedule in day.schedules"
                    :key="schedule.id"
                    class="text-xs p-1 rounded text-white"
                    :style="{ backgroundColor: schedule.color }">
                    {{ schedule.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Schedule -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Today's
            Schedule</h2>
          <p class="card-subtitle">{{ new
            Date().toLocaleDateString() }}
          </p>
        </div>
        <div class="card-content">
          <div class="space-y-3">
            <div
              v-for="item in todaySchedule"
              :key="item.id"
              class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
              <div
                class="w-2 h-2 rounded-full mt-2"
                :style="{ backgroundColor: item.color }">
              </div>
              <div class="flex-1">
                <p
                  class="font-semibold text-sm">
                  {{ item.driver }}</p>
                <p
                  class="text-xs text-gray-600">
                  {{ item.route }}</p>
                <p
                  class="text-xs text-gray-500">
                  {{ item.time }}</p>
              </div>
              <span
                :class="getStatusClass(item.status)"
                class="text-xs">
                {{ item.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Driver Schedules -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Driver
          Schedules</h2>
        <div class="flex gap-4">
          <select v-model="selectedDriver"
            @change="filterSchedules"
            class="form-select">
            <option value="">All Drivers
            </option>
            <option value="john-smith">John
              Smith</option>
            <option value="sarah-johnson">
              Sarah Johnson</option>
            <option value="mike-davis">Mike
              Davis</option>
            <option value="lisa-chen">Lisa
              Chen</option>
          </select>
          <select v-model="selectedPeriod"
            @change="filterSchedules"
            class="form-select">
            <option value="week">This Week
            </option>
            <option value="month">This Month
            </option>
            <option value="quarter">This
              Quarter</option>
          </select>
        </div>
      </div>
      <div class="card-content">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Driver</th>
                <th>Route</th>
                <th>Properties</th>
                <th>Est. Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="schedule in filteredSchedules"
                :key="schedule.id">
                <td>
                  <div>
                    <p class="font-semibold">
                      {{ schedule.date }}</p>
                    <p
                      class="text-sm text-gray-600">
                      {{ schedule.dayOfWeek
                      }}</p>
                  </div>
                </td>
                <td>
                  <div
                    class="flex items-center gap-2">
                    <div
                      class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                      :style="{ backgroundColor: schedule.driverColor, color: 'white' }">
                      {{
                        schedule.driver.charAt(0)
                      }}
                    </div>
                    {{ schedule.driver }}
                  </div>
                </td>
                <td>{{ schedule.route }}</td>
                <td class="text-center">{{
                  schedule.propertyCount }}
                </td>
                <td>{{ schedule.duration }}
                </td>
                <td>
                  <span
                    :class="getStatusClass(schedule.status)">
                    {{ schedule.status }}
                  </span>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button
                      @click="viewSchedule(schedule)"
                      class="btn btn-secondary text-xs">
                      View
                    </button>
                    <button
                      @click="editSchedule(schedule)"
                      class="btn btn-secondary text-xs"
                      :disabled="schedule.status === 'completed'">
                      Edit
                    </button>
                    <button
                      v-if="schedule.status === 'scheduled'"
                      @click="startSchedule(schedule)"
                      class="btn btn-success text-xs">
                      Start
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
  </NuxtLayout>
</template>

<script setup>
const currentWeek = ref('Dec 9-15, 2024')
const selectedDriver = ref('')
const selectedPeriod = ref('week')

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const stats = reactive({
  todayJobs: 8,
  weeklyJobs: 42,
  utilization: 87,
  conflicts: 2
})

// Calendar data
const calendarDays = reactive([
  { day: 8, date: '2024-12-08', schedules: [] },
  {
    day: 9,
    date: '2024-12-09',
    schedules: [
      { id: 1, title: 'John - Downtown', color: '#3b82f6' },
      { id: 2, title: 'Sarah - Residential', color: '#10b981' }
    ]
  },
  {
    day: 10,
    date: '2024-12-10',
    schedules: [
      { id: 3, title: 'Mike - Industrial', color: '#f97316' },
      { id: 4, title: 'Lisa - Medical', color: '#8b5cf6' }
    ]
  },
  {
    day: 11,
    date: '2024-12-11',
    schedules: [
      { id: 5, title: 'John - Shopping', color: '#3b82f6' }
    ]
  },
  {
    day: 12,
    date: '2024-12-12',
    schedules: [
      { id: 6, title: 'Sarah - Apartments', color: '#10b981' },
      { id: 7, title: 'Mike - Warehouses', color: '#f97316' }
    ]
  },
  { day: 13, date: '2024-12-13', schedules: [] },
  { day: 14, date: '2024-12-14', schedules: [] }
])

const todaySchedule = reactive([
  {
    id: 1,
    driver: 'John Smith',
    route: 'Downtown Commercial',
    time: '8:30 AM - 1:00 PM',
    status: 'in-progress',
    color: '#3b82f6'
  },
  {
    id: 2,
    driver: 'Sarah Johnson',
    route: 'Residential District A',
    time: '9:00 AM - 12:30 PM',
    status: 'completed',
    color: '#10b981'
  },
  {
    id: 3,
    driver: 'Mike Davis',
    route: 'Industrial Zone',
    time: '8:00 AM - 2:00 PM',
    status: 'in-progress',
    color: '#f97316'
  },
  {
    id: 4,
    driver: 'Lisa Chen',
    route: 'Medical Center',
    time: '10:00 AM - 1:00 PM',
    status: 'scheduled',
    color: '#8b5cf6'
  }
])

const allSchedules = reactive([
  {
    id: 1,
    date: 'Dec 9',
    dayOfWeek: 'Monday',
    driver: 'John Smith',
    route: 'Downtown Commercial Route',
    propertyCount: 6,
    duration: '4.5 hrs',
    status: 'in-progress',
    driverColor: '#3b82f6'
  },
  {
    id: 2,
    date: 'Dec 9',
    dayOfWeek: 'Monday',
    driver: 'Sarah Johnson',
    route: 'Residential District A',
    propertyCount: 8,
    duration: '3.5 hrs',
    status: 'completed',
    driverColor: '#10b981'
  },
  {
    id: 3,
    date: 'Dec 10',
    dayOfWeek: 'Tuesday',
    driver: 'Mike Davis',
    route: 'Industrial Zone Route',
    propertyCount: 5,
    duration: '6 hrs',
    status: 'scheduled',
    driverColor: '#f97316'
  },
  {
    id: 4,
    date: 'Dec 10',
    dayOfWeek: 'Tuesday',
    driver: 'Lisa Chen',
    route: 'Medical Center Circuit',
    propertyCount: 4,
    duration: '3 hrs',
    status: 'scheduled',
    driverColor: '#8b5cf6'
  },
  {
    id: 5,
    date: 'Dec 11',
    dayOfWeek: 'Wednesday',
    driver: 'John Smith',
    route: 'Shopping Mall Route',
    propertyCount: 3,
    duration: '5 hrs',
    status: 'scheduled',
    driverColor: '#3b82f6'
  }
])

const filteredSchedules = ref([...allSchedules])

function changeWeek(direction) {
  // In a real app, this would change the calendar view
  console.log(`Changing week by ${direction}`)
}

function filterSchedules() {
  filteredSchedules.value = allSchedules.filter(schedule => {
    const matchesDriver = !selectedDriver.value ||
      schedule.driver.toLowerCase().replace(' ', '-') === selectedDriver.value

    // In a real app, would filter by period as well
    return matchesDriver
  })
}

function getStatusClass(status) {
  switch (status) {
    case 'completed':
      return 'status status-active'
    case 'in-progress':
      return 'status status-pending'
    case 'scheduled':
      return 'status status-inactive'
    default:
      return 'status status-inactive'
  }
}

function generateSchedule() {
  alert('Auto-generating optimized schedules based on driver availability and route efficiency...')
}

function viewSchedule(schedule) {
  alert(`Viewing schedule details for ${schedule.driver} on ${schedule.date}`)
}

function editSchedule(schedule) {
  if (schedule.status === 'completed') return
  alert(`Editing schedule for ${schedule.driver}`)
}

function startSchedule(schedule) {
  schedule.status = 'in-progress'
  alert(`Started route: ${schedule.route}`)
}

// Set page title
useHead({
  title: 'Schedules - RouteFlow',
  meta: [
    { name: 'description', content: 'Manage maintenance schedules and assignments' }
  ]
})
</script>
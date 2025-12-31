<template>
  <div class="vehicles-page">
    <div class="page-header">
      <div class="header-top">
        <div>
          <h1 class="page-title">Vehicles</h1>
          <p class="page-subtitle">Manage fleet vehicles and maintenance</p>
        </div>
        <NuxtLink to="/vehicles/new" class="btn btn-primary">
          <PlusIcon :size="18" />
          <span>Add Vehicle</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🚚</div>
        <div class="stat-details">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">Total Vehicles</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-details">
          <div class="stat-value">{{ stats.active }}</div>
          <div class="stat-label">Active</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔧</div>
        <div class="stat-details">
          <div class="stat-value">{{ stats.maintenance }}</div>
          <div class="stat-label">In Maintenance</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⚠️</div>
        <div class="stat-details">
          <div class="stat-value">{{ stats.needsService }}</div>
          <div class="stat-label">Needs Service</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-group">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search vehicles..."
          class="form-input search-input"
          @input="filterVehicles"
        >
        <select v-model="statusFilter" class="form-select" @change="filterVehicles">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
        </select>
        <select v-model="typeFilter" class="form-select" @change="filterVehicles">
          <option value="">All Types</option>
          <option value="truck">Truck</option>
          <option value="van">Van</option>
          <option value="car">Car</option>
        </select>
      </div>
    </div>

    <!-- Vehicles Grid -->
    <div class="vehicles-grid">
      <div v-for="vehicle in filteredVehicles" :key="vehicle.id" class="vehicle-card">
        <div class="vehicle-header">
          <div class="vehicle-title-section">
            <h3 class="vehicle-name">{{ vehicle.name }}</h3>
            <span :class="['vehicle-status', `status-${vehicle.status}`]">
              {{ vehicle.status }}
            </span>
          </div>
          <div class="vehicle-type">{{ vehicle.type }}</div>
        </div>

        <div class="vehicle-image">
          <span class="vehicle-icon">{{ getVehicleIcon(vehicle.type) }}</span>
        </div>

        <div class="vehicle-details">
          <div class="detail-row">
            <span class="detail-label">License Plate:</span>
            <span class="detail-value">{{ vehicle.licensePlate }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Make/Model:</span>
            <span class="detail-value">{{ vehicle.make }} {{ vehicle.model }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Year:</span>
            <span class="detail-value">{{ vehicle.year }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Mileage:</span>
            <span class="detail-value">{{ vehicle.mileage.toLocaleString() }} mi</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Assigned Driver:</span>
            <span class="detail-value">{{ vehicle.assignedDriver || 'Unassigned' }}</span>
          </div>
        </div>

        <div class="maintenance-info">
          <div class="maintenance-row">
            <span class="maintenance-label">Last Service:</span>
            <span class="maintenance-value">{{ vehicle.lastService }}</span>
          </div>
          <div class="maintenance-row">
            <span class="maintenance-label">Next Service:</span>
            <span :class="['maintenance-value', vehicle.serviceDue ? 'service-due' : '']">
              {{ vehicle.nextService }}
            </span>
          </div>
        </div>

        <div class="vehicle-actions">
          <NuxtLink :to="`/vehicles/${vehicle.id}`" class="btn btn-secondary btn-small">
            View Details
          </NuxtLink>
          <NuxtLink :to="`/vehicles/${vehicle.id}/edit`" class="btn btn-secondary btn-small">
            Edit
          </NuxtLink>
          <button class="btn btn-secondary btn-small">
            Service Log
          </button>
          <button
            v-if="vehicle.serviceDue"
            class="btn btn-warning btn-small"
          >
            Schedule Service
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

const searchTerm = ref('')
const statusFilter = ref('')
const typeFilter = ref('')

const stats = reactive({
  total: 15,
  active: 12,
  maintenance: 2,
  needsService: 3
})

const vehicles = reactive([
  {
    id: 1,
    name: 'Delivery Truck #1',
    type: 'truck',
    status: 'active',
    licensePlate: 'TRK-2024',
    make: 'Ford',
    model: 'F-450',
    year: 2022,
    mileage: 45230,
    assignedDriver: 'John Smith',
    lastService: '10/15/2024',
    nextService: '01/15/2025',
    serviceDue: false
  },
  {
    id: 2,
    name: 'Cargo Van #3',
    type: 'van',
    status: 'active',
    licensePlate: 'VAN-3305',
    make: 'Mercedes',
    model: 'Sprinter',
    year: 2023,
    mileage: 28450,
    assignedDriver: 'Sarah Johnson',
    lastService: '11/20/2024',
    nextService: '02/20/2025',
    serviceDue: false
  },
  {
    id: 3,
    name: 'Delivery Truck #5',
    type: 'truck',
    status: 'maintenance',
    licensePlate: 'TRK-5019',
    make: 'Isuzu',
    model: 'NPR',
    year: 2021,
    mileage: 67890,
    assignedDriver: null,
    lastService: '08/10/2024',
    nextService: '12/28/2024',
    serviceDue: true
  },
  {
    id: 4,
    name: 'Compact Car #2',
    type: 'car',
    status: 'active',
    licensePlate: 'CAR-2417',
    make: 'Toyota',
    model: 'Corolla',
    year: 2023,
    mileage: 15670,
    assignedDriver: 'Mike Davis',
    lastService: '12/01/2024',
    nextService: '03/01/2025',
    serviceDue: false
  },
  {
    id: 5,
    name: 'Box Truck #7',
    type: 'truck',
    status: 'active',
    licensePlate: 'TRK-7720',
    make: 'Freightliner',
    model: 'M2',
    year: 2020,
    mileage: 89230,
    assignedDriver: 'Lisa Chen',
    lastService: '09/15/2024',
    nextService: '12/30/2024',
    serviceDue: true
  }
])

const filteredVehicles = ref([...vehicles])

function filterVehicles() {
  filteredVehicles.value = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesStatus = !statusFilter.value || vehicle.status === statusFilter.value
    const matchesType = !typeFilter.value || vehicle.type === typeFilter.value

    return matchesSearch && matchesStatus && matchesType
  })
}

function getVehicleIcon(type) {
  const icons = {
    truck: '🚚',
    van: '🚐',
    car: '🚗'
  }
  return icons[type] || '🚗'
}

useHead({
  title: 'Vehicles - RouteReady',
  meta: [
    { name: 'description', content: 'Manage fleet vehicles' }
  ]
})
</script>

<style scoped>
.vehicles-page {
  width: 100%;
}

.page-header {
  margin-bottom: 2rem;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.stat-details {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Filters */
.filters-section {
  background: var(--bg-primary);
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

.filters-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
}

.form-select {
  min-width: 180px;
}

/* Vehicles Grid */
.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
}

.vehicle-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: all 0.2s;
  border: 2px solid transparent;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--button-primary);
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-border);
}

.vehicle-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.vehicle-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.vehicle-type {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  text-transform: capitalize;
}

.vehicle-status {
  display: inline-block;
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

.status-maintenance {
  background: #f59e0b;
  color: #000000;
}

.status-inactive {
  background: #6b7280;
  color: #ffffff;
}

.vehicle-image {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 1.25rem;
}

.vehicle-icon {
  font-size: 4rem;
  line-height: 1;
}

.vehicle-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.detail-value {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 600;
}

.maintenance-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.maintenance-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.maintenance-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.maintenance-value {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 600;
}

.maintenance-value.service-due {
  color: #f59e0b;
  font-weight: 700;
}

.vehicle-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-small {
  font-size: 0.8125rem;
  padding: 0.5rem 0.875rem;
}

.btn-warning {
  background: #f59e0b;
  color: #000000;
  font-weight: 700;
}

.btn-warning:hover {
  background: #d97706;
}

@media (max-width: 1200px) {
  .vehicles-grid {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
}

@media (max-width: 768px) {
  .vehicles-grid {
    grid-template-columns: 1fr;
  }

  .header-top {
    flex-direction: column;
    gap: 1rem;
  }

  .filters-group {
    flex-direction: column;
  }

  .search-input,
  .form-select {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
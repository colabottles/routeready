<template>
  <div class="map-page">
    <div class="map-header">
      <div class="map-header-left">
        <NuxtLink :to="`/routes/${routeId}`" class="btn btn-secondary btn-small btn-back">
          ← Back
        </NuxtLink>
        <div>
          <h1 class="page-title">{{ routeData.name }}</h1>
          <p class="page-subtitle">{{ stops.length }} stop{{ stops.length !== 1 ? 's' : '' }}</p>
        </div>
      </div>
      <div class="map-header-right">
        <span v-if="optimizeError" class="optimize-error">{{ optimizeError }}</span>
        <button
          class="btn btn-primary btn-small"
          :disabled="optimizing || userStops.length < 2"
          @click="optimizeRoute">
          {{ optimizing ? 'Optimizing…' : 'Optimize Route' }}
        </button>
      </div>
    </div>

    <div class="map-layout">
      <!-- Side panel -->
      <aside class="stops-panel">

        <!-- Depot section -->
        <div class="depot-section">
          <div class="depot-header">
            <h2 class="panel-section-title">Start / End Point</h2>
            <button
              v-if="!editingDepot"
              class="depot-edit-btn"
              aria-label="Edit depot address"
              @click="startEditDepot">
              Edit
            </button>
          </div>
          <div v-if="editingDepot" class="depot-form">
            <input
              v-model="depotDraft"
              class="depot-input"
              type="text"
              placeholder="Enter office address"
              @keydown.enter="saveDepot"
              @keydown.escape="editingDepot = false" >
            <div class="depot-form-actions">
              <button class="btn btn-primary btn-small" @click="saveDepot">Save</button>
              <button
class="btn btn-secondary btn-small"
                @click="editingDepot = false">Cancel</button>
            </div>
          </div>
          <p v-else class="depot-address">{{ depotAddress || 'No start/end point set' }}</p>
        </div>

        <!-- Properties quick-pick -->
        <div class="properties-section">
          <h2 class="panel-section-title">Properties</h2>
          <ul class="properties-list">
            <li
              v-for="property in properties"
              :key="property.id"
              class="property-item"
              @click="addStopFromProperty(property)">
              <div class="property-info">
                <span class="property-name">{{ property.name }}</span>
                <span class="property-address">{{ property.address }}</span>
              </div>
              <span class="property-add-icon" aria-hidden="true">+</span>
            </li>
          </ul>
        </div>

        <!-- Stops list -->
        <div class="stops-section">
          <div class="stops-section-header">
            <h2 class="panel-section-title">Stops</h2>
            <span class="stops-hint">Right-click map to add</span>
          </div>
          <ol class="stops-list">
            <li
              v-for="(stop, index) in stops"
              :key="stop.id"
              class="stop-item"
              :class="{
                'stop-item--active': activeStopId === stop.id,
                'stop-item--depot': stop.isDepot,
                'stop-item--editing': editingStopId === stop.id,
              }"
              @click="editingStopId !== stop.id && focusStop(stop)">
              <span class="stop-number" :class="{ 'stop-number--depot': stop.isDepot }">
                {{ stop.isDepot ? '⌂' : index + 1 }}
              </span>
              <div class="stop-info">
                <template v-if="editingStopId === stop.id">
                  <input
                    :ref="el => { if (el) stopEditRefs[stop.id] = el }"
                    v-model="stopEditDraft"
                    class="stop-edit-input"
                    type="text"
                    placeholder="Stop name"
                    @keydown.enter="saveStopEdit(stop)"
                    @keydown.escape="cancelStopEdit"
                    @click.stop >
                  <div class="stop-edit-actions">
                    <button class="stop-edit-save" @click.stop="saveStopEdit(stop)">Save</button>
                    <button class="stop-edit-cancel" @click.stop="cancelStopEdit">Cancel</button>
                  </div>
                </template>
                <template v-else>
                  <span class="stop-name">{{ stop.name }}</span>
                  <span v-if="stop.isDepot" class="stop-tag">Start / End</span>
                  <span
v-else-if="stop.resolving"
                    class="stop-address stop-address--loading">Locating…</span>
                  <span v-else class="stop-address">{{ stop.address }}</span>
                </template>
              </div>
              <template v-if="!stop.isDepot && editingStopId !== stop.id">
                <button
                  class="stop-action-btn"
                  aria-label="Edit stop name"
                  @click.stop="startStopEdit(stop)">
                  ✎
                </button>
                <button
                  class="stop-remove"
                  aria-label="Remove stop"
                  @click.stop="removeStop(stop.id)">
                  ✕
                </button>
              </template>
            </li>
          </ol>
          <p v-if="userStops.length === 0" class="stops-empty">
            Right-click the map to add stops, or pick a property above.
          </p>
        </div>

      </aside>

      <!-- Map container -->
      <div ref="mapContainer" class="map-container" />
    </div>
  </div>
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useProperties } from '~/composables/useProperties'

definePageMeta({
  layout: 'dashboard',
})

const currentRoute = useRoute()
const routeId = computed(() => currentRoute.params.id)

// Placeholder route data — replace with Supabase fetch
const routeData = reactive({ name: '' })
watchEffect(() => { routeData.name = `Route ${routeId.value}` })

// Properties
const { properties } = useProperties()

// Depot — useState for now; move to org settings in Supabase later
const depotAddress = useState('depot-address', () => '1112 W Hatcher Rd, Phoenix, AZ 85021')
const editingDepot = ref(false)
const depotDraft = ref('')

function startEditDepot() {
  depotDraft.value = depotAddress.value
  editingDepot.value = true
}

async function saveDepot() {
  if (!depotDraft.value.trim()) return
  depotAddress.value = depotDraft.value.trim()
  editingDepot.value = false
  await placeDepotMarker()
}

// Map
const mapContainer = ref(null)
let map = null
const markers = new Map()

const stops = ref([])
const activeStopId = ref(null)
let stopCounter = 0

const depotStop = ref(null)
const userStops = computed(() => stops.value.filter(s => !s.isDepot))

// Inline stop editing
const editingStopId = ref(null)
const stopEditDraft = ref('')
const stopEditRefs = {}

function startStopEdit(stop) {
  editingStopId.value = stop.id
  stopEditDraft.value = stop.name
  nextTick(() => {
    stopEditRefs[stop.id]?.focus()
  })
}

function saveStopEdit(stop) {
  const val = stopEditDraft.value.trim()
  if (val) {
    stop.name = val
    markers.get(stop.id)?.getPopup()?.setText(val)
  }
  editingStopId.value = null
}

function cancelStopEdit() {
  editingStopId.value = null
}

onMounted(async () => {
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      },
      layers: [
        {
          id: 'osm-tiles',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
    center: [-112.0740, 33.5722],
    zoom: 13,
  })

  map.addControl(new maplibregl.NavigationControl(), 'top-right')

  map.on('contextmenu', (e) => {
    const { lng, lat } = e.lngLat
    addStop(lat, lng)
  })

  map.on('load', async () => {
    await placeDepotMarker()
  })
})

onBeforeUnmount(() => {
  if (map) map.remove()
})

async function placeDepotMarker() {
  // Remove existing depot
  if (depotStop.value) {
    const existing = markers.get(depotStop.value.id)
    if (existing) { existing.remove(); markers.delete(depotStop.value.id) }
    stops.value = stops.value.filter(s => !s.isDepot)
    depotStop.value = null
  }

  if (!depotAddress.value) return

  try {
    const result = await $fetch('/api/geocode', {
      query: { address: depotAddress.value },
    })

    const stop = reactive({
      id: 'depot',
      name: depotAddress.value,
      address: result.label,
      lat: result.lat,
      lng: result.lng,
      isDepot: true,
      resolving: false,
    })

    depotStop.value = stop
    stops.value = [stop, ...stops.value.filter(s => !s.isDepot)]
    placeMarker(stop)
    map.flyTo({ center: [result.lng, result.lat], zoom: 13, speed: 1.2 })
  } catch {
    // Invalid address — silently skip
  }
}

async function addStop(lat, lng, name = null) {
  stopCounter++
  const id = stopCounter
  const stopName = name || `Stop ${id}`

  const stop = reactive({
    id,
    name: stopName,
    address: '',
    lat,
    lng,
    isDepot: false,
    resolving: true,
  })

  stops.value.push(stop)
  placeMarker(stop)
  activeStopId.value = id

  try {
    const result = await $fetch('/api/reverse-geocode', {
      query: { lat, lng },
    })
    stop.address = result.address
    stop.name = result.address
    markers.get(id)?.getPopup()?.setText(result.address)
  } catch {
    stop.address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  } finally {
    stop.resolving = false
  }

  refreshMarkerLabels()
}

async function addStopFromProperty(property) {
  try {
    const result = await $fetch('/api/geocode', {
      query: { address: property.address },
    })
    stopCounter++
    const id = stopCounter
    const stop = reactive({
      id,
      name: property.name,
      address: property.address,
      lat: result.lat,
      lng: result.lng,
      isDepot: false,
      resolving: false,
    })
    stops.value.push(stop)
    placeMarker(stop)
    activeStopId.value = id
    refreshMarkerLabels()
    map.flyTo({ center: [result.lng, result.lat], zoom: 15, speed: 1.2 })
  } catch {
    // TODO: surface geocode error to user
  }
}

function placeMarker(stop) {
  const el = document.createElement('div')
  el.className = stop.isDepot ? 'map-marker map-marker--depot' : 'map-marker'
  el.textContent = stop.isDepot ? '⌂' : userStops.value.length

  const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
    .setLngLat([stop.lng, stop.lat])
    .setPopup(new maplibregl.Popup({ offset: 25 }).setText(stop.address || stop.name))
    .addTo(map)

  markers.set(stop.id, marker)
}

function removeStop(id) {
  const marker = markers.get(id)
  if (marker) { marker.remove(); markers.delete(id) }
  stops.value = stops.value.filter(s => s.id !== id)
  refreshMarkerLabels()
  clearRouteLine()
  if (activeStopId.value === id) activeStopId.value = null
}

function refreshMarkerLabels() {
  let userIndex = 1
  stops.value.forEach((stop) => {
    const marker = markers.get(stop.id)
    if (marker && !stop.isDepot) {
      marker.getElement().textContent = userIndex++
    }
  })
}

function focusStop(stop) {
  activeStopId.value = stop.id
  map.flyTo({ center: [stop.lng, stop.lat], zoom: 15, speed: 1.2 })
  markers.get(stop.id)?.togglePopup()
}

// Optimization
const optimizing = ref(false)
const optimizeError = ref(null)

async function optimizeRoute() {
  if (userStops.value.length < 2) return
  optimizing.value = true
  optimizeError.value = null

  try {
    const result = await $fetch('/api/optimize-route', {
      method: 'POST',
      body: {
        stops: userStops.value,
        depot: depotStop.value ? { lat: depotStop.value.lat, lng: depotStop.value.lng } : null,
      },
    })

    const reordered = result.orderedIndices.map(i => userStops.value[i])
    stops.value = depotStop.value
      ? [depotStop.value, ...reordered]
      : reordered

    refreshMarkerLabels()
    if (result.geometry) drawRouteLine(result.geometry)
  } catch (err) {
    optimizeError.value = err?.data?.message ?? 'Optimization failed'
  } finally {
    optimizing.value = false
  }
}

function drawRouteLine(geometry) {
  if (map.getLayer('route-line')) map.removeLayer('route-line')
  if (map.getSource('route-line')) map.removeSource('route-line')

  map.addSource('route-line', {
    type: 'geojson',
    data: { type: 'Feature', geometry },
  })

  map.addLayer({
    id: 'route-line',
    type: 'line',
    source: 'route-line',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: {
      'line-color': 'var(--button-primary, #4f46e5)',
      'line-width': 4,
      'line-opacity': 0.85,
    },
  })
}

function clearRouteLine() {
  if (!map) return
  if (map.getLayer('route-line')) map.removeLayer('route-line')
  if (map.getSource('route-line')) map.removeSource('route-line')
}

useHead(computed(() => ({
  title: `Map — ${routeData.name} - RouteReady`,
})))
</script>

<style scoped>
/* Back button hover */
.btn-back:hover,
.btn-back:focus-visible {
  background: var(--button-primary);
  color: #fff;
  border-color: var(--button-primary);
  outline: 2px solid var(--button-primary);
  outline-offset: 2px;
}

/* Stop inline editing */
.stop-item--editing {
  align-items: flex-start;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.stop-edit-input {
  width: 100%;
  font-size: 0.875rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--button-primary);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  margin-bottom: 0.375rem;
}

.stop-edit-input:focus {
  outline: 2px solid var(--button-primary);
  outline-offset: 1px;
}

.stop-edit-actions {
  display: flex;
  gap: 0.375rem;
}

.stop-edit-save,
.stop-edit-cancel {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  line-height: 1.4;
}

.stop-edit-save {
  background: var(--button-primary);
  color: #fff;
}

.stop-edit-save:hover {
  opacity: 0.9;
}

.stop-edit-cancel {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--input-border);
}

.stop-edit-cancel:hover {
  background: var(--input-border);
}

.stop-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 0.875rem;
  padding: 0.25rem;
  line-height: 1;
  border-radius: 4px;
  flex-shrink: 0;
}

.stop-action-btn:hover {
  color: var(--text-primary);
  background: var(--input-border);
}

.map-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.map-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.map-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.875rem;
}

.optimize-error {
  font-size: 0.8125rem;
  color: #ef4444;
}

.map-layout {
  display: flex;
  gap: 1.25rem;
  flex: 1;
  min-height: 0;
}

/* Side panel */
.stops-panel {
  width: 300px;
  flex-shrink: 0;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.panel-section-title {
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin: 0;
}

/* Depot */
.depot-section {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--input-border);
}

.depot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.depot-edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--button-primary);
  padding: 0;
}

.depot-edit-btn:hover {
  text-decoration: underline;
}

.depot-address {
  font-size: 0.875rem;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
}

.depot-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.depot-input {
  width: 100%;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.depot-form-actions {
  display: flex;
  gap: 0.5rem;
}

/* Properties */
.properties-section {
  padding: 1rem 1.25rem 0.5rem;
  border-bottom: 1px solid var(--input-border);
}

.properties-list {
  list-style: none;
  margin: 0.5rem 0 0;
  padding: 0;
}

.property-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s;
}

.property-item:hover {
  background: var(--bg-secondary);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
}

.property-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.property-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.property-address {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.property-add-icon {
  font-size: 1.25rem;
  color: var(--button-primary);
  font-weight: 700;
  flex-shrink: 0;
}

/* Stops */
.stops-section {
  padding: 1rem 1.25rem 0.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.stops-section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.stops-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.stops-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.stop-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.25rem;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background 0.15s;
}

.stop-item:hover {
  background: var(--bg-secondary);
}

.stop-item--active {
  background: var(--bg-secondary);
  border-left-color: var(--button-primary);
}

.stop-number {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--button-primary);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stop-number--depot {
  background: #6b7280;
}

.stop-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.stop-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stop-address {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stop-address--loading {
  font-style: italic;
}

.stop-tag {
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stop-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 0.75rem;
  padding: 0.25rem;
  line-height: 1;
  border-radius: 4px;
  flex-shrink: 0;
}

.stop-remove:hover {
  color: var(--text-primary);
  background: var(--input-border);
}

.stops-empty {
  padding: 1rem 0;
  color: var(--text-muted);
  font-size: 0.875rem;
  text-align: center;
  margin: 0;
}

/* Map */
.map-container {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  min-height: 500px;
}

:global(.map-marker) {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--button-primary);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

:global(.map-marker--depot) {
  background: #6b7280;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .map-layout {
    flex-direction: column;
  }

  .stops-panel {
    width: 100%;
    max-height: 320px;
  }
}
</style>
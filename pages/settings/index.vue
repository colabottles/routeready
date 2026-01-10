<template>
  <div class="settings-page">
    <div class="page-header">
      <div class="header-top">
        <div>
          <h1 class="page-title">Settings</h1>
          <p class="page-subtitle">Manage your account and application preferences</p>
        </div>
        <button class="btn btn-primary" @click="saveAllSettings">
          <span class="btn-icon">💾</span>
          Save Changes
        </button>
      </div>
    </div>

    <!-- Settings Navigation Tabs -->
    <div class="settings-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Company Information -->
    <div v-show="activeTab === 'company'" class="settings-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">Company Information</h2>
          <p class="section-description">Basic information about your company</p>
        </div>
        <div class="section-content">
          <div class="form-grid">
            <div class="form-group">
              <label for="company-name">Company Name</label>
              <input
                id="company-name"
                v-model="companySettings.name"
                type="text"
                class="form-input"
                placeholder="RouteReady Inc."
              >
            </div>

            <div class="form-group">
              <label for="company-email">Company Email</label>
              <input
                id="company-email"
                v-model="companySettings.email"
                type="email"
                class="form-input"
                placeholder="contact@routeready.com"
              >
            </div>

            <div class="form-group">
              <label for="company-phone">Phone Number</label>
              <input
                id="company-phone"
                v-model="companySettings.phone"
                type="tel"
                class="form-input"
                placeholder="(555) 123-4567"
              >
            </div>

            <div class="form-group">
              <label for="company-website">Website</label>
              <input
                id="company-website"
                v-model="companySettings.website"
                type="url"
                class="form-input"
                placeholder="https://routeready.com"
              >
            </div>

            <div class="form-group full-width">
              <label for="company-address">Address</label>
              <input
                id="company-address"
                v-model="companySettings.address"
                type="text"
                class="form-input"
                placeholder="123 Main Street"
              >
            </div>

            <div class="form-group">
              <label for="company-city">City</label>
              <input
                id="company-city"
                v-model="companySettings.city"
                type="text"
                class="form-input"
                placeholder="New York"
              >
            </div>

            <div class="form-group">
              <label for="company-state">State</label>
              <input
                id="company-state"
                v-model="companySettings.state"
                type="text"
                class="form-input"
                placeholder="NY"
              >
            </div>

            <div class="form-group">
              <label for="company-zip">ZIP Code</label>
              <input
                id="company-zip"
                v-model="companySettings.zip"
                type="text"
                class="form-input"
                placeholder="10001"
              >
            </div>

            <div class="form-group">
              <label for="company-country">Country</label>
              <select
                id="company-country"
                v-model="companySettings.country"
                class="form-select"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="MX">Mexico</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
          </div>

          <div class="form-group full-width">
            <label for="company-description">Company Description</label>
            <textarea
              id="company-description"
              v-model="companySettings.description"
              class="form-textarea"
              rows="4"
              placeholder="Brief description of your company..."
            />
          </div>

          <div class="form-group">
            <label for="company-logo">Company Logo</label>
            <div class="file-upload-area">
              <div class="current-logo">
                <img v-if="companySettings.logoUrl" :src="companySettings.logoUrl" alt="Company Logo" class="logo-preview">
                <div v-else class="logo-placeholder">No logo uploaded</div>
              </div>
              <button class="btn btn-secondary" @click="uploadLogo">
                <span class="btn-icon">📸</span>
                Upload New Logo
              </button>
              <p class="upload-hint">Recommended: 500x500px, PNG or JPG</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Profile -->
    <div v-show="activeTab === 'profile'" class="settings-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">Admin Profile</h2>
          <p class="section-description">Manage your personal information</p>
        </div>
        <div class="section-content">
          <div class="profile-header-section">
            <div class="avatar-section">
              <div class="avatar-large">
                <img v-if="adminProfile.avatarUrl" :src="adminProfile.avatarUrl" alt="Avatar">
                <span v-else class="avatar-initial">{{ adminProfile.name.charAt(0) }}</span>
              </div>
              <div class="avatar-actions">
                <button class="btn btn-secondary btn-small" @click="uploadAvatar">Upload Photo</button>
                <button class="btn btn-secondary btn-small" @click="removeAvatar">Remove</button>
              </div>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="admin-name">Full Name</label>
              <input
                id="admin-name"
                v-model="adminProfile.name"
                type="text"
                class="form-input"
                placeholder="John Doe"
              >
            </div>

            <div class="form-group">
              <label for="admin-email">Email Address</label>
              <input
                id="admin-email"
                v-model="adminProfile.email"
                type="email"
                class="form-input"
                placeholder="admin@routeready.com"
              >
            </div>

            <div class="form-group">
              <label for="admin-phone">Phone Number</label>
              <input
                id="admin-phone"
                v-model="adminProfile.phone"
                type="tel"
                class="form-input"
                placeholder="(555) 123-4567"
              >
            </div>

            <div class="form-group">
              <label for="admin-role">Role</label>
              <input
                id="admin-role"
                v-model="adminProfile.role"
                type="text"
                class="form-input"
                placeholder="Administrator"
                disabled
              >
            </div>
          </div>

          <div class="divider"/>

          <h3 class="subsection-title">Change Password</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="current-password">Current Password</label>
              <input
                id="current-password"
                v-model="passwordChange.current"
                type="password"
                class="form-input"
                placeholder="Enter current password"
              >
            </div>

            <div class="form-group">
              <label for="new-password">New Password</label>
              <input
                id="new-password"
                v-model="passwordChange.new"
                type="password"
                class="form-input"
                placeholder="Enter new password"
              >
            </div>

            <div class="form-group">
              <label for="confirm-password">Confirm New Password</label>
              <input
                id="confirm-password"
                v-model="passwordChange.confirm"
                type="password"
                class="form-input"
                placeholder="Confirm new password"
              >
            </div>
          </div>
          <button class="btn btn-primary" @click="changePassword">Update Password</button>
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <div v-show="activeTab === 'notifications'" class="settings-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">Notification Preferences</h2>
          <p class="section-description">Choose what notifications you want to receive</p>
        </div>
        <div class="section-content">
          <div class="notification-group">
            <h3 class="notification-group-title">Email Notifications</h3>
            <div class="notification-items">
              <div v-for="notif in emailNotifications" :key="notif.id" class="notification-item">
                <div class="notification-info">
                  <label :for="`email-notif-${notif.id}`" class="notification-label">{{ notif.label }}</label>
                  <div class="notification-description">{{ notif.description }}</div>
                </div>
                <label class="toggle-switch">
                  <input :id="`email-notif-${notif.id}`" v-model="notif.enabled" type="checkbox">
                  <span class="toggle-slider"/>
                </label>
              </div>
            </div>
          </div>

          <div class="divider"/>

          <div class="notification-group">
            <h3 class="notification-group-title">Push Notifications</h3>
            <div class="notification-items">
              <div v-for="notif in pushNotifications" :key="notif.id" class="notification-item">
                <div class="notification-info">
                  <label :for="`push-notif-${notif.id}`" class="notification-label">{{ notif.label }}</label>
                  <div class="notification-description">{{ notif.description }}</div>
                </div>
                <label class="toggle-switch">
                  <input :id="`push-notif-${notif.id}`" v-model="notif.enabled" type="checkbox">
                  <span class="toggle-slider"/>
                </label>
              </div>
            </div>
          </div>

          <div class="divider"/>

          <div class="notification-group">
            <h3 class="notification-group-title">SMS Notifications</h3>
            <div class="notification-items">
              <div v-for="notif in smsNotifications" :key="notif.id" class="notification-item">
                <div class="notification-info">
                  <label :for="`sms-notif-${notif.id}`" class="notification-label">{{ notif.label }}</label>
                  <div class="notification-description">{{ notif.description }}</div>
                </div>
                <label class="toggle-switch">
                  <input :id="`sms-notif-${notif.id}`" v-model="notif.enabled" type="checkbox">
                  <span class="toggle-slider"/>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preferences -->
    <div v-show="activeTab === 'preferences'" class="settings-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">Application Preferences</h2>
          <p class="section-description">Customize your application experience</p>
        </div>
        <div class="section-content">
          <h3 class="subsection-title">Schedule Preferences</h3>

          <div class="form-group">
            <label for="default-schedule-view">Default Schedule View</label>
            <select
              id="default-schedule-view"
              v-model="preferences.defaultScheduleView"
              class="form-select"
            >
              <option value="day">Day View</option>
              <option value="week">Week View</option>
              <option value="month">Month View</option>
            </select>
            <span class="help-text">Choose which view appears when you open the schedule page</span>
          </div>

          <div class="form-group">
            <label for="week-start-day">Week Start Day</label>
            <select
              id="week-start-day"
              v-model="preferences.weekStartDay"
              class="form-select"
            >
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
            </select>
            <span class="help-text">Select which day starts the week in calendar views</span>
          </div>

          <div class="divider"/>

          <div class="form-group">
            <label for="language">Language</label>
            <select
              id="language"
              v-model="preferences.language"
              class="form-select"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div class="form-group">
            <label for="timezone">Timezone</label>
            <select
              id="timezone"
              v-model="preferences.timezone"
              class="form-select"
            >
              <option value="PST">Pacific Time (PST)</option>
              <option value="MST">Mountain Time (MST)</option>
              <option value="CST">Central Time (CST)</option>
              <option value="EST">Eastern Time (EST)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="date-format">Date Format</label>
            <select
              id="date-format"
              v-model="preferences.dateFormat"
              class="form-select"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div class="form-group">
            <label for="time-format">Time Format</label>
            <select
              id="time-format"
              v-model="preferences.timeFormat"
              class="form-select"
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </div>

          <div class="form-group">
            <label for="currency">Currency</label>
            <select
              id="currency"
              v-model="preferences.currency"
              class="form-select"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="distance-unit">Distance Unit</label>
            <select
              id="distance-unit"
              v-model="preferences.distanceUnit"
              class="form-select"
            >
              <option value="miles">Miles</option>
              <option value="kilometers">Kilometers</option>
            </select>
          </div>

          <div class="divider"/>

          <h3 class="subsection-title">Display Settings</h3>

          <div class="preference-item">
            <div class="preference-info">
              <div class="preference-label">
                <label for="dark-mode">Dark Mode</label>
              </div>
              <div class="preference-description">Use dark theme across the application</div>
            </div>
            <label class="toggle-switch">
              <input id="dark-mode" v-model="preferences.darkMode" type="checkbox">
              <span class="toggle-slider"/>
            </label>
          </div>

          <div class="preference-item">
            <div class="preference-info">
              <div class="preference-label">
                <label for="compact-view">Compact View</label>
              </div>
              <div class="preference-description">Show more information in less space</div>
            </div>
            <label class="toggle-switch">
              <input id="compact-view" v-model="preferences.compactView" type="checkbox">
              <span class="toggle-slider"/>
            </label>
          </div>

          <div class="preference-item">
            <div class="preference-info">
              <div class="preference-label">
                <label for="show-tooltips">Show Tooltips</label>
              </div>
              <div class="preference-description">Display helpful tooltips when hovering</div>
            </div>
            <label class="toggle-switch">
              <input id="show-tooltips" v-model="preferences.showTooltips" type="checkbox">
              <span class="toggle-slider"/>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Security -->
    <div v-show="activeTab === 'security'" class="settings-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">Security Settings</h2>
          <p class="section-description">Manage your account security</p>
        </div>
        <div class="section-content">
          <div class="security-item">
            <div class="security-info">
              <div class="security-label">Two-Factor Authentication</div>
              <div class="security-description">Add an extra layer of security to your account</div>
              <div class="security-status enabled">
                <span class="status-dot"/>
                <span>Enabled</span>
              </div>
            </div>
            <button class="btn btn-secondary">Configure</button>
          </div>

          <div class="divider"/>

          <div class="security-item">
            <div class="security-info">
              <div class="security-label">Active Sessions</div>
              <div class="security-description">Manage your active login sessions</div>
            </div>
            <button class="btn btn-secondary">View Sessions</button>
          </div>

          <div class="divider"/>

          <div class="security-item">
            <div class="security-info">
              <div class="security-label">Login History</div>
              <div class="security-description">View recent login activity</div>
            </div>
            <button class="btn btn-secondary">View History</button>
          </div>

          <div class="divider"/>

          <h3 class="subsection-title">Security Preferences</h3>

          <div class="preference-item">
            <div class="preference-info">
              <div class="preference-label">Require Password on Sensitive Actions</div>
              <div class="preference-description">Ask for password before critical operations</div>
            </div>
            <label class="toggle-switch">
              <input id="require-password" v-model="securitySettings.requirePassword" type="checkbox">
              <span class="toggle-slider"/>
            </label>
          </div>

          <div class="preference-item">
            <div class="preference-info">
              <div class="preference-label">Session Timeout</div>
              <div class="preference-description">Auto-logout after period of inactivity</div>
            </div>
            <select v-model="securitySettings.sessionTimeout" class="form-select compact">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="0">Never</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Integrations -->
    <div v-show="activeTab === 'integrations'" class="settings-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">Integrations</h2>
          <p class="section-description">Connect with third-party services</p>
        </div>
        <div class="section-content">
          <div class="integrations-grid">
            <div v-for="integration in integrations" :key="integration.id" class="integration-card">
              <div class="integration-icon">{{ integration.icon }}</div>
              <div class="integration-info">
                <div class="integration-name">{{ integration.name }}</div>
                <div class="integration-description">{{ integration.description }}</div>
                <div class="integration-status" :class="integration.connected ? 'connected' : 'disconnected'">
                  <span class="status-dot"/>
                  <span>{{ integration.connected ? 'Connected' : 'Not Connected' }}</span>
                </div>
              </div>
              <button
                :class="['btn', integration.connected ? 'btn-secondary' : 'btn-primary']"
                @click="toggleIntegration(integration.id)"
              >
                {{ integration.connected ? 'Disconnect' : 'Connect' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Billing -->
    <div v-show="activeTab === 'billing'" class="settings-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">Billing & Subscription</h2>
          <p class="section-description">Manage your subscription and payment methods</p>
        </div>
        <div class="section-content">
          <div class="current-plan">
            <div class="plan-header">
              <div>
                <div class="plan-name">Professional Plan</div>
                <div class="plan-price">$99/month</div>
              </div>
              <button class="btn btn-primary">Upgrade Plan</button>
            </div>
            <div class="plan-features">
              <div class="plan-feature">
                <span class="feature-icon">✓</span>
                <span>Unlimited Drivers</span>
              </div>
              <div class="plan-feature">
                <span class="feature-icon">✓</span>
                <span>Unlimited Routes</span>
              </div>
              <div class="plan-feature">
                <span class="feature-icon">✓</span>
                <span>Advanced Analytics</span>
              </div>
              <div class="plan-feature">
                <span class="feature-icon">✓</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          <div class="divider"/>

          <h3 class="subsection-title">Payment Method</h3>
          <div class="payment-method">
            <div class="card-info">
              <div class="card-icon">💳</div>
              <div class="card-details">
                <div class="card-type">Visa ending in 4242</div>
                <div class="card-expiry">Expires 12/2025</div>
              </div>
            </div>
            <button class="btn btn-secondary">Update</button>
          </div>

          <div class="divider"/>

          <h3 class="subsection-title">Billing History</h3>
          <div class="billing-history">
            <div v-for="invoice in billingHistory" :key="invoice.id" class="invoice-item">
              <div class="invoice-info">
                <div class="invoice-date">{{ invoice.date }}</div>
                <div class="invoice-description">{{ invoice.description }}</div>
              </div>
              <div class="invoice-amount">${{ invoice.amount }}</div>
              <button class="btn btn-secondary btn-small">Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced -->
    <div v-show="activeTab === 'advanced'" class="settings-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">Advanced Settings</h2>
          <p class="section-description">System and data management options</p>
        </div>
        <div class="section-content">
          <div class="advanced-item">
            <div class="advanced-info">
              <div class="advanced-label">Export Data</div>
              <div class="advanced-description">Download all your data in CSV format</div>
            </div>
            <button class="btn btn-secondary">Export</button>
          </div>

          <div class="divider"/>

          <div class="advanced-item">
            <div class="advanced-info">
              <div class="advanced-label">Import Data</div>
              <div class="advanced-description">Import drivers, routes, or vehicles from CSV</div>
            </div>
            <button class="btn btn-secondary">Import</button>
          </div>

          <div class="divider"/>

          <div class="advanced-item">
            <div class="advanced-info">
              <div class="advanced-label">API Access</div>
              <div class="advanced-description">Generate API keys for integrations</div>
            </div>
            <button class="btn btn-secondary">Manage API Keys</button>
          </div>

          <div class="divider"/>

          <div class="advanced-item">
            <div class="advanced-info">
              <div class="advanced-label">Webhooks</div>
              <div class="advanced-description">Configure webhooks for real-time updates</div>
            </div>
            <button class="btn btn-secondary">Configure</button>
          </div>

          <div class="divider"/>

          <h3 class="subsection-title danger-zone-title">Danger Zone</h3>

          <div class="danger-zone">
            <div class="danger-item">
              <div class="danger-info">
                <div class="danger-label">Clear All Data</div>
                <div class="danger-description">Permanently delete all routes, drivers, and vehicles</div>
              </div>
              <button class="btn btn-danger">Clear Data</button>
            </div>

            <div class="divider"/>

            <div class="danger-item">
              <div class="danger-info">
                <div class="danger-label">Delete Account</div>
                <div class="danger-description">Permanently delete your account and all data</div>
              </div>
              <button class="btn btn-danger">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const activeTab = ref('company')

const tabs = [
  { id: 'company', label: 'Company', icon: '🏢' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'integrations', label: 'Integrations', icon: '🔗' },
  { id: 'billing', label: 'Billing', icon: '💳' },
  { id: 'advanced', label: 'Advanced', icon: '🛠️' }
]

const companySettings = reactive({
  name: 'RouteReady Inc.',
  email: 'contact@routeready.com',
  phone: '(555) 123-4567',
  website: 'https://routeready.com',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  country: 'US',
  description: 'Leading route optimization and delivery management platform',
  logoUrl: null
})

const adminProfile = reactive({
  name: 'Paula Johnson',
  email: 'paula@routeready.com',
  phone: '(555) 987-6543',
  role: 'Administrator',
  avatarUrl: null
})

const passwordChange = reactive({
  current: '',
  new: '',
  confirm: ''
})

const emailNotifications = reactive([
  { id: 1, label: 'Delivery Updates', description: 'Get notified when deliveries are completed', enabled: true },
  { id: 2, label: 'Driver Assignments', description: 'When drivers are assigned to routes', enabled: true },
  { id: 3, label: 'Vehicle Maintenance', description: 'Reminders for scheduled maintenance', enabled: true },
  { id: 4, label: 'Weekly Reports', description: 'Summary of weekly performance', enabled: false }
])

const pushNotifications = reactive([
  { id: 1, label: 'Route Delays', description: 'When routes are running behind schedule', enabled: true },
  { id: 2, label: 'Failed Deliveries', description: 'When a delivery fails', enabled: true },
  { id: 3, label: 'New Messages', description: 'When you receive new messages', enabled: false }
])

const smsNotifications = reactive([
  { id: 1, label: 'Critical Alerts', description: 'Emergency notifications only', enabled: true },
  { id: 2, label: 'Daily Summary', description: 'End of day summary', enabled: false }
])

const preferences = reactive({
  defaultScheduleView: 'week',
  weekStartDay: '0',
  language: 'en',
  timezone: 'EST',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  currency: 'USD',
  distanceUnit: 'miles',
  darkMode: false,
  compactView: false,
  showTooltips: true
})

const securitySettings = reactive({
  requirePassword: true,
  sessionTimeout: '30'
})

const integrations = reactive([
  { id: 1, name: 'Google Maps', description: 'Route optimization and mapping', icon: '🗺️', connected: true },
  { id: 2, name: 'Slack', description: 'Team notifications and updates', icon: '💬', connected: false },
  { id: 3, name: 'QuickBooks', description: 'Accounting and invoicing', icon: '📊', connected: false },
  { id: 4, name: 'Twilio', description: 'SMS notifications', icon: '📱', connected: true },
  { id: 5, name: 'Zapier', description: 'Connect with 1000+ apps', icon: '⚡', connected: false },
  { id: 6, name: 'Stripe', description: 'Payment processing', icon: '💳', connected: true }
])

const billingHistory = reactive([
  { id: 1, date: 'Dec 1, 2024', description: 'Professional Plan - Monthly', amount: 99 },
  { id: 2, date: 'Nov 1, 2024', description: 'Professional Plan - Monthly', amount: 99 },
  { id: 3, date: 'Oct 1, 2024', description: 'Professional Plan - Monthly', amount: 99 }
])

// Load saved settings on mount
onMounted(() => {
  try {
    const savedSettings = localStorage.getItem('routeready-settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)

      // Load preferences
      if (parsed.preferences) {
        Object.assign(preferences, parsed.preferences)
      }

      // Load company settings
      if (parsed.company) {
        Object.assign(companySettings, parsed.company)
      }

      // Load admin profile
      if (parsed.admin) {
        Object.assign(adminProfile, parsed.admin)
      }

      // Load security settings
      if (parsed.security) {
        Object.assign(securitySettings, parsed.security)
      }

      // Load notifications
      if (parsed.notifications) {
        if (parsed.notifications.email) {
          parsed.notifications.email.forEach((notif, index) => {
            if (emailNotifications[index]) {
              emailNotifications[index].enabled = notif.enabled
            }
          })
        }
        if (parsed.notifications.push) {
          parsed.notifications.push.forEach((notif, index) => {
            if (pushNotifications[index]) {
              pushNotifications[index].enabled = notif.enabled
            }
          })
        }
        if (parsed.notifications.sms) {
          parsed.notifications.sms.forEach((notif, index) => {
            if (smsNotifications[index]) {
              smsNotifications[index].enabled = notif.enabled
            }
          })
        }
      }
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
})

function saveAllSettings() {
  try {
    // Save all settings to localStorage
    const allSettings = {
      company: companySettings,
      admin: adminProfile,
      notifications: {
        email: emailNotifications,
        push: pushNotifications,
        sms: smsNotifications
      },
      preferences: preferences,
      security: securitySettings
    }

    localStorage.setItem('routeready-settings', JSON.stringify(allSettings))
    alert('Settings saved successfully!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Failed to save settings. Please try again.')
  }
}

function uploadLogo() {
  console.log('Upload logo')
}

function uploadAvatar() {
  console.log('Upload avatar')
}

function removeAvatar() {
  adminProfile.avatarUrl = null
}

function changePassword() {
  if (passwordChange.new !== passwordChange.confirm) {
    alert('Passwords do not match!')
    return
  }
  console.log('Changing password...')
  alert('Password updated successfully!')
}

function toggleIntegration(id) {
  const integration = integrations.find(i => i.id === id)
  if (integration) {
    integration.connected = !integration.connected
  }
}

useHead({
  title: 'Settings - RouteReady',
  meta: [
    { name: 'description', content: 'Manage your settings' }
  ]
})
</script>

<style scoped>
.settings-page {
  width: 100%;
  max-width: 1200px;
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

/* Settings Tabs */
.settings-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding: 0.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.tab-btn.active {
  background: var(--button-primary);
  color: white;
}

.tab-icon {
  font-size: 1.125rem;
}

.tab-label {
  font-size: 0.9375rem;
}

.help-text {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  display: block;
}

/* Section Card */
.settings-section {
  margin-bottom: 2rem;
}

.section-card {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.section-header {
  padding: 2rem;
  border-bottom: 1px solid var(--input-border);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.section-description {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0;
}

.section-content {
  padding: 2rem;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem 1rem;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-primary);
  border-radius: 8px;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--button-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.form-select.compact {
  max-width: 200px;
}

/* File Upload */
.file-upload-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.current-logo {
  width: 150px;
  height: 150px;
  border-radius: 12px;
  border: 2px dashed var(--input-border);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-secondary);
}

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-placeholder {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-align: center;
  padding: 1rem;
}

.upload-hint {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin: 0;
}

/* Profile Section */
.profile-header-section {
  margin-bottom: 2rem;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--button-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 4px solid var(--bg-secondary);
}

.avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initial {
  font-size: 3rem;
  font-weight: 700;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Divider */
.divider {
  height: 1px;
  background: var(--input-border);
  margin: 2rem 0;
}

.subsection-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
}

/* Notifications */
.notification-group {
  margin-bottom: 2rem;
}

.notification-group:last-child {
  margin-bottom: 0;
}

.notification-group-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.notification-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.notification-info {
  flex: 1;
}

.notification-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.notification-description {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--input-border);
  transition: 0.3s;
  border-radius: 28px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--button-primary);
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* Preference Items */
.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.preference-info {
  flex: 1;
}

.preference-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.preference-description {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

/* Security Items */
.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.security-info {
  flex: 1;
}

.security-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.security-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.security-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
}

.security-status.enabled {
  background: #d1fae5;
  color: #065f46;
}

.security-status .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

/* Integrations */
.integrations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.integration-card {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.integration-card:hover {
  border-color: var(--button-primary);
}

.integration-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.integration-info {
  margin-bottom: 1rem;
}

.integration-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.integration-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.integration-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.integration-status.connected {
  background: #d1fae5;
  color: #065f46;
}

.integration-status.disconnected {
  background: var(--bg-primary);
  color: var(--text-muted);
}

.integration-status .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

/* Billing */
.current-plan {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--input-border);
}

.plan-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.plan-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--button-primary);
}

.plan-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.plan-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.feature-icon {
  color: #10b981;
  font-weight: 700;
}

.payment-method {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 2rem;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-icon {
  font-size: 2rem;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-type {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.card-expiry {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.billing-history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.invoice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.invoice-info {
  flex: 1;
}

.invoice-date {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.invoice-description {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.invoice-amount {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-right: 1rem;
}

/* Advanced */
.advanced-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.advanced-info {
  flex: 1;
}

.advanced-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.advanced-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.danger-zone-title {
  color: #ef4444;
}

.danger-zone {
  border: 2px solid #fecaca;
  border-radius: 12px;
  padding: 1.5rem;
  background: #fef2f2;
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.danger-info {
  flex: 1;
}

.danger-label {
  font-size: 1rem;
  font-weight: 600;
  color: #991b1b;
  margin-bottom: 0.5rem;
}

.danger-description {
  font-size: 0.875rem;
  color: #b91c1c;
}

.btn-danger {
  padding: 0.625rem 1.25rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .settings-tabs {
    overflow-x: auto;
  }

  .plan-features {
    grid-template-columns: 1fr;
  }

  .integrations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
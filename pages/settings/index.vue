<template>
  <main class="settings-page">
    <header class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage your account and application preferences</p>
      <button class="btn btn-primary" @click="saveAllSettings">
        <svg
          xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" aria-hidden="true">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        <span>Save Changes</span>
      </button>
    </header>

    <!-- Settings Navigation Tabs -->
    <nav class="settings-tabs" aria-label="Settings categories">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        :aria-current="activeTab === tab.id ? 'page' : undefined"
        @click="activeTab = tab.id">
        <span class="tab-icon" aria-hidden="true">
          <!-- Company -->
          <svg
            v-if="tab.id === 'company'" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <!-- Profile -->
          <svg
            v-else-if="tab.id === 'profile'" xmlns="http://www.w3.org/2000/svg" width="18"
            height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <!-- Notifications -->
          <svg
            v-else-if="tab.id === 'notifications'" xmlns="http://www.w3.org/2000/svg" width="18"
            height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <!-- Preferences -->
          <svg
            v-else-if="tab.id === 'preferences'" xmlns="http://www.w3.org/2000/svg" width="18"
            height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <!-- Security -->
          <svg
            v-else-if="tab.id === 'security'" xmlns="http://www.w3.org/2000/svg" width="18"
            height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <!-- Integrations -->
          <svg
            v-else-if="tab.id === 'integrations'" xmlns="http://www.w3.org/2000/svg" width="18"
            height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <!-- Billing -->
          <svg
            v-else-if="tab.id === 'billing'" xmlns="http://www.w3.org/2000/svg" width="18"
            height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          <!-- Advanced -->
          <svg
            v-else-if="tab.id === 'advanced'" xmlns="http://www.w3.org/2000/svg" width="18"
            height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
            <line x1="13" y1="19" x2="19" y2="13" />
            <line x1="16" y1="16" x2="20" y2="20" />
            <line x1="19" y1="21" x2="21" y2="19" />
          </svg>
        </span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </nav>

    <!-- Company Information -->
    <section
      v-show="activeTab === 'company'" class="settings-section"
      aria-labelledby="company-heading">
      <article class="section-card">
        <header class="section-header">
          <h2 id="company-heading" class="section-title">Company Information</h2>
          <p class="section-description">Basic information about your company</p>
        </header>
        <div class="section-content">
          <form class="form-grid" @submit.prevent>
            <div class="form-group">
              <label for="company-name">Company Name</label>
              <input
                id="company-name"
                v-model="companySettings.name"
                type="text"
                class="form-input"
                placeholder="e.g. Acme Logistics Inc.">
            </div>

            <div class="form-group">
              <label for="company-email">Company Email</label>
              <input
                id="company-email"
                v-model="companySettings.email"
                type="email"
                class="form-input"
                placeholder="e.g. contact@example.com">
            </div>

            <div class="form-group">
              <label for="company-phone">Phone Number</label>
              <PhoneInput
                id="company-phone"
                v-model="companySettings.phone"
                label="Company Phone"
                autocomplete="tel" />
            </div>

            <div class="form-group">
              <label for="company-website">Website</label>
              <input
                id="company-website"
                v-model="companySettings.website"
                type="url"
                class="form-input"
                placeholder="e.g. https://example.com">
            </div>

            <div class="form-group full-width">
              <label for="company-address">Street Address</label>
              <input
                id="company-address"
                v-model="companySettings.address"
                type="text"
                class="form-input"
                placeholder="e.g. 123 Main Street, Suite 400">
            </div>

            <div class="form-group">
              <label for="company-city">City</label>
              <input
                id="company-city"
                v-model="companySettings.city"
                type="text"
                class="form-input"
                placeholder="e.g. Phoenix">
            </div>

            <div class="form-group">
              <label for="company-state">State</label>
              <input
                id="company-state"
                v-model="companySettings.state"
                type="text"
                class="form-input"
                placeholder="e.g. AZ">
            </div>

            <div class="form-group">
              <label for="company-zip">ZIP Code</label>
              <input
                id="company-zip"
                v-model="companySettings.zip"
                type="text"
                class="form-input"
                placeholder="e.g. 85001">
            </div>

            <div class="form-group">
              <label for="company-country">Country</label>
              <select
                id="company-country"
                v-model="companySettings.country"
                class="form-select">
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="MX">Mexico</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="company-description">Company Description</label>
              <textarea
                id="company-description"
                v-model="companySettings.description"
                class="form-textarea"
                rows="4"
                placeholder="e.g. We provide route optimization and fleet management services across the Southwest." />
            </div>

            <div class="form-group full-width">
              <p class="form-group-label">Company Logo</p>
              <div class="file-upload-area">
                <figure class="current-logo">
                  <img
                    v-if="companyLogo"
                    :src="companyLogo"
                    alt="Company Logo"
                    class="logo-preview">
                  <figcaption v-else class="logo-placeholder">No logo uploaded</figcaption>
                </figure>
                <button type="button" class="btn btn-secondary" @click="triggerLogoUpload">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Upload New Logo</span>
                </button>
                <input
                  ref="logoFileInput"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  class="visually-hidden"
                  aria-label="Upload company logo"
                  @change="handleLogoUpload">
                <p class="upload-hint">Recommended: 500×500px, PNG or JPG, max 2MB</p>
              </div>
            </div>
          </form>
        </div>
      </article>
    </section>

    <!-- Admin Profile -->
    <section
      v-show="activeTab === 'profile'" class="settings-section"
      aria-labelledby="profile-heading">
      <article class="section-card">
        <header class="section-header">
          <h2 id="profile-heading" class="section-title">Admin Profile</h2>
          <p class="section-description">Manage your personal information</p>
        </header>
        <div class="section-content">
          <figure class="profile-header-section">
            <div class="avatar-large">
              <img v-if="adminProfile.avatarUrl" :src="adminProfile.avatarUrl" alt="Admin avatar">
              <span v-else class="avatar-initial" aria-label="Avatar placeholder">
                {{ adminProfile.name.charAt(0) || '?' }}
              </span>
            </div>
            <figcaption class="visually-hidden">Profile photo</figcaption>
            <nav class="avatar-actions" aria-label="Avatar actions">
              <button type="button" class="btn btn-secondary btn-small" @click="uploadAvatar">Upload
                Photo</button>
              <button
                type="button" class="btn btn-secondary btn-small"
                @click="removeAvatar">Remove</button>
            </nav>
          </figure>

          <form class="form-grid" @submit.prevent>
            <label class="form-group">
              Full Name
              <input
                id="admin-name"
                v-model="adminProfile.name"
                type="text"
                class="form-input"
                placeholder="John Doe">
            </label>

            <label class="form-group">
              Email Address
              <input
                id="admin-email"
                v-model="adminProfile.email"
                type="email"
                class="form-input"
                placeholder="admin@routeready.com">
            </label>

            <div class="form-group">
              <label for="admin-phone">Phone Number</label>
              <PhoneInput
                id="admin-phone"
                v-model="adminProfile.phone"
                label="Admin Phone"
                autocomplete="tel" />
            </div>

            <label class="form-group">
              Role
              <input
                id="admin-role"
                v-model="adminProfile.role"
                type="text"
                class="form-input"
                placeholder="Administrator"
                disabled>
            </label>
          </form>

          <hr class="divider" aria-hidden="true">

          <section aria-labelledby="password-heading">
            <h3 id="password-heading" class="subsection-title">Change Password</h3>
            <form class="form-grid" @submit.prevent="changePassword">
              <label class="form-group">
                Current Password
                <input
                  id="current-password"
                  v-model="passwordChange.current"
                  type="password"
                  class="form-input"
                  placeholder="Enter current password"
                  autocomplete="current-password">
              </label>

              <label class="form-group">
                New Password
                <input
                  id="new-password"
                  v-model="passwordChange.new"
                  type="password"
                  class="form-input"
                  placeholder="Enter new password"
                  autocomplete="new-password">
              </label>

              <label class="form-group">
                Confirm New Password
                <input
                  id="confirm-password"
                  v-model="passwordChange.confirm"
                  type="password"
                  class="form-input"
                  placeholder="Confirm new password"
                  autocomplete="new-password">
              </label>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Update Password</button>
              </div>
            </form>
          </section>
        </div>
      </article>
    </section>

    <!-- Notifications -->
    <section
      v-show="activeTab === 'notifications'" class="settings-section"
      aria-labelledby="notifications-heading">
      <article class="section-card">
        <header class="section-header">
          <h2 id="notifications-heading" class="section-title">Notification Preferences</h2>
          <p class="section-description">Choose what notifications you want to receive</p>
        </header>
        <div class="section-content">

          <section aria-labelledby="email-notif-heading">
            <div class="notification-group-header">
              <h3 id="email-notif-heading" class="notification-group-title">Email Notifications</h3>
              <div class="toggle-all">
                <span class="toggle-all-label">{{ allEmailEnabled ? 'Disable all' : 'Enable all'
                }}</span>
                <label class="toggle-switch" for="toggle-all-email">
                  <input
                    id="toggle-all-email" type="checkbox" :checked="allEmailEnabled"
                    @change="toggleAllEmail">
                  <span class="toggle-slider" aria-hidden="true" />
                  <span class="visually-hidden">{{ allEmailEnabled ? 'Disable' : 'Enable' }} all
                    email notifications</span>
                </label>
              </div>
            </div>
            <ul class="notification-items">
              <li
                v-for="notif in emailNotifications" :key="notif.id"
                :class="['notification-item', { 'notification-item--enabled': notif.enabled }]">
                <div class="notification-info">
                  <strong class="notification-label">{{ notif.label }}</strong>
                  <p class="notification-description">{{ notif.description }}</p>
                </div>
                <label class="toggle-switch" :for="`email-notif-${notif.id}`">
                  <input :id="`email-notif-${notif.id}`" v-model="notif.enabled" type="checkbox">
                  <span class="toggle-slider" aria-hidden="true" />
                  <span class="visually-hidden">{{ notif.enabled ? 'Disable' : 'Enable' }} {{
                    notif.label }}</span>
                </label>
              </li>
            </ul>
          </section>

          <hr class="divider" aria-hidden="true">

          <section aria-labelledby="push-notif-heading">
            <div class="notification-group-header">
              <h3 id="push-notif-heading" class="notification-group-title">Push Notifications</h3>
              <div class="toggle-all">
                <span class="toggle-all-label">{{ allPushEnabled ? 'Disable all' : 'Enable all'
                }}</span>
                <label class="toggle-switch" for="toggle-all-push">
                  <input
                    id="toggle-all-push" type="checkbox" :checked="allPushEnabled"
                    @change="toggleAllPush">
                  <span class="toggle-slider" aria-hidden="true" />
                  <span class="visually-hidden">{{ allPushEnabled ? 'Disable' : 'Enable' }} all push
                    notifications</span>
                </label>
              </div>
            </div>
            <ul class="notification-items">
              <li
                v-for="notif in pushNotifications" :key="notif.id"
                :class="['notification-item', { 'notification-item--enabled': notif.enabled }]">
                <div class="notification-info">
                  <strong class="notification-label">{{ notif.label }}</strong>
                  <p class="notification-description">{{ notif.description }}</p>
                </div>
                <label class="toggle-switch" :for="`push-notif-${notif.id}`">
                  <input :id="`push-notif-${notif.id}`" v-model="notif.enabled" type="checkbox">
                  <span class="toggle-slider" aria-hidden="true" />
                  <span class="visually-hidden">{{ notif.enabled ? 'Disable' : 'Enable' }} {{
                    notif.label }}</span>
                </label>
              </li>
            </ul>
          </section>

          <hr class="divider" aria-hidden="true">

          <section aria-labelledby="sms-notif-heading">
            <div class="notification-group-header">
              <h3 id="sms-notif-heading" class="notification-group-title">SMS Notifications</h3>
              <div class="toggle-all">
                <span class="toggle-all-label">{{ allSmsEnabled ? 'Disable all' : 'Enable all'
                }}</span>
                <label class="toggle-switch" for="toggle-all-sms">
                  <input
                    id="toggle-all-sms" type="checkbox" :checked="allSmsEnabled"
                    @change="toggleAllSms">
                  <span class="toggle-slider" aria-hidden="true" />
                  <span class="visually-hidden">{{ allSmsEnabled ? 'Disable' : 'Enable' }} all SMS
                    notifications</span>
                </label>
              </div>
            </div>
            <ul class="notification-items">
              <li
                v-for="notif in smsNotifications" :key="notif.id"
                :class="['notification-item', { 'notification-item--enabled': notif.enabled }]">
                <div class="notification-info">
                  <strong class="notification-label">{{ notif.label }}</strong>
                  <p class="notification-description">{{ notif.description }}</p>
                </div>
                <label class="toggle-switch" :for="`sms-notif-${notif.id}`">
                  <input :id="`sms-notif-${notif.id}`" v-model="notif.enabled" type="checkbox">
                  <span class="toggle-slider" aria-hidden="true" />
                  <span class="visually-hidden">{{ notif.enabled ? 'Disable' : 'Enable' }} {{
                    notif.label }}</span>
                </label>
              </li>
            </ul>
          </section>

        </div>
      </article>
    </section>

    <!-- Preferences -->
    <section
      v-show="activeTab === 'preferences'" class="settings-section"
      aria-labelledby="preferences-heading">
      <article class="section-card">
        <header class="section-header">
          <h2 id="preferences-heading" class="section-title">Application Preferences</h2>
          <p class="section-description">Customize your application experience</p>
        </header>
        <div class="section-content">
          <section aria-labelledby="schedule-prefs-heading">
            <h3 id="schedule-prefs-heading" class="subsection-title">Schedule Preferences</h3>

            <form class="form-group-section">
              <label class="form-group">
                Default Schedule View
                <select
                  id="default-schedule-view"
                  v-model="preferences.defaultScheduleView"
                  class="form-select">
                  <option value="day">Day View</option>
                  <option value="week">Week View</option>
                  <option value="month">Month View</option>
                </select>
                <span class="help-text">Choose which view appears when you open the schedule
                  page</span>
              </label>

              <label class="form-group">
                Week Start Day
                <select
                  id="week-start-day"
                  v-model="preferences.weekStartDay"
                  class="form-select">
                  <option value="0">Sunday</option>
                  <option value="1">Monday</option>
                </select>
                <span class="help-text">Select which day starts the week in calendar views</span>
              </label>
            </form>
          </section>

          <hr class="divider" aria-hidden="true">

          <section aria-labelledby="regional-prefs-heading">
            <h3 id="regional-prefs-heading" class="subsection-title">Regional Settings</h3>

            <form class="form-group-section">
              <label class="form-group">
                Language
                <select
                  id="language"
                  v-model="preferences.language"
                  class="form-select">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </label>

              <label class="form-group">
                Timezone
                <select
                  id="timezone"
                  v-model="preferences.timezone"
                  class="form-select">
                  <option value="PST">Pacific Time (PST)</option>
                  <option value="MST">Mountain Time (MST)</option>
                  <option value="CST">Central Time (CST)</option>
                  <option value="EST">Eastern Time (EST)</option>
                </select>
              </label>

              <label class="form-group">
                Date Format
                <select
                  id="date-format"
                  v-model="preferences.dateFormat"
                  class="form-select">
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </label>

              <label class="form-group">
                Time Format
                <select
                  id="time-format"
                  v-model="preferences.timeFormat"
                  class="form-select">
                  <option value="12h">12-hour (AM/PM)</option>
                  <option value="24h">24-hour</option>
                </select>
              </label>

              <label class="form-group">
                Currency
                <select
                  id="currency"
                  v-model="preferences.currency"
                  class="form-select">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </label>

              <label class="form-group">
                Distance Unit
                <select
                  id="distance-unit"
                  v-model="preferences.distanceUnit"
                  class="form-select">
                  <option value="miles">Miles</option>
                  <option value="kilometers">Kilometers</option>
                </select>
              </label>
            </form>
          </section>

          <hr class="divider" aria-hidden="true">

          <section aria-labelledby="display-settings-heading">
            <h3 id="display-settings-heading" class="subsection-title">Display Settings</h3>

            <ul class="preferences-list">
              <li class="preference-item">
                <div class="preference-info">
                  <strong class="preference-label">Dark Mode</strong>
                  <p class="preference-description">Use dark theme across the application</p>
                </div>
                <label class="toggle-switch" for="dark-mode">
                  <input id="dark-mode" v-model="preferences.darkMode" type="checkbox">
                  <span class="toggle-slider" aria-hidden="true" />
                  <span class="visually-hidden">{{ preferences.darkMode ? 'Disable' : 'Enable' }}
                    dark mode</span>
                </label>
              </li>

              <li class="preference-item">
                <div class="preference-info">
                  <strong class="preference-label">Compact View</strong>
                  <p class="preference-description">Show more information in less space</p>
                </div>
                <label class="toggle-switch" for="compact-view">
                  <input id="compact-view" v-model="preferences.compactView" type="checkbox">
                  <span class="toggle-slider" aria-hidden="true" />
                  <span class="visually-hidden">{{ preferences.compactView ? 'Disable' : 'Enable' }}
                    compact view</span>
                </label>
              </li>

              <li class="preference-item">
                <div class="preference-info">
                  <strong class="preference-label">Show Tooltips</strong>
                  <p class="preference-description">Display helpful tooltips when hovering</p>
                </div>
                <label class="toggle-switch" for="show-tooltips">
                  <input id="show-tooltips" v-model="preferences.showTooltips" type="checkbox">
                  <span class="toggle-slider" aria-hidden="true" />
                  <span class="visually-hidden">{{ preferences.showTooltips ? 'Disable' : 'Enable'
                  }} tooltips</span>
                </label>
              </li>
            </ul>
          </section>
        </div>
      </article>
    </section>

    <!-- Security -->
    <section
      v-show="activeTab === 'security'" class="settings-section"
      aria-labelledby="security-heading">
      <article class="section-card">
        <header class="section-header">
          <h2 id="security-heading" class="section-title">Security Settings</h2>
          <p class="section-description">Manage your account security</p>
        </header>
        <div class="section-content">
          <article class="security-item">
            <div class="security-info">
              <h3 class="security-label">Two-Factor Authentication</h3>
              <p class="security-description">Add an extra layer of security to your account</p>
              <span class="security-status enabled">
                <span class="status-dot" aria-hidden="true" />
                <span>Enabled</span>
              </span>
            </div>
            <button type="button" class="btn btn-secondary">Configure</button>
          </article>

          <hr class="divider" aria-hidden="true">

          <article class="security-item">
            <div class="security-info">
              <h3 class="security-label">Active Sessions</h3>
              <p class="security-description">Manage your active login sessions</p>
            </div>
            <button type="button" class="btn btn-secondary">View Sessions</button>
          </article>

          <hr class="divider" aria-hidden="true">

          <article class="security-item">
            <div class="security-info">
              <h3 class="security-label">Login History</h3>
              <p class="security-description">View recent login activity</p>
            </div>
            <button type="button" class="btn btn-secondary">View History</button>
          </article>

          <hr class="divider" aria-hidden="true">

          <section aria-labelledby="security-prefs-heading">
            <h3 id="security-prefs-heading" class="subsection-title">Security Preferences</h3>

            <ul class="preferences-list">
              <li class="preference-item">
                <div class="preference-info">
                  <strong class="preference-label">Require Password on Sensitive Actions</strong>
                  <p class="preference-description">Ask for password before critical operations</p>
                </div>
                <label class="toggle-switch" for="require-password">
                  <input
                    id="require-password" v-model="securitySettings.requirePassword"
                    type="checkbox">
                  <span class="toggle-slider" aria-hidden="true" />
                  <span class="visually-hidden">{{ securitySettings.requirePassword ? 'Disable' :
                    'Enable' }} password requirement</span>
                </label>
              </li>

              <li class="preference-item">
                <div class="preference-info">
                  <strong class="preference-label">Session Timeout</strong>
                  <p class="preference-description">Auto-logout after period of inactivity</p>
                </div>
                <label for="session-timeout" class="visually-hidden">Session timeout
                  duration</label>
                <select
                  id="session-timeout" v-model="securitySettings.sessionTimeout"
                  class="form-select compact">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="0">Never</option>
                </select>
              </li>
            </ul>
          </section>
        </div>
      </article>
    </section>

    <!-- Integrations -->
    <section
      v-show="activeTab === 'integrations'" class="settings-section"
      aria-labelledby="integrations-heading">
      <article class="section-card">
        <header class="section-header">
          <h2 id="integrations-heading" class="section-title">Integrations</h2>
          <p class="section-description">Connect with third-party services</p>
        </header>
        <div class="section-content">
          <ul class="integrations-grid">
            <li v-for="integration in integrations" :key="integration.id" class="integration-card">
              <div class="integration-icon" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </div>
              <div class="integration-info">
                <h3 class="integration-name">{{ integration.name }}</h3>
                <p class="integration-description">{{ integration.description }}</p>
                <span
                  class="integration-status"
                  :class="integration.connected ? 'connected' : 'disconnected'">
                  <span class="status-dot" aria-hidden="true" />
                  <span>{{ integration.connected ? 'Connected' : 'Not Connected' }}</span>
                </span>
              </div>
              <button
                type="button"
                :class="['btn', integration.connected ? 'btn-secondary' : 'btn-primary']"
                :aria-label="`${integration.connected ? 'Disconnect from' : 'Connect to'} ${integration.name}`"
                @click="toggleIntegration(integration.id)">
                {{ integration.connected ? 'Disconnect' : 'Connect' }}
              </button>
            </li>
          </ul>
        </div>
      </article>
    </section>

    <!-- Billing -->
    <section
      v-show="activeTab === 'billing'" class="settings-section"
      aria-labelledby="billing-heading">
      <article class="section-card">
        <header class="section-header">
          <h2 id="billing-heading" class="section-title">Billing & Subscription</h2>
          <p class="section-description">Manage your subscription and payment methods</p>
        </header>
        <div class="section-content">
          <article class="current-plan">
            <header class="plan-header">
              <div>
                <h3 class="plan-name">Professional Plan</h3>
                <p class="plan-price">$99/month</p>
              </div>
              <button type="button" class="btn btn-primary">Upgrade Plan</button>
            </header>
            <ul class="plan-features">
              <li class="plan-feature">
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true" class="feature-icon">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Unlimited Drivers</span>
              </li>
              <li class="plan-feature">
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true" class="feature-icon">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Unlimited Routes</span>
              </li>
              <li class="plan-feature">
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true" class="feature-icon">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Advanced Analytics</span>
              </li>
              <li class="plan-feature">
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true" class="feature-icon">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>24/7 Support</span>
              </li>
            </ul>
          </article>

          <hr class="divider" aria-hidden="true">

          <section aria-labelledby="payment-method-heading">
            <h3 id="payment-method-heading" class="subsection-title">Payment Method</h3>
            <article class="payment-method">
              <div class="card-info">
                <div class="card-icon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                    viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <div class="card-details">
                  <p class="card-type">Visa ending in 4242</p>
                  <p class="card-expiry">Expires 12/2025</p>
                </div>
              </div>
              <button type="button" class="btn btn-secondary">Update</button>
            </article>
          </section>

          <hr class="divider" aria-hidden="true">

          <section aria-labelledby="billing-history-heading">
            <h3 id="billing-history-heading" class="subsection-title">Billing History</h3>
            <ul class="billing-history">
              <li v-for="invoice in billingHistory" :key="invoice.id" class="invoice-item">
                <div class="invoice-info">
                  <p class="invoice-date">{{ invoice.date }}</p>
                  <p class="invoice-description">{{ invoice.description }}</p>
                </div>
                <p class="invoice-amount">${{ invoice.amount }}</p>
                <button
                  type="button" class="btn btn-secondary btn-small"
                  :aria-label="`Download invoice from ${invoice.date}`">Download</button>
              </li>
            </ul>
          </section>
        </div>
      </article>
    </section>

    <!-- Advanced -->
    <section
      v-show="activeTab === 'advanced'" class="settings-section"
      aria-labelledby="advanced-heading">
      <article class="section-card">
        <header class="section-header">
          <h2 id="advanced-heading" class="section-title">Advanced Settings</h2>
          <p class="section-description">System and data management options</p>
        </header>
        <div class="section-content">
          <article class="advanced-item">
            <div class="advanced-info">
              <h3 class="advanced-label">Export Data</h3>
              <p class="advanced-description">Download all your data in CSV format</p>
            </div>
            <button type="button" class="btn btn-secondary">Export</button>
          </article>

          <hr class="divider" aria-hidden="true">

          <article class="advanced-item">
            <div class="advanced-info">
              <h3 class="advanced-label">Import Data</h3>
              <p class="advanced-description">Import drivers, routes, or vehicles from CSV</p>
            </div>
            <button type="button" class="btn btn-secondary">Import</button>
          </article>

          <hr class="divider" aria-hidden="true">

          <article class="advanced-item">
            <div class="advanced-info">
              <h3 class="advanced-label">API Access</h3>
              <p class="advanced-description">Generate API keys for integrations</p>
            </div>
            <button type="button" class="btn btn-secondary">Manage API Keys</button>
          </article>

          <hr class="divider" aria-hidden="true">

          <article class="advanced-item">
            <div class="advanced-info">
              <h3 class="advanced-label">Webhooks</h3>
              <p class="advanced-description">Configure webhooks for real-time updates</p>
            </div>
            <button type="button" class="btn btn-secondary">Configure</button>
          </article>

          <hr class="divider" aria-hidden="true">

          <section aria-labelledby="danger-zone-heading">
            <h3 id="danger-zone-heading" class="subsection-title danger-zone-title">Danger Zone</h3>

            <div class="danger-zone">
              <article class="danger-item">
                <div class="danger-info">
                  <h4 class="danger-label">Clear All Data</h4>
                  <p class="danger-description">Permanently delete all routes, drivers, and vehicles
                  </p>
                </div>
                <button type="button" class="btn btn-danger">Clear Data</button>
              </article>

              <hr class="divider" aria-hidden="true">

              <article class="danger-item">
                <div class="danger-info">
                  <h4 class="danger-label">Delete Account</h4>
                  <p class="danger-description">Permanently delete your account and all data</p>
                </div>
                <button type="button" class="btn btn-danger">Delete Account</button>
              </article>
            </div>
          </section>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const logoFileInput = ref(null)
const activeTab = ref('company')

const tabs = [
  { id: 'company', label: 'Company' },
  { id: 'profile', label: 'Profile' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'security', label: 'Security' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'billing', label: 'Billing' },
  { id: 'advanced', label: 'Advanced' },
]

const companySettings = reactive({
  name: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
  description: '',
  logoUrl: null
})

const adminProfile = reactive({
  name: '',
  email: '',
  phone: '',
  role: 'Administrator',
  avatarUrl: null
})

const passwordChange = reactive({
  current: '',
  new: '',
  confirm: ''
})

const emailNotifications = reactive([
  { id: 1, label: 'Maintenance Updates', description: 'Get notified when maintenance is completed', enabled: false },
  { id: 2, label: 'Driver Assignments', description: 'When drivers are assigned to routes', enabled: false },
  { id: 3, label: 'Vehicle Maintenance', description: 'Reminders for scheduled vehicle maintenance', enabled: false },
  { id: 4, label: 'Weekly Reports', description: 'Summary of weekly performance', enabled: false }
])

const pushNotifications = reactive([
  { id: 1, label: 'Route Delays', description: 'When routes are running behind schedule', enabled: false },
  { id: 2, label: 'Failed Maintenance', description: 'When maintenance job fails', enabled: false },
  { id: 3, label: 'New Messages', description: 'When you receive new messages', enabled: false }
])

const smsNotifications = reactive([
  { id: 1, label: 'Critical Alerts', description: 'Emergency notifications only', enabled: false },
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
  { id: 1, name: 'Google Maps', description: 'Route optimization and mapping', connected: true },
  { id: 2, name: 'Slack', description: 'Team notifications and updates', connected: false },
  { id: 3, name: 'QuickBooks', description: 'Accounting and invoicing', connected: false },
  { id: 4, name: 'Twilio', description: 'SMS notifications', connected: true },
  { id: 5, name: 'Zapier', description: 'Connect with 1000+ apps', connected: false },
  { id: 6, name: 'Stripe', description: 'Payment processing', connected: true },
])

const billingHistory = reactive([
  { id: 1, date: 'Dec 1, 2024', description: 'Professional Plan - Monthly', amount: 99 },
  { id: 2, date: 'Nov 1, 2024', description: 'Professional Plan - Monthly', amount: 99 },
  { id: 3, date: 'Oct 1, 2024', description: 'Professional Plan - Monthly', amount: 99 }
])

const allEmailEnabled = computed(() => emailNotifications.every(n => n.enabled))
const allPushEnabled = computed(() => pushNotifications.every(n => n.enabled))
const allSmsEnabled = computed(() => smsNotifications.every(n => n.enabled))

function toggleAllEmail() {
  const next = !allEmailEnabled.value
  emailNotifications.forEach(n => n.enabled = next)
}
function toggleAllPush() {
  const next = !allPushEnabled.value
  pushNotifications.forEach(n => n.enabled = next)
}
function toggleAllSms() {
  const next = !allSmsEnabled.value
  smsNotifications.forEach(n => n.enabled = next)
}

const { companyLogo, uploadLogo } = useOrganization()

function triggerLogoUpload() {
  logoFileInput.value?.click()
}

async function handleLogoUpload(event) {
  const input = event.target
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    companyLogo.value = e.target?.result
  }
  reader.readAsDataURL(file)

  try {
    await uploadLogo(file)
  } catch (err) {
    console.error('Logo upload failed:', err)
  }
}

// Load saved settings on mount
onMounted(async () => {
  try {
    const { data } = await $fetch('/api/auth/get-session')
    if (data?.user) {
      adminProfile.name = data.user.name || ''
      adminProfile.email = data.user.email || ''
    }
  } catch (err) {
    console.error('Could not load session:', err)
  }
  if (!import.meta.client) return
  try {
    const savedLogo = localStorage.getItem('routeready-logo')
    if (savedLogo) companyLogo.value = savedLogo

    const savedSettings = localStorage.getItem('routeready-settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)

      if (parsed.preferences) Object.assign(preferences, parsed.preferences)
      if (parsed.company) Object.assign(companySettings, parsed.company)
      if (parsed.admin) Object.assign(adminProfile, parsed.admin)
      if (parsed.security) Object.assign(securitySettings, parsed.security)

      if (parsed.notifications) {
        parsed.notifications.email?.forEach((notif, index) => {
          if (emailNotifications[index]) emailNotifications[index].enabled = notif.enabled
        })
        parsed.notifications.push?.forEach((notif, index) => {
          if (pushNotifications[index]) pushNotifications[index].enabled = notif.enabled
        })
        parsed.notifications.sms?.forEach((notif, index) => {
          if (smsNotifications[index]) smsNotifications[index].enabled = notif.enabled
        })
      }
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
})

function saveAllSettings() {
  if (!import.meta.client) return
  try {
    const allSettings = {
      company: companySettings,
      admin: adminProfile,
      notifications: {
        email: emailNotifications,
        push: pushNotifications,
        sms: smsNotifications,
      },
      preferences,
      security: securitySettings,
    }
    localStorage.setItem('routeready-settings', JSON.stringify(allSettings))
    localStorage.setItem('routeready-logo', companyLogo.value || '')
    alert('Settings saved successfully!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Failed to save settings. Please try again.')
  }
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

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Settings - RouteReady',
  meta: [
    { name: 'description', content: 'Manage your settings' }
  ]
})
</script>

<style scoped>
/* Accessibility */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.settings-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  flex-basis: 100%;
}

.page-subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 1rem;
  flex: 1;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-small.btn-secondary {
  border: 2px solid var(--text-secondary);
  background: var(--bg-primary);
  color: var(--text-primary);
}

.btn-small.btn-secondary:hover {
  background: var(--button-primary);
  border-color: var(--button-primary);
  color: white;
}

/* Settings Tabs */
.settings-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex: 1 1 auto;
  justify-content: center;
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
.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-start;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-group.full-width {
  grid-column: 1 / -1;
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

.help-text {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 400;
}

/* File Upload */
.file-upload-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-upload-area .btn {
  align-self: flex-start;
  border: 2px solid var(--text-secondary);
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
  margin: 0;
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
  flex-shrink: 0;
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
  gap: 1rem;
}

.avatar-actions .btn {
  align-self: flex-start;
  border: 2px solid var(--text-secondary);
}

/* Divider */
.divider {
  height: 1px;
  background: var(--input-border);
  margin: 2rem 0;
  border: none;
}

.subsection-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
}

/* Notifications */
.notification-group-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.notification-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.toggle-all {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-all-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.notification-item {
  transition: background 0.2s, border-color 0.2s;
  border: 2px solid transparent;
  border-radius: 8px;
}

.notification-item--enabled {
  background: rgba(102, 126, 234, 0.08);
  border-color: rgba(102, 126, 234, 0.3);
}

.notification-items,
.preferences-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-item,
.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.notification-info,
.preference-info {
  flex: 1;
}

.notification-label,
.preference-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.notification-description,
.preference-description {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
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
  background-color: #ef4444;
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

input:checked+.toggle-slider {
  background-color: #10b981;
}

input:checked+.toggle-slider:before {
  transform: translateX(24px);
}

/* Security Items */
.security-item,
.advanced-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.security-info,
.advanced-info {
  flex: 1;
}

.security-label,
.advanced-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.security-description,
.advanced-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
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

.status-dot {
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
  list-style: none;
  padding: 0;
  margin: 0;
}

.integration-card {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.integration-card:hover {
  border-color: var(--button-primary);
}

.integration-icon {
  width: 48px;
  height: 48px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--button-primary);
  margin-bottom: 1rem;
}

.integration-info {
  margin-bottom: 1rem;
  flex: 1;
}

.integration-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.integration-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
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
  margin: 0 0 0.5rem 0;
}

.plan-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--button-primary);
  margin: 0;
}

.plan-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0;
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
  flex-shrink: 0;
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
  width: 48px;
  height: 48px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--button-primary);
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
  margin: 0;
}

.card-expiry {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0;
}

.billing-history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
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
  margin: 0 0 0.25rem 0;
}

.invoice-description {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0;
}

.invoice-amount {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 1rem 0 0;
}

/* Danger Zone */
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
  margin: 0 0 0.5rem 0;
}

.danger-description {
  font-size: 0.875rem;
  color: #b91c1c;
  margin: 0;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
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

  .profile-header-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .avatar-actions {
    width: 100%;
  }

  .avatar-actions .btn {
    width: 100%;
  }
}
</style>
<template>
  <div class="main-layout">
    <a href="#main-content"
      class="skip-link">Skip to main
      content</a>

    <!-- Sidebar Navigation -->
    <nav class="sidebar" role="navigation"
      aria-label="Main navigation">
      <div class="nav-header">
        <NuxtLink to="/" class="logo">
          RouteReady</NuxtLink>
      </div>

      <ul class="nav-menu">
        <li class="nav-item">
          <NuxtLink to="/" class="nav-link"
            :class="{ active: $route.path === '/' }">
            <span class="nav-icon">📊</span>
            Dashboard
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/drivers"
            class="nav-link"
            :class="{ active: $route.path.startsWith('/drivers') }">
            <span class="nav-icon">👥</span>
            Drivers
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/properties"
            class="nav-link"
            :class="{ active: $route.path.startsWith('/properties') }">
            <span class="nav-icon">🏢</span>
            Properties
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/routes"
            class="nav-link"
            :class="{ active: $route.path.startsWith('/routes') }">
            <span class="nav-icon">🗺️</span>
            Routes
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/schedules"
            class="nav-link"
            :class="{ active: $route.path.startsWith('/schedules') }">
            <span class="nav-icon">📅</span>
            Schedules
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/analytics"
            class="nav-link"
            :class="{ active: $route.path.startsWith('/analytics') }">
            <span class="nav-icon">📈</span>
            Analytics
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/logs"
            class="nav-link"
            :class="{ active: $route.path.startsWith('/logs') }">
            <span class="nav-icon">📋</span>
            Logs
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Main Content -->
    <main id="main-content"
      class="main-content" role="main">
      <slot />
    </main>
  </div>                                                                                                                                                                                                                                  
</template>
<template>
  <div class="home-container">
    <ThemeToggle />

    <main class="home-main">
      <section class="home-column home-left" aria-label="Brand introduction">
        <div class="home-content">
          <div class="logo-container">
            <img
              src="~/assets/images/routereadylogo.png"
              alt="RouteReady Logo"
              class="home-logo"
            >
          </div>
          <h1 class="title visually-hidden">RouteReady</h1>
          <p class="subtitle">Your complete route management solution</p>
        </div>
      </section>

      <section class="home-column home-right" aria-labelledby="welcome-heading">
        <article class="home-panel">
          <header>
            <h2 id="welcome-heading" class="panel-title">Welcome</h2>
            <p class="panel-description">Get started with RouteReady today</p>
          </header>

          <nav aria-label="Account actions" class="button-group">
            <NuxtLink to="/login" class="home-button primary">
              Login
            </NuxtLink>
            <NuxtLink to="/signup" class="home-button secondary">
              Sign Up
            </NuxtLink>
          </nav>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
useHead({
  title: 'Welcome - RouteReady',
  meta: [
    { name: 'description', content: 'RouteReady - Your complete route management solution' }
  ]
})
</script>

<style scoped>
.home-container {
  display: flex;
  min-height: 100vh;
}

.home-main {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.home-column {
  flex: 1;
}

.home-left {
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-on-gradient);
}

.home-content {
  text-align: center;
  padding: 2rem;
}

.logo-container {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.home-logo {
  width: 240px;
  height: auto;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Visually Hidden - Accessible to screen readers */
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

.title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  animation: fadeIn 1s ease-out 0.3s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  animation: fadeIn 1s ease-out 0.5s both;
  margin: 0;
  margin-top: -4.5rem;
}

.home-right {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
}

.home-panel {
  width: 100%;
  max-width: 400px;
  padding: 3rem 2rem;
  background: var(--bg-primary);
  border-radius: 8px;
  box-shadow: var(--shadow);
  text-align: center;
}

.home-panel header {
  margin-bottom: 2rem;
}

.panel-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-weight: 700;
}

.panel-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.home-button {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 700;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  letter-spacing: 0.025em;
}

/* Login Button - WCAG AAA Compliant */
.home-button.primary {
  background: #4338ca;
  color: #ffffff;
  border: 2px solid #4338ca;
  box-shadow: 0 4px 12px rgba(67, 56, 202, 0.3);
}

.home-button.primary:hover {
  background: #3730a3;
  border-color: #3730a3;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(67, 56, 202, 0.4);
}

.home-button.primary:focus {
  outline: 3px solid #4338ca;
  outline-offset: 3px;
}

/* Sign Up Button - WCAG AAA Compliant */
.home-button.secondary {
  background: #ffffff;
  color: #1e293b;
  border: 2px solid #1e293b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.home-button.secondary:hover {
  background: #f1f5f9;
  border-color: #0f172a;
  color: #0f172a;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.home-button.secondary:focus {
  outline: 3px solid #1e293b;
  outline-offset: 3px;
}

@media (max-width: 968px) {
  .home-main {
    flex-direction: column;
  }

  .home-column {
    min-height: 50vh;
  }

  .logo-container {
    margin-bottom: 0.75rem;
  }

  .home-logo {
    width: 180px;
  }

  .subtitle {
    font-size: 1.25rem;
    margin-top: -3.5rem;
  }

  .home-panel {
    margin: 2rem;
  }

  .home-button {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .logo-container {
    margin-bottom: 0.5rem;
  }

  .home-logo {
    width: 140px;
  }

  .subtitle {
    font-size: 1rem;
    margin-top: -2.5rem;
  }

  .panel-title {
    font-size: 1.5rem;
  }

  .panel-description {
    font-size: 1rem;
  }

  .home-button {
    font-size: 0.9375rem;
    padding: 0.875rem 1.75rem;
  }
}
</style>
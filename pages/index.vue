<template>
  <div class="home-container">
    <div class="home-column home-left">
      <div class="home-content">
        <h1 class="title">RouteReady</h1>
        <p class="subtitle">Your complete route management solution</p>
      </div>
    </div>

    <div class="home-column home-right">
      <div class="home-panel">
        <h2 class="panel-title">Welcome</h2>
        <p class="panel-description">Get started with RouteReady today</p>

        <div class="button-group">
          <NuxtLink to="/login" class="home-button primary">
            Login
          </NuxtLink>
          <NuxtLink to="/signup" class="home-button secondary">
            Sign Up
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  min-height: 100vh;
}

.home-column {
  flex: 1;
}

.home-left {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.home-content {
  text-align: center;
  padding: 2rem;
}

.title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
}

.home-right {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.home-panel {
  width: 100%;
  max-width: 400px;
  padding: 3rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.panel-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.panel-description {
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 2rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.home-button {
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.home-button.primary {
  background: #667eea;
  color: white;
}

.home-button.primary:hover {
  background: #5568d3;
}

.home-button.secondary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.home-button.secondary:hover {
  background: #667eea;
  color: white;
}
</style>
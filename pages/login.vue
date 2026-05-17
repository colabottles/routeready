<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from 'nuxt/app'
import type { AuthClient } from '~/types/auth'

const nuxtApp = useNuxtApp()
const $authClient = nuxtApp.$authClient as unknown as AuthClient
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await $authClient.signIn.email({
      email: email.value,
      password: password.value,
    })

    if (result?.error) {
      errorMessage.value = result.error.message || 'Login failed'
      return
    }

    await router.push('/dashboard')
  } catch (err) {
    const error = err as Error
    errorMessage.value = error?.message || 'An unexpected error occurred'
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <ThemeToggle />

    <div class="login-column login-left">
      <div class="login-content">
        <div class="logo-container">
          <img
            src="~/assets/images/routereadylogo.png"
            alt="RouteReady Logo"
            class="login-logo">
        </div>
        <h1 class="title visually-hidden">RouteReady</h1>
      </div>
    </div>

    <div class="login-column login-right">
      <form class="login-form" @submit.prevent="handleLogin">
        <h2 class="form-title">Log In</h2>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required>
          <small>Your work email address</small>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required>
            <button
              type="button"
              class="toggle-password"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword">
              <svg
v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              <svg
v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
          <small>Must be 8-16 characters</small>
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="isLoading">
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>

        <div style="margin-top: 1rem; text-align: center;">
          <a href="/signup">Don't have an account? Sign up</a>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.login-column {
  flex: 1;
}

.login-left {
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 2rem;
}

.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-container {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.login-logo {
  width: 240px;
  height: auto;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
}

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

.login-right {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  padding: 2rem;
}

.login-form {
  width: 100%;
  max-width: 440px;
  background: var(--bg-primary);
  padding: 3rem 2.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.error-message {
  background: var(--error-bg);
  border: 2px solid var(--error-border);
  color: var(--error-text);
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-group input {
  padding: 0.875rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input::placeholder {
  color: var(--text-muted);
}

.form-group small {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: var(--text-secondary);
}

.toggle-password:focus-visible {
  outline: 3px solid #818cf8;
  outline-offset: 2px;
  border-radius: 4px;
}

.toggle-password:hover {
  color: var(--text-primary);
}

.login-button {
  padding: 1rem 2rem;
  background: #4338ca;
  color: #ffffff;
  border: 2px solid #4338ca;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;
  letter-spacing: 0.025em;
}

.login-button:hover:not(:disabled) {
  background: #3730a3;
  border-color: #3730a3;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(67, 56, 202, 0.3);
}

.login-button:focus {
  outline: 3px solid #818cf8;
  outline-offset: 3px;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

a {
  color: var(--link-color);
  text-decoration: none;
  font-weight: 600;
}

a:hover {
  color: var(--link-hover);
  text-decoration: underline;
}

@media (max-width: 968px) {
  .login-container {
    flex-direction: column;
  }

  .login-left {
    min-height: 40vh;
  }

  .login-logo {
    width: 200px;
  }

  .login-form {
    padding: 2.5rem 2rem;
  }
}

@media (max-width: 480px) {
  .login-logo {
    width: 160px;
  }

  .login-form {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.75rem;
  }

  .login-button {
    font-size: 1rem;
  }
}
</style>
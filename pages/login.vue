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
            class="login-logo"
          >
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
            required
          >
          <small>Your work email address</small>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
          >
          <small>Must be 8-16 characters</small>
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="isLoading"
        >
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
.login-page {
  min-height: 100vh;
  display: flex;
}

.login-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
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
  animation: fadeInDown 0.8s ease-out;
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

.login-left {
  flex: 1;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 2rem;
}

.logo-section {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.logo {
  width: 120px;
  height: auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.brand-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}

.brand-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
  text-align: center;
  max-width: 400px;
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  padding: 2rem;
}

.login-form-container {
  width: 100%;
  max-width: 440px;
  background: var(--bg-primary);
  padding: 3rem 2.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.form-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
  text-align: center;
  font-weight: 500;
}

.error-message {
  background: var(--error-bg);
  border: 2px solid var(--error-border);
  color: var(--error-text);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: var(--text-primary);
  cursor: pointer;
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.forgot-link {
  font-size: 0.9375rem;
  color: #4338ca;
  text-decoration: none;
  font-weight: 600;
}

.forgot-link:hover {
  color: #3730a3;
  text-decoration: underline;
}

/* Submit Button - WCAG AAA Compliant */
.submit-button {
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

.submit-button:hover:not(:disabled) {
  background: #3730a3;
  border-color: #3730a3;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(67, 56, 202, 0.3);
}

.submit-button:focus {
  outline: 3px solid #4338ca;
  outline-offset: 3px;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.signup-prompt {
  margin-top: 2rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid var(--input-border);
}

.signup-prompt p {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

.signup-link {
  color: #4338ca;
  text-decoration: none;
  font-weight: 700;
}

.signup-link:hover {
  color: #3730a3;
  text-decoration: underline;
}

@media (max-width: 968px) {
  .login-container {
    flex-direction: column;
  }

  .login-left {
    min-height: 40vh;
  }

  .logo {
    width: 100px;
  }

  .brand-title {
    font-size: 2.5rem;
  }

  .brand-subtitle {
    font-size: 1.125rem;
  }

  .login-form-container {
    padding: 2.5rem 2rem;
  }
}

@media (max-width: 480px) {
  .logo {
    width: 80px;
  }

  .brand-title {
    font-size: 2rem;
  }

  .brand-subtitle {
    font-size: 1rem;
  }

  .login-form-container {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.75rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .submit-button {
    font-size: 1rem;
  }
}
</style>
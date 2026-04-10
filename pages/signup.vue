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
const name = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSignup = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await $authClient.signUp.email({
      email: email.value,
      password: password.value,
      name: name.value,
    })

    if (result?.error) {
      errorMessage.value = result.error.message || 'Signup failed'
      return
    }

    successMessage.value = 'Account created! Redirecting to login...'
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (err) {
    const error = err as Error
    errorMessage.value = error?.message || 'An unexpected error occurred'
    console.error('Signup error:', err)
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
            class="signup-logo"
          >
        </div>
        <h1 class="title visually-hidden">RouteReady</h1>
      </div>
    </div>

    <div class="login-column login-right">
      <form class="login-form" @submit.prevent="handleSignup">
        <h2 class="form-title">Sign Up</h2>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
          >
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
            minlength="8"
            maxlength="16"
          >
          <small>Must be 8-16 characters</small>
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </button>

        <div style="margin-top: 1rem; text-align: center;">
          <a href="/login">Already have an account? Log in</a>
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

.signup-logo {
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

.success-message {
  background: var(--success-bg);
  border: 2px solid var(--success-border);
  color: var(--success-text);
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

.form-group small {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 500;
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

  .signup-logo {
    width: 200px;
  }

  .login-form {
    padding: 2.5rem 2rem;
  }
}

@media (max-width: 480px) {
  .signup-logo {
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
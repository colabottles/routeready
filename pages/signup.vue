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
        <h1 class="title">RouteReady</h1>
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
.error-message {
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: var(--error-bg);
  border: 1px solid var(--error-border);
  border-radius: 4px;
  color: var(--error-text);
}

.success-message {
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: var(--success-bg);
  border: 1px solid var(--success-border);
  border-radius: 4px;
  color: var(--success-text);
}

.login-container {
  display: flex;
  min-height: 100vh;
}

.login-column {
  flex: 1;
}

.login-left {
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-on-gradient);
}

.login-content {
  text-align: center;
}

.title {
  font-size: 3rem;
  font-weight: bold;
}

.login-right {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: var(--bg-primary);
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.form-title {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-primary);
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--input-focus);
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background: var(--button-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.login-button:hover:not(:disabled) {
  background: var(--button-primary-hover);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
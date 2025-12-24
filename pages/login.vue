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
    <div class="login-column login-left">
      <div class="login-content">
        <h1 class="title">RouteReady</h1>
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
.error-message {
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
}

.login-container {
  display: flex;
  min-height: 100vh;
}

.login-column {
  flex: 1;
}

.login-left {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
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
  background: #f5f5f5;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-title {
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #888;
  font-size: 0.875rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.login-button:hover:not(:disabled) {
  background: #5568d3;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
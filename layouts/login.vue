<template>
  <login-layout>
    <div class="login-container">
      <div class="login-column login-left">
        <div class="login-content">
          <img src="/assets/images/logo.png" alt="Company Logo" class="logo">
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
              aria-describedby="email-help"
            >
            <small id="email-help">Your work email address</small>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              v-model="password"
              type="password" 
              required
              aria-describedby="password-help"
            >
            <small id="password-help">Must be at least 8-16 characters</small>
          </div>

          <button type="submit" class="login-button" :disabled="isLoading">
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  </login-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from 'nuxt/app'

definePageMeta({
  layout: 'login'
})

const nuxtApp = useNuxtApp()
const $authClient = nuxtApp.$authClient as any
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

    if (result.error) {
      errorMessage.value = result.error.message || 'Login failed'
      return
    }

    // Successfully logged in
    await router.push('/dashboard')
  } catch (err) {
    const error = err as Error
    errorMessage.value = error.message || 'An unexpected error occurred'
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.error-message {
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
}
</style>
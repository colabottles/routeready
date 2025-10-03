<template>
  <login-layout>
    <div class="login-container">
      <div class="login-column login-left">
        <div class="login-content">
          <img src="/assets/images/logo.png"
            alt="Company Logo" class="logo">
          <h1 class="title">RouteReady
          </h1>
        </div>
      </div>
      <div class="login-column login-right">
        <form class="login-form"
          @submit.prevent="handleLogin">
          <h2 class="form-title">Log In</h2>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="email"
              type="email" required
              aria-describedby="email-help">
            <small id="email-help">Your work
              email address</small>
          </div>
          <div class="form-group">
            <label
              for="password">Password</label>
            <input id="password"
              v-model="password"
              type="password" required
              aria-describedby="password-help">
            <small id="password-help">Must be
              at least 8-16 characters</small>
          </div>
          <button type="submit"
            class="login-button">Sign
            In</button>
        </form>
      </div>
    </div>
  </login-layout>
</template>

<script setup>
definePageMeta({
    layout: 'login'
})

const { data, error } = await authClient.signIn.email({
  email: "me@routeready.com",
  password: "&9?(2}<q^PS>EERY",
  callbackURL: "/dashboard",
  rememberMe: false
}, {
    //callbacks
})
</script>
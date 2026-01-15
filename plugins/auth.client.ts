import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000"
});

export const requestPasswordReset = authClient.resetPassword;

export default defineNuxtPlugin(() => {
  return {
    provide: {
      authClient
    }
  };
});
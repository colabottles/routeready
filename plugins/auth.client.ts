import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000" // Match your auth.ts baseURL
});

export const requestPasswordReset = authClient.forgetPassword;

export default defineNuxtPlugin(() => {
  return {
    provide: {
      authClient
    }
  };
});
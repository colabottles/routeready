import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: window.location.origin
});

export const requestPasswordReset = authClient.resetPassword;

export default defineNuxtPlugin(() => {
  return {
    provide: {
      authClient
    }
  };
});
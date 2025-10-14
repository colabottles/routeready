import { createAuthClient } from "better-auth/vue";

export default defineNuxtPlugin(() => {
  const authClient = createAuthClient({
    baseURL: "http://localhost:3000" // Match your auth.ts baseURL
  });

  return {
    provide: {
      authClient
    }
  };
});
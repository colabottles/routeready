// types/auth.d.ts
import type { createAuthClient } from "better-auth/vue";

type AuthClient = ReturnType<typeof createAuthClient>;

declare module '#app' {
  interface NuxtApp {
    $authClient: AuthClient;
  }
}

export {};
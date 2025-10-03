import { betterAuth } from "better-auth";
// import { Pool } from "pg";

export const auth = betterAuth({
  emailAndPassword: {    
    enabled: true,
    autoSignIn: false
  } 
  // baseURL: "http://localhost:3000",               // Base URL for the application
  // basePath?: "http://localhost:3000/utils/auth",  // API path prefix (default: "/api/auth")
  // secret?: "kPTEKCKkXzDEQHSqvyXKWraRo4TJzwul",    // Encryption/signing secret
  // appName?: "RouteReady",                         // Application name
  // database: prismaAdapter(prisma, {
  //   provider: "postgresql",
  // }),                         // Database configuration

  // emailAndPassword: {
  //   enabled: true,                        // Enable email/password auth
  //   disableSignUp?: true,                 // Disable new registrations
  //   requireEmailVerification?: true,      // Require email verification
  //   minPasswordLength?: 8,                // Minimum password length (default: 8)
  //   maxPasswordLength?: 16,               // Maximum password length (default: 128)
  //   autoSignIn?: false,                   // Auto sign-in after registration
  //   revokeSessionsOnPasswordReset?: true, // Revoke sessions on reset
  // }
        
  // // Custom password handling
  // password?: {
  //   hash?: (password: string) => Promise<string>,
  //   verify?: (data: { hash: string; password: string }) => Promise<boolean>,
  // };
        
  // // Callbacks
  // sendResetPassword?: (data: { user: User; url: string; token: string }) => Promise<void>,
  // onPasswordReset?: (data: { user: User }) => Promise<void>,
  // },
})
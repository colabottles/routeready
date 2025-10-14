import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    // Configure your database connection
    // Example for PostgreSQL:
    // provider: "postgresql",
    // url: process.env.DATABASE_URL
  },
  emailAndPassword: {    
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 16,
  },
  secret: process.env.BETTER_AUTH_SECRET, // Add to .env
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
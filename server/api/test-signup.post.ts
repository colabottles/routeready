// server/api/test-signup.post.ts
// REMOVE THIS FILE IN PRODUCTION!
import { auth } from "../utils/auth";

export default defineEventHandler(async (event) => {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    throw createError({
      statusCode: 403,
      message: "Not available in production",
    });
  }

  const body = await readBody(event);

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: body.email || "test@routeready.com",
        password: body.password || "TestPass123!",
        name: body.name || "Test User",
      },
    });

    return {
      success: true,
      message: "Test user created",
      user: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create user",
    };
  }
});
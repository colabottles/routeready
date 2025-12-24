import { auth } from "../server/utils/auth";

async function generateSchema() {
  try {
    // This will log the SQL schema you need to run
    console.log("Run this SQL in your PostgreSQL database:");
    console.log(auth.api.getSchema());
  } catch (error) {
    console.error("Error generating schema:", error);
  }
}

generateSchema();
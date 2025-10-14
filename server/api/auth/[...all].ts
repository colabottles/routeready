import { auth } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  return auth.handler(toWebRequest(event));
});
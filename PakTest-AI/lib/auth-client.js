import { createAuthClient } from "better-auth/client";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const getApiBaseUrl = () => {
  const rawBaseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:5000/api").trim();
  const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");

  if (normalizedBaseUrl.endsWith("/api")) {
    return normalizedBaseUrl;
  }

  return `${normalizedBaseUrl}/api`;
};

export const authClient = createAuthClient({
  baseURL: getApiBaseUrl(),
  plugins: [
    expoClient({
      scheme: "paktest-ai",
      storage: SecureStore,
      storagePrefix: "paktest-ai",
    }),
  ],
});

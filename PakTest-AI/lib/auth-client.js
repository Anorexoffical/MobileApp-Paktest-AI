import { createAuthClient } from "better-auth/client";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? "",
  plugins: [
    expoClient({
      scheme: "paktest-ai",
      storage: SecureStore,
      storagePrefix: "paktest-ai",
    }),
  ],
});

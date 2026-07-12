import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { expo } from "@better-auth/expo";
import prisma from "../config/prisma.js";

console.log("GOOGLE_CLIENT_ID =", process.env.GOOGLE_CLIENT_ID);
console.log("BETTER_AUTH_URL  =", process.env.BETTER_AUTH_URL);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  plugins: [
    expo(),
  ],

  trustedOrigins: [
    "paktest-ai://",
    "exp://",
    "exp://**",
    "http://localhost:5000",
    "http://localhost:8081",
    "http://192.168.100.18:5000",
    "http://192.168.100.18:8081",
    process.env.BETTER_AUTH_URL,
    process.env.FRONTEND_URL,
  ].filter(Boolean),
});
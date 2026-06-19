// import dns from "node:dns";
// dns.setServers(["8.8.8.8", "8.8.4.4"]);
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("nest-bazaar-db");

export const auth = betterAuth({
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

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },

  plugins: [jwt()],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "buyer",
      },
      location: {
        type: "string",
        defaultValue: "",
      },
      status: {
        type: "string",
        defaultValue: "active",
      },
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
});
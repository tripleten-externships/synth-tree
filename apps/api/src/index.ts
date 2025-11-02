import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema";
import { prisma } from "@lib/prisma";
import { admin } from "./firebase";

async function start() {
  const server = new ApolloServer({
    schema,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
      let user = null;

      if (token) {
        try {
          const decoded = await admin.auth().verifyIdToken(token);
          user = {
            uid: decoded.uid,
            email: decoded.email,
            role: decoded.role || "user",
          };
        } catch (err) {
          console.warn("Invalid Firebase token:", err);
        }
      }

      return { user, prisma };
    },
  });

  console.log(`🚀 Server ready at ${url}`);
}

start();

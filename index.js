
import dotenv from "dotenv";
dotenv.config();
import "colors";
// _____________________________
import express from "express";
import { ApolloServer } from "apollo-server-express";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";

import "./mongoose/db.mjs";

import mongoose from "./mongoose/schema.mjs";
import prisma from "./prisma/db.mjs";

import { errorHandler, notFound } from "./utils/errorHandlers.mjs";
import schema from "./graphql/index.mjs";
// /
import { userAuth } from "./middlewares/userAuth.mjs";
//
const app = express();
app.use(userAuth);
app.use(express.json({ limit: "10mb" }));

const server = new ApolloServer({
  schema,
  // uploads: GraphQLUpload,
  uploads: false,
  context: ({ req }) => {
    const { isUserAuth, user } = req;
    // console.log({ isUserAuth, user });
    return {
      prisma,
      mongoose,
      isUserAuth,
      user,
    };
  },
});

app.use(`/graphql`, graphqlUploadExpress());

// Apply middleware to Express app
await server.start();

server.applyMiddleware({ app });

app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}${server.graphqlPath}`.green.bgWhite.bold
  );
});

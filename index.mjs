import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import prisma from "./prisma/db.mjs";

const app = express();

// Define GraphQL schema
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    profile: Profile
    posts: [Post!]!
    comments: [Comment!]!
    likes: [Like!]!
    createdAt: String!
    updatedAt: String!
  }

  type Profile {
    id: ID!
    bio: String
    user: User!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
    likes: [Like!]!
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    id: ID!
    content: String!
    post: Post!
    author: User!
    createdAt: String!
    updatedAt: String!
  }

  type Like {
    id: ID!
    user: User!
    post: Post!
    createdAt: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
    createPost(title: String!, content: String!, authorId: ID!): Post!
    createComment(content: String!, postId: ID!, authorId: ID!): Comment!
    createLike(userId: ID!, postId: ID!): Like!
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    users: async () => await prisma.user.findMany(),
    user: async (parent, args) =>
      await prisma.user.findUnique({ where: { id: parseInt(args.id) } }),
    posts: async () => await prisma.post.findMany(),
    post: async (parent, args) =>
      await prisma.post.findUnique({ where: { id: parseInt(args.id) } }),
  },
  Mutation: {
    createUser: async (parent, args) =>
      await prisma.user.create({
        data: {
          username: args.username,
          email: args.email,
          password: args.password,
        },
      }),
    createPost: async (parent, args) =>
      await prisma.post.create({
        data: {
          title: args.title,
          content: args.content,
          author: { connect: { id: parseInt(args.authorId) } },
        },
      }),
    createComment: async (parent, args) =>
      await prisma.comment.create({
        data: {
          content: args.content,
          post: { connect: { id: parseInt(args.postId) } },
          author: { connect: { id: parseInt(args.authorId) } },
        },
      }),
    createLike: async (parent, args) =>
      await prisma.like.create({
        data: {
          user: { connect: { id: parseInt(args.userId) } },
          post: { connect: { id: parseInt(args.postId) } },
        },
      }),
  },
};
// Initialize Express app

// Create Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Apply middleware to Express app
await server.start();
//
server.applyMiddleware({ app });

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
});

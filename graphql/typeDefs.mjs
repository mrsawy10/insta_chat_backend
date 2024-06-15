import user from "./user/typeDefs.mjs";
import post from "./post/typeDefs.mjs";
import country from "./country/typeDefs.mjs";
import follow from "./follow/typeDefs.mjs";
import { gql } from "apollo-server-express";

// scalar Upload
export default [
  gql`
    directive @userAuth on FIELD_DEFINITION
    scalar Upload

    type Query {
      _: String!
    }
    type Mutation {
      _: String!
    }
  `,
  user,
  ...post,
  country,
  follow,
];

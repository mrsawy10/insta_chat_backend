import user from "./typeDefs/user.mjs";
import post from "./typeDefs/post/index.mjs";
import country from "./typeDefs/country.mjs";
import follow from "./typeDefs/follow.mjs";
import { gql } from "apollo-server-express";

// scalar Upload
export default [
  gql`
    directive @userAuth on FIELD_DEFINITION
    directive @adminAuth on FIELD_DEFINITION
    
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

import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    
  }

  extend type Mutation {
  }



  type Follow {
    id: ID!
    followerId: ID!
    followingId: ID!
    follower: User!
    following: User!
    createdAt: String!
  }
`;

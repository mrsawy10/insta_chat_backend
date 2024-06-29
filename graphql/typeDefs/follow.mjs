import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getFollowing(query: String, offset: Int!, limit: Int!): [User!]! @userAuth
    getFollowers(query: String, offset: Int!, limit: Int!): [User!]! @userAuth
  }

  extend type Mutation {
    toggleFollow(userId: ID!): ToggleFollowResponse! @userAuth
  }

  type ToggleFollowResponse {
    followStatus: Boolean
    numFollowing: Int
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

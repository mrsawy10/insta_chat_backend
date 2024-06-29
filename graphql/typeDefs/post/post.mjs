import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getUserPosts(userId: ID!, postType: String, offset: Int, limit: Int): [Post!]! @userAuth
    getSinglePost(postId: ID!): Post! @userAuth
    getPosts(limit: Int!, offset: Int!): [Post!]!
  }
  extend type Mutation {
    createPost(postInput: PostInput!): Post @userAuth
    editPost(postInput: EditPostInput!): Post @userAuth
    deletePost(postId: ID!): ID! @userAuth
    like(postId: ID!): Boolean! @userAuth
  }
  input EditPostInput {
    id: ID!
    title: String!
    type: String!
  }
  input PostInput {
    title: String
    type: String!
    media: [Upload!]
  }
  type Post {
    id: ID!
    title: String
    type: String!
    postMedia: [PostMedia!]
    user: User!
    likes: Int!
    numComments: Int!
    createdAt: String!
    updatedAt: String!
    userId: ID!
    postLikes: [Like!]
  }
  type PostMedia {
    id: ID!
    postId: String!
    mediaId: String!
    media: Media
  }
  input KeywordInput {
    name: String!
  }
`;

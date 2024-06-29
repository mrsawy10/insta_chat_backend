import { gql } from "apollo-server-express";

// seeStory(storyId : ID!) : Boolean @userAuth
// commentStory(storyCommentInput: StoryCommentInput!): StoryComment! @userAuth
export default gql`
  extend type Query {
    getStories(offset: Int!, limit: Int!): [Story!]! @userAuth
    getSingleStory(storyId: ID!): Story! @userAuth
    getUserStories(offset: Int!, limit: Int! , userId: ID): [Story!]! @userAuth
    getSameUserStories(offset: Int!, limit: Int! ): [Story!]! @userAuth
    getStoryComments(storyId: ID!, mine: Boolean, offset: Int!, limit: Int!): [StoryComment!]!
      @userAuth
  }
  extend type Mutation {
    createStory(media: Upload!): Story! @userAuth
    deleteStory(storyId: ID!): ID! @userAuth
    toggleLikeStory(storyId: ID!): Boolean! @userAuth
  }

  type Story {
    id: ID!
    media: Media!
    user: User!
    liked: Boolean!
    seen: Boolean
    userId: ID!
    createdAt: String!
    expiredAt: String!
    updatedAt: String!
  }

  input StoryInput {
    media: Upload!
  }

  input StoryCommentInput {
    comment: String!
    storyId: ID!
  }

  type StoryComment {
    id: ID!
    comment: String!
    storyId: ID!
    story: Story!
    userId: ID!
    user: User!
    createdAt: String!
  }
`;

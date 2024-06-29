import { gql } from "apollo-server-express";
export default gql`
  extend type Query {
    checkUsername(username: String!): Boolean!
    Login(identifier: String!, password: String!): UserToken!
    getUserById(userId: ID!): User
    suggestUsers(offset: Int!, limit: Int!): [User!]! @userAuth
    searchUser(query: String!, offset: Int!, limit: Int!): [User!]! @userAuth
    oAuth(email: String!): UserToken!
    checkEmailExists(email: String!): Boolean!
    getCategories: [Category!]!
  }
  extend type Mutation {
    SignUp(user: UserInput): UserToken!
    editProfile(userInput: EditUserInput): User @userAuth
    adminEditUser(userInput: EditUserInput, userId: ID!): User @adminAuth
    disableAccount(password: String!): User! @userAuth
    togglePrivate: User! @userAuth
    updateToken(token: String!): String! @userAuth
    logOut: User! @userAuth
    addPhoneNumber(phone: String!, password: String!): User! @userAuth
    changePassword(oldPassword: String!, newPassword: String!): String! @userAuth
    toggleMute: Boolean! @userAuth
    toggleShowState: Boolean! @userAuth
    toggleAllowMessaging: Boolean! @userAuth
    sendEmailConfirmation(email: String!): Boolean!
    confirmEmail(email: String!, otpCode: String!): UserToken!
    forgetPassword(otp: String!, newPassword: String!): String! @userAuth
    activateProfessional: User! @userAuth
    pickCategory(categoryId: ID!): User! @userAuth
  }
  type User {
    id: ID!
    name: String!
    avatar: String
    numFollowers: Int!
    username: String!
    numFollowing: Int!
    followers: [Follow!]!
    following: [Follow!]!
    numPosts: Int!
    numVisits: Int!
    validated: Boolean!
    email: String!
    phone: String
    password: String!
    birthday: String!
    gender: Boolean!
    bio: String
    private: Boolean!
    disabled: Boolean!
    isActive: Boolean!
    lastActiveAt: String
    token: String
    mute: Boolean!
    allowMessaging: Boolean!
    showState: Boolean!
    categoryId: Int
    professional: Boolean!
    state: String
    isValid: Boolean!
    otpCode: Int
    createdAt: String
    updatedAt: String
    comments: [Comment!]!
    posts: [Post!]!
    country: Country
    replay: [Replay!]!
  }
  input UserInput {
    name: String!
    email: String!
    username: String!
    password: String!
    confirmPassword: String!
    birthday: String!
    gender: Boolean
    countryId: ID
    phone: String!
  }
  input EditUserInput {
    name: String
    username: String
    countryId: ID
    avatar: Upload
    bio: String
    state: String
    showState: Boolean
    isPrivate: Boolean
    gender: Boolean
  }
  type UserToken {
    user: User!
    token: String!
  }

  type Category {
    id: ID!
    name: String!
  }
`;

// EditProfile(userInput: EditUserInput): User @userAuth
// notifications: [Notification!]!

// stories: [Story!]!
// storyLikes: [StoryLike!]!
// storyComments: [StoryComment!]!
// storySeen: [StorySeen!]!
// favourites: [Favourite!]!
//  replayLikes: [ReplayLike!]!
// socialMedia: SocialMediaInput

import userResolvers from "./resolvers/user/index.mjs";
import postResolvers from "./resolvers/post.mjs";
import followResolvers from "./resolvers/follow.mjs";
import storyResolvers from "./resolvers/story.mjs";
// import countryResolvers from "./country/resolvers/index.mjs";
// import blockResolvers from "./block/resolvers/index.mjs";
// import followResolvers from "./follow/resolvers/index.mjs";
// import categoryResolvers from "./category/resolvers/index.mjs";
// import validationRequestResolvers from "./validationRequest/resolvers/index.mjs";
// import removeReasonsResolvers from "./removeReasons/resolvers/index.mjs";
// import removeRequestResolvers from "./removeRequest/resolvers/index.mjs";
// import reportReasonResolvers from "./reportReason/resolvers/index.mjs";
// import reportResolvers from "./report/resolvers/index.mjs";
// import walletResolvers from "./wallet/resolvers/index.mjs";
// export default [

// the export is an array of objects
// each object is a resolver
export default [
  postResolvers,
  userResolvers,
  followResolvers,
  storyResolvers,
  // countryResolvers
  // blockResolvers
  // followResolvers
  // categoryResolvers
  // validationRequestResolvers
  // removeReasonsResolvers
  // removeRequestResolvers
  // reportReasonResolvers
  // reportResolvers
  // walletResolvers
];

import typeDefs from "./typeDefs.mjs";
import resolvers from "./resolvers.mjs";
import { userAuthDirective } from "./directives.mjs";

import { makeExecutableSchema } from "@graphql-tools/schema";
const schemaExc = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export default userAuthDirective(schemaExc);

// context: ({ req }) => {
//   // const { isUserAuth, user } = req;

//   return {
//     // db,
//     // isUserAuth,
//     // user,
//     // pubSub,
//     // sendPushNotification,
//     // sendMail,
//     prisma,
//     mongoose,
//   };
// },

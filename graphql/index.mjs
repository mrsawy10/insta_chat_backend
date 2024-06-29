import typeDefs from "./typeDefs.mjs";
import resolvers from "./resolvers.mjs";
import { userAuthDirective, adminAuthDirective } from "./directives.mjs";

import { makeExecutableSchema } from "@graphql-tools/schema";
const schemaExc = makeExecutableSchema({
  typeDefs,
  resolvers,
});
const schemaWithUserAuth = userAuthDirective(schemaExc);
const schemaWithDirectives = adminAuthDirective(schemaWithUserAuth);
export default schemaWithDirectives;

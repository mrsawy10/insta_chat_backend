import pkg from "jsonwebtoken";
const { decode, verify } = pkg;
import prisma from "./../prisma/db.mjs";

export const userAuth = async (request, response, next) => {
  const token = request.get("Authorization");

  // check if there is a token in http request header
  if (!token || token.trim() == "") {
    request.isUserAuth = false;
    return next();
  }

  let decodedToken = null;
  // decode token
  try {
    decodedToken = await verify(token, process.env.JWT_SECRET);
  } catch (error) {
    request.isUserAuth = false;
    return next();
  }
  // if the decode token is not valid set auth to false move to next middleware
  if (!decodedToken) {
    request.isUserAuth = false;
    return next();
  }

  // console.log({ decodedToken });

  // check if realy this token belongs to a valid doctor
  var user = await prisma.user.findFirst({
    where: {
      email: decodedToken.identifier,
    },
  });
  // console.log({ user });

  // check if there is a valid user
  if (!user) {
    request.isUserAuth = false;
    return next();
  }

  // assing the user and validation to the request
  request.user = user;
  request.isUserAuth = true;

  return next();
};

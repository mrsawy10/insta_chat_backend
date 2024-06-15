import moment from "moment-timezone";
import { ApolloError } from "apollo-server-express";
import bcryptjs from "bcryptjs";
import e from "express";
import { createToken } from "../../../utils/jwt.mjs";
import { convertToValidDate } from "../../../utils/validateDate.mjs";
//___________________________________
const { hash, compare } = bcryptjs;
// import { SocialMediaValidator, SignUpValidator, LoginValidator } from "../../../validators";
// import { deleteFiles, uploadFiles } from "../../../providers";
// import { UPLOAD_PICTURES_DIR } from "../../../config";
// import Sequelize from "sequelize";
export default {
  Query: {
    checkUsername: async (_, { username }, { db, user }) => {
      // chek the username is taken
    },
    Login: async (_, { identifier, password }, { prisma }) => {
      try {
        // await LoginValidator.validate({ identifier, password }, { abortEarly: true });
        // get user that identifier match his email or phone number
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier }, { phone: identifier }],
          },
        });
        // there is no user with the given identifier
        if (!user) throw new Error("Identifier not valid");

        // check the password
        var isMath = await compare(password, user.password);
        if (!isMath) throw new Error("Wrong password");

        // create token
        var token = await createToken(user.email, user.password);

        return {
          user: user,
          token: token,
        };
      } catch (error) {
        return new ApolloError(error.message);
      }
    },
    // getUserById: async (_, { userId }, { db, user }) => {
    //   // find user by the given id
    //   // and add associations

    //   const blockedUser = await db.BlockedUser.findOne({
    //     where: {
    //       [Op.or]: [
    //         {
    //           userId: userId,
    //           blockedUserId: user.id,
    //         },
    //         {
    //           blockedUserId: userId,
    //           userId: user.id,
    //         },
    //       ],
    //     },
    //   });

    //   if (blockedUser) throw new Error("this user is blocked");

    //   const profile = await db.User.findByPk(userId, {
    //     include: [
    //       {
    //         model: db.Country,
    //         as: "country",
    //       },
    //       {
    //         model: db.SocialMedia,

    //         as: "socialMedia",
    //       },
    //       {
    //         model: db.Media,
    //         as: "profilePicture",
    //       },
    //     ],
    //   });

    //   if (user && profile) {
    //     profile.isFollowed =
    //       (
    //         await user.getFollowing({
    //           where: {
    //             followingId: profile.id,
    //           },
    //         })
    //       ).length > 0;
    //   } else {
    //     profile.isFollowed = false;
    //   }

    //   return profile;
    // },

    // suggestUsers: async (_, { offset, limit }, { db, user }) => {
    //   var followingsIds = (await user.getFollowing()).map((following) => following.followingId);
    //   followingsIds.push(user.id);

    //   var blockedUsers = await db.BlockedUser.findAll({
    //     where: {
    //       [Op.or]: [
    //         {
    //           blockedUserId: user.id,
    //         },
    //         {
    //           userId: user.id,
    //         },
    //       ],
    //     },
    //   });

    //   blockedUsers = blockedUsers.map((blockedUser) => {
    //     return blockedUser.userId == user.id ? blockedUser.blockedUserId : blockedUser.userId;
    //   });

    //   var users = await db.User.findAll({
    //     include: [
    //       {
    //         model: db.Media,
    //         as: "profilePicture",
    //       },
    //       {
    //         model: db.Follow,
    //         as: "followers",

    //         include: [
    //           {
    //             model: db.User,
    //             as: "user",
    //           },
    //         ],
    //       },
    //     ],
    //     where: {
    //       disabled: false,
    //       [Op.and]: [
    //         {
    //           id: {
    //             [Op.notIn]: followingsIds,
    //           },
    //         },
    //         {
    //           id: {
    //             [Op.notIn]: blockedUsers,
    //           },
    //         },
    //       ],
    //     },
    //     offset: offset,
    //     limit: limit,

    //     order: [["createdAt", "DESC"]],
    //   });
    //   return users;
    // },

    // searchUser: async (_, { query, offset, limit }, { db, user }) => {
    //   try {
    //     var blockedUsers = await db.BlockedUser.findAll({
    //       where: {
    //         [Op.or]: [
    //           {
    //             blockedUserId: user.id,
    //           },
    //           {
    //             userId: user.id,
    //           },
    //         ],
    //       },
    //     });

    //     blockedUsers = blockedUsers.map((blockedUser) => {
    //       return blockedUser.userId == user.id ? blockedUser.blockedUserId : blockedUser.userId;
    //     });

    //     query = query
    //       .trim()
    //       .split(" ")
    //       .filter((word) => word != "")
    //       .join(" ");

    //     return await db.User.findAll({
    //       where: {
    //         disabled: false,
    //         [Op.or]: [
    //           Sequelize.where(
    //             Sequelize.fn("CONCAT", Sequelize.col("name"), Sequelize.col("lastname")),
    //             {
    //               [Op.like]: `%${query}%`,
    //             }
    //           ),
    //           Sequelize.where(
    //             Sequelize.fn("CONCAT", Sequelize.col("lastname"), Sequelize.col("name")),
    //             {
    //               [Op.like]: `%${query}%`,
    //             }
    //           ),
    //           {
    //             username: {
    //               [Op.like]: `%${query}%`,
    //             },
    //           },
    //         ],
    //         id: {
    //           [Op.notIn]: blockedUsers,
    //         },
    //       },
    //       include: [
    //         {
    //           model: db.Media,
    //           as: "profilePicture",
    //         },
    //       ],
    //       offset: offset,
    //       limit: limit,
    //       order: [["createdAt", "DESC"]],
    //     });
    //   } catch (error) {
    //     return new ApolloError(error.message);
    //   }
    // },
    // oAuth: async (_, { email }, { db }) => {
    //   try {
    //     const user = await db.User.findOne({
    //       where: {
    //         email: email,
    //       },
    //       include: [
    //         {
    //           model: db.Media,
    //           as: "profilePicture",
    //         },
    //       ],
    //     });
    //     if (!user) throw new Error("User Not found ");
    //     // create token
    //     var token = createToken(user.email, user.password);

    //     return {
    //       user: user,
    //       token: token,
    //     };
    //   } catch (error) {
    //     return new ApolloError(error.message);
    //   }
    // }

    checkEmailExists: async (_, { email }, { prisma }) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });

        return !!user;
      } catch (error) {
        return new ApolloError(error.message);
      }
    },
  },

  Mutation: {
    SignUp: async (_, { user }, { prisma }) => {
      try {
        // validate inputs
        // await SignUpValidator.validate(user, { abortEarly: true });
        // check the password confirmation
        if (user.password != user.confirmPassword) throw Error("Password not match");

        user.password = await hash(user.password, +process.env.ROUNDS_OF_HASHING);
        // create token
        var token = await createToken(user.email, user.password);
        // create and return user

        delete user.confirmPassword;

        user.birthday = convertToValidDate(user.birthday);
        const createdUser = await prisma.user.create({
          data: user,
        });
        return {
          user: createdUser,
          token,
        };
      } catch (error) {
        return new ApolloError(error.message);
      }
    },

    //     EditProfile: async (_, { userInput }, { user, db }) => {
    //       try {
    //         // check if the social media need to be updated
    //         if (userInput.socialMedia) {
    //           // apply a validation for the input

    //           await SocialMediaValidator.validate(userInput.socialMedia, { abortEarly: true });

    //           // whene we reach this point we are sure that social media is set and validated
    //           // check if the user allready set some social media account or this is his first time

    //           const previousSocialMedia = await user.getSocialMedia();

    //           if (!previousSocialMedia) {
    //             await user.createSocialMedia(userInput.socialMedia);
    //           } else {
    //             await previousSocialMedia.update(userInput.socialMedia);
    //           }
    //         }

    //         // check if the user upload new profile picture
    //         if (userInput.profilePicture) {
    //           // check if the user have a previous profile picture
    //           const picture = await user.getProfilePicture();
    //           if (picture) {
    //             // if so delete it from the server storage
    //             // and delete it from the database
    //             await deleteFiles([picture.path]);

    //             await picture.destroy();
    //           }
    //           // if the user upload new picture
    //           // save it in the pictures directory and assign it to the given user
    //           const output = (await uploadFiles([userInput.profilePicture], UPLOAD_PICTURES_DIR)).pop();
    //           const media = await db.Media.create({
    //             path: output,
    //           });
    //           userInput.pictureId = media.id;
    //         } else if (!userInput.pictureId) {
    //           const picture = await user.getProfilePicture();
    //           if (picture) {
    //             // if so delete it from the server storage
    //             // and delete it from the database
    //             await deleteFiles([picture.path]);

    //             await picture.destroy();
    //           }
    //         }
    //         return await user.update(userInput);
    //       } catch (error) {
    //         return new ApolloError(error.message);
    //       }
    //     },
    //     disableAccount: async (_, { password }, { db, user }) => {
    //       // check the password
    //       var isMath = await compare(password, user.password);

    //       if (!isMath) throw new Error("Wrong password");

    //       return await user.update({ disabled: true });
    //     },
    //     togglePrivate: async (_, {}, { db, user }) => {
    //       return await user.update({ private: !user.private });
    //     },

    //     updateToken: async (_, { token }, { db, user }) => {
    //       try {
    //         await user.update({
    //           token: token,
    //         });

    //         return token;
    //       } catch (error) {
    //         return new ApolloError(error.message);
    //       }
    //     },
    //     logOut: async (_, {}, { db, user }) => {
    //       try {
    //         await user.update({
    //           isActive: false,
    //           token: null,
    //         });

    //         return user;
    //       } catch (error) {
    //         return new ApolloError(error.message);
    //       }
    //     },

    //     addPhoneNumber: async (_, { phone, password }, { db, user }) => {
    //       try {
    //         // check the password
    //         var isMath = await compare(password, user.password);

    //         if (!isMath) throw new Error("Wrong password");

    //         var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    //         if (!regex.test(phone)) {
    //           throw new Error("not valid number");
    //         }

    //         return await user.update({ phone });
    //       } catch (error) {
    //         return new ApolloError(error.message);
    //       }
    //     },
    //     changePassword: async (_, { oldPassword, newPassword }, { db, user }) => {
    //       try {
    //         // check the password
    //         var isMatch = await compare(oldPassword, user.password);

    //         if (!isMatch) throw new Error("Wrong password");

    //         user.password = await hash(newPassword, 10);
    //         await user.update({ password: user.password });

    //         // create token
    //         var token = createToken(user.email, user.password);

    //         return token;
    //       } catch (error) {
    //         return new ApolloError(error.message);
    //       }
    //     },

    //     toggleMute: async (_, {}, { db, user }) => {
    //       try {
    //         var result = await user.update({ mute: !user.mute });
    //         return result.mute;
    //       } catch (error) {
    //         return new ApolloError(error.message);
    //       }
    //     },

    //     toggleShowState: async (_, {}, { db, user }) => {
    //       try {
    //         var result = await user.update({ showState: !user.showState });

    //         return result.showState;
    //       } catch (error) {
    //         return new ApolloError(error.message);
    //       }
    //     },

    //     toggleAllowMessaging: async (_, {}, { db, user }) => {
    //       try {
    //         var result = await user.update({ allowMessaging: !user.allowMessaging });

    //         return result.allowMessaging;
    //       } catch (error) {
    //         return new ApolloError(error.message);
    //       }
    //     },

    //     sendEmailConfirmation: async (_, { email }, { db, sendMail }) => {
    //       try {
    //         var user = await db.User.findOne({
    //           where: {
    //             email,
    //           },
    //         });

    //         if (!user) throw new Error("There is no user match this email");

    //         var otpCode =
    //           String(Math.trunc(Math.random() * 10)) +
    //           String(Math.trunc(Math.random() * 10)) +
    //           String(Math.trunc(Math.random() * 10)) +
    //           String(Math.trunc(Math.random() * 10));
    //         await user.update({ otpCode: otpCode });

    //         const confirmationMessage = {
    //           from: "Vinkst",
    //           to: user.email,
    //           subject: "تأكيد الحساب",
    //           html: `
    //                         <p>رقم تأكيد الحساب : <b>${otpCode}</b></p>
    //                     `,
    //         };

    //         sendMail(user.email, confirmationMessage);
    //         return true;
    //       } catch (error) {
    //         return new ApolloError(error.message);
    //       }
    //     },
    //     confirmEmail: async (_, { email, otpCode }, { db, user }) => {
    //       try {
    //         var user = await db.User.findOne({
    //           where: {
    //             email,
    //           },
    //           include: [
    //             {
    //               model: db.Media,
    //               as: "profilePicture",
    //             },
    //           ],
    //         });

    //         if (!user) throw new Error("There is no user match this email");

    //         if (user.otpCode == otpCode) {
    //           await user.update({ isValid: true });

    //           // create token
    //           var token = createToken(user.email, user.password);

    //           return {
    //             user: user,
    //             token: token,
    //           };
    //         } else {
    //           throw new Error("Not Valid Otp Code");
    //         }
    //       } catch (error) {
    //         return new ApolloError(error.mesage);
    //       }
    //     },

    //     forgetPassword: async (_, { otp, newPassword }, { db, user }) => {
    //       try {
    //         var account = await db.User.findOne({
    //           where: {
    //             id: user.id,
    //             otpCode: otp,
    //           },
    //           include: [
    //             {
    //               model: db.Media,
    //               as: "profilePicture",
    //             },
    //           ],
    //         });

    //         if (!account) throw new Error("There is no user match this email");

    //         account.password = await hash(newPassword, 10);
    //         await account.update({ password: account.password });

    //         // create token
    //         var token = createToken(account.email, account.password);

    //         return token;
    //       } catch (error) {
    //         return new ApolloError(error.message);
    //       }
    //     },

    //     activateProfessional: async (_, {}, { db, user }) => {
    //       try {
    //         await user.update({
    //           professional: true,
    //         });
    //         return user;
    //       } catch (error) {
    //         return new ApolloError(error.message);
    //       }
    //     },
    //     pickCategory: async (_, { categoryId }, { db, user }) => {
    //       try {
    //         const category = await db.Category.findOne({
    //           where: {
    //             id: categoryId,
    //           },
    //         });

    //         if (!category) throw new ApolloError("No Category found");

    //         await user.update({
    //           categoryId: category.id,
    //         });

    //         return user;
    //       } catch (error) {
    //         return new ApolloError(error.message);
    //       }
    //     },
  },
};

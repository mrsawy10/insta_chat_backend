import validatePostTypes, { validateMimeType } from "../../utils/checkPostTypes.mjs";
import getPostsMedia from "../../utils/s3/imageUrl.mjs";
import uploadFileToS3, { deleteFileFromS3 } from "../../utils/s3/uploadFileToS3.mjs";
//___________________________________
export default {
  Query: {
    getSingleStory: async (_, { storyId }, { prisma, user }) => {
      return await prisma.story.findUnique({
        where: { id: storyId },
        include: { media: true },
      });
    },
    getStories: async (_, { limit, offset }, { prisma, user }) => {
      const followedUserIds = await prisma.follow
        .findMany({
          where: {
            followerId: user.id,
          },
          select: {
            followingId: true,
          },
        })
        .then((follows) => follows.map((follow) => follow.followingId));

      let args = {
        where: {
          userId: {
            in: followedUserIds,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          media: true,
        },
      };
      limit || limit == 0 ? (args.take = limit) : (args.take = 20);
      offset || offset == 0 ? (args.skip = offset) : (args.take = 0);
      limit == -1 && delete args.take;
      offset == -1 && delete args.skip;
      //
      const stories = await prisma.story.findMany(args);
      return stories;
    },
    getSameUserStories: async (_, { offset, limit }, { prisma, user }) => {
      let args = {
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          media: true,
        },
      };
      limit || limit == 0 ? (args.take = limit) : (args.take = 20);
      offset || offset == 0 ? (args.skip = offset) : (args.take = 0);
      limit == -1 && delete args.take;
      offset == -1 && delete args.skip;
      //
      const stories = await prisma.story.findMany(args);
      return stories;
    },
    getUserStories: async (_, { userId, offset, limit }, { prisma }) => {
      let args = {
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          media: true,
        },
      };
      limit || limit == 0 ? (args.take = limit) : (args.take = 20);
      offset || offset == 0 ? (args.skip = offset) : (args.take = 0);
      limit == -1 && delete args.take;
      offset == -1 && delete args.skip;
      //
      const stories = await prisma.story.findMany(args);
      return stories;
    },
  },
  Mutation: {
    deleteStory: async (_, { storyId }, { prisma, user }) => {
      if (user.role == `admin`) {
        const foundedStory = await prisma.story.findUnique({
          where: { id: storyId },
          include: { media: true },
        });
        await deleteFileFromS3(foundedStory.media.path);

        const deletedStory = await prisma.story.delete({
          where: { id: storyId },
        });

        return storyId;
      } else {
        const foundedStory = await prisma.story.findUnique({
          where: { id: storyId },
          include: { media: true },
        });

        await deleteFileFromS3(foundedStory.media.path);
        const deletedStory = await prisma.story.delete({
          where: { id: storyId, userId: user.id },
        });
        return storyId;
      }
      //   throw new Error("You can only delete your own story");
    },
    createStory: async (_, { media }, { user, prisma }) => {
      await validateMimeType(media);
      let path = await uploadFileToS3(media);
      const createdMedia = await prisma.media.create({
        data: { path },
      });
      const storyData = {
        mediaId: createdMedia.id,
        userId: user?.id,
        createdAt: new Date(),
        expiredAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      return await prisma.story.create({
        data: storyData,
        include: {
          media: true,
        },
      });
    },
  },
};

import validatePostTypes from "../../utils/checkPostTypes.mjs";
import getPostsMedia from "../../utils/s3/imageUrl.mjs";
import uploadFileToS3, { deleteFileFromS3 } from "../../utils/s3/uploadFileToS3.mjs";
//___________________________________
export default {
  Query: {
    getSinglePost: async (_, { postId }, { prisma, user }) => {
      return await prisma.post.findUnique({
        where: { id: postId },
        include: { postMedia: { include: { media: true } } },
      });
    },

    getPosts: async (_, { limit, offset }, { prisma, user }) => {
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
      const totalFollowedUserPosts = await prisma.post.count({
        where: {
          userId: { in: followedUserIds },
        },
      });
      // Calculate offset for followed user posts
      const followedUserOffset = offset < totalFollowedUserPosts ? offset : totalFollowedUserPosts;
      // Fetch posts of followed users with limit and offset
      const followedUserPosts = await prisma.post.findMany({
        where: {
          userId: { in: followedUserIds },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          postMedia: {
            include: {
              media: true,
            },
          },
        },
        take: limit,
        skip: followedUserOffset,
      });
      // Calculate remaining limit after fetching followed user posts
      const remainingLimit = limit - followedUserPosts.length;
      // Fetch posts of other users only if there is remaining limit
      let otherUserPosts = [];
      if (remainingLimit > 0) {
        const otherUserOffset =
          offset > totalFollowedUserPosts ? offset - totalFollowedUserPosts : 0;

        otherUserPosts = await prisma.post.findMany({
          where: {
            userId: { notIn: followedUserIds },
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            postMedia: {
              include: {
                media: true,
              },
            },
          },
          take: remainingLimit,
          skip: otherUserOffset,
        });
      }

      // Combine the results
      const posts = [...followedUserPosts, ...otherUserPosts];
      return posts;
    },
    getUserPosts: async (_, { userId, postType, offset, limit }, { prisma }) => {
      try {
        let args = {
          where: {
            userId,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            postMedia: {
              include: {
                media: true,
              },
            },
          },
        };
        postType && (args.where.type = postType);
        limit || limit == 0 ? (args.take = limit) : (args.take = 20);
        offset || offset == 0 ? (args.skip = offset) : (args.take = 0);
        limit == -1 && delete args.take;
        offset == -1 && delete args.skip;
        //
        const posts = await prisma.post.findMany(args);
        return posts;
      } catch (err) {
        console.log(`error getting posts`, { err });
      }
    },
  },
  Mutation: {
    deletePost: async (_, { postId }, { user, prisma }) => {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (!post) {
        throw new Error("Post not found");
      }
      if (post.userId !== user.id && user.role != "admin") {
        throw new Error("Unauthorized");
      }

      let postMedia = await prisma.postMedia.findMany({
        where: {
          postId,
        },
        include: {
          media: true,
        },
      });
      if (postMedia.length > 0) {
        await Promise.all(
          postMedia.map(async (media) => {
            await deleteFileFromS3(media.media.path);
          })
        );
      }
      let deletedPost = await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      return postId;
    },
    createPost: async (_, { postInput }, { user, prisma }) => {
      let { title, type, media, reel } = postInput;

      if (!Array.isArray(media) && media) media = [media];
      if (!Array.isArray(media) && !media) media = [];

      await validatePostTypes({ type, media });

      const mediaUrls = await Promise.all(
        media.map(async (file) => {
          return await uploadFileToS3(file);
        })
      );
      console.log({ mediaUrls, media });

      const postData = {
        title,
        type,
        userId: user.id,
      };
      // Add postMedia only if mediaUrls array is not empty
      if (mediaUrls.length > 0) {
        postData.postMedia = {
          create: mediaUrls.map((url) => ({
            media: {
              create: { path: url },
            },
          })),
        };
      }
      return await prisma.post.create({
        data: postData,
        include: {
          postMedia: {
            include: {
              media: true,
            },
          },
        },
      });
    },

    editPost: async (_, { postInput }, { user, prisma }) => {
      let { id, title, type } = postInput;
      // Fetch the existing post
      const existingPost = await prisma.post.findUnique({
        where: { id, type },
        include: { postMedia: false },
      });

      if (!existingPost) {
        throw new Error("Post not found");
      }
      // Check if the user is the owner of the post
      if (existingPost.userId !== user.id && user.role != "admin") {
        throw new Error("You are not authorized to edit this post");
      }
      // Build the update data object
      const updateData = {
        title,
      };
      // Update the post
      const updatedPost = await prisma.post.update({
        where: { id },
        data: updateData,
        include: {
          postMedia: {
            include: {
              media: true,
            },
          },
        },
      });

      return updatedPost;
    },
    // deletePost: async (_, { postId }, { user, prisma }) => {
    //   const post = await prisma.post.findUnique({
    //     where: {
    //       id: postId,
    //     },
    //   });
    //   if (!post) {
    //     throw new Error("Post not found");
    //   }
    //   if (post.userId !== user.id && user.role != "admin") {
    //     throw new Error("Unauthorized");
    //   }
    //   await prisma.post.delete({
    //     where: {
    //       id: postId,
    //     },
    //   });
    //   return postId;
    // },
  },
};

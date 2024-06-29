export default {
  Mutation: {
    toggleFollow: async (_, { userId }, { user, prisma }) => {
      if (user.id === userId) {
        return false;
      }
      const follow = await prisma.follow.findFirst({
        where: {
          followerId: user.id,
          followingId: userId,
        },
      });
      if (follow) {
        await prisma.follow.delete({
          where: {
            id: follow.id,
          },
        });
        let follower = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            numFollowing: {
              decrement: 1,
            },
          },
        });
        let following = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            numFollowers: {
              decrement: 1,
            },
          },
        });

        return { followStatus: false, numFollowing: follower.numFollowing };
      } else {
        await prisma.follow.create({
          data: {
            followerId: user.id,
            followingId: userId,
          },
        });

        let follower = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            numFollowing: {
              increment: 1,
            },
          },
        });
        let following = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            numFollowers: {
              increment: 1,
            },
          },
        });

        return { followStatus: true, numFollowing: follower.numFollowing };
      }
    },
  },
};

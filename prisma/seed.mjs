import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      username: 'john_doe',
      email: 'john_doe@example.com',
      password: 'password123',
      profile: {
        create: {
          bio: 'Software Developer',
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'jane_doe',
      email: 'jane_doe@example.com',
      password: 'password456',
      profile: {
        create: {
          bio: 'Graphic Designer',
        },
      },
    },
  });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: 'My First Post',
      content: 'Hello World!',
      author: {
        connect: { id: user1.id },
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Another Day in Paradise',
      content: 'Enjoying the sunshine!',
      author: {
        connect: { id: user2.id },
      },
    },
  });

  // Create comments
  await prisma.comment.create({
    data: {
      content: 'Nice post!',
      post: {
        connect: { id: post1.id },
      },
      author: {
        connect: { id: user2.id },
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Thanks for sharing!',
      post: {
        connect: { id: post2.id },
      },
      author: {
        connect: { id: user1.id },
      },
    },
  });

  // Create likes
  await prisma.like.create({
    data: {
      post: {
        connect: { id: post1.id },
      },
      user: {
        connect: { id: user2.id },
      },
    },
  });

  await prisma.like.create({
    data: {
      post: {
        connect: { id: post2.id },
      },
      user: {
        connect: { id: user1.id },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

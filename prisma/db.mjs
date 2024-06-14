import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Declare a global variable for PrismaClient
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = prismaClientSingleton();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = prismaClientSingleton();
  }
  prisma = globalThis.prisma;
}

export { prisma };
export default prisma;

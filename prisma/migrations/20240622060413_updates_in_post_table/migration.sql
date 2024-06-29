/*
  Warnings:

  - The values [work,service] on the enum `Post_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `postmedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `storyseen` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `postmedia` DROP FOREIGN KEY `postmedia_mediaId_fkey`;

-- DropForeignKey
ALTER TABLE `postmedia` DROP FOREIGN KEY `postmedia_postId_fkey`;

-- DropForeignKey
ALTER TABLE `storyseen` DROP FOREIGN KEY `storyseen_ibfk_1`;

-- DropForeignKey
ALTER TABLE `storyseen` DROP FOREIGN KEY `storyseen_ibfk_2`;

-- AlterTable
ALTER TABLE `Post` MODIFY `type` ENUM('note', 'image', 'reel') NOT NULL DEFAULT 'note';

-- DropTable
DROP TABLE `postmedia`;

-- DropTable
DROP TABLE `storyseen`;

-- CreateTable
CREATE TABLE `StorySeen` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `storyId` VARCHAR(191) NULL,

    INDEX `storyId`(`storyId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Postmedia` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(191) NOT NULL,

    INDEX `mediaId`(`mediaId`),
    INDEX `postId`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StorySeen` ADD CONSTRAINT `StorySeen_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `StorySeen` ADD CONSTRAINT `StorySeen_storyId_fkey` FOREIGN KEY (`storyId`) REFERENCES `Story`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Postmedia` ADD CONSTRAINT `Postmedia_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Postmedia` ADD CONSTRAINT `Postmedia_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

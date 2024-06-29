/*
  Warnings:

  - You are about to drop the `Postmedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Postmedia` DROP FOREIGN KEY `Postmedia_mediaId_fkey`;

-- DropForeignKey
ALTER TABLE `Postmedia` DROP FOREIGN KEY `Postmedia_postId_fkey`;

-- DropTable
DROP TABLE `Postmedia`;

-- CreateTable
CREATE TABLE `PostMedia` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(191) NOT NULL,

    INDEX `mediaId`(`mediaId`),
    INDEX `postId`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PostMedia` ADD CONSTRAINT `PostMedia_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `PostMedia` ADD CONSTRAINT `PostMedia_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

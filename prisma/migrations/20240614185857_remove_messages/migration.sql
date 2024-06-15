/*
  Warnings:

  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Conversation_User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Conversation` DROP FOREIGN KEY `conversations_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Conversation_User` DROP FOREIGN KEY `Conversation_User_conversationId_fkey`;

-- DropForeignKey
ALTER TABLE `Conversation_User` DROP FOREIGN KEY `Conversation_User_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_conversationId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_mediaId_fkey`;

-- DropTable
DROP TABLE `Conversation`;

-- DropTable
DROP TABLE `Conversation_User`;

-- DropTable
DROP TABLE `Message`;

/*
  Warnings:

  - You are about to drop the column `lastname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `username` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `lastname`,
    DROP COLUMN `username`,
    MODIFY `gender` BOOLEAN NOT NULL DEFAULT true;

/*
  Warnings:

  - Added the required column `role` to the `UserProjects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'MEMBER');

-- AlterTable
ALTER TABLE "UserProjects" ADD COLUMN     "role" "Role" NOT NULL;

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ASSIGNED', 'PROGRESS', 'COMPLETED', 'EXCEEDED');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ASSIGNED', 'PROGRESS', 'COMPLETED', 'EXCEEDED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('URGENT', 'HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "uname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Project" (
    "pid" TEXT NOT NULL,
    "pname" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("pid")
);

-- CreateTable
CREATE TABLE "Task" (
    "tid" TEXT NOT NULL,
    "tname" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("tid")
);

-- CreateTable
CREATE TABLE "Subtask" (
    "sid" TEXT NOT NULL,
    "tname" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,

    CONSTRAINT "Subtask_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "UserProjects" (
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "UserProjects_pkey" PRIMARY KEY ("userId","projectId")
);

-- CreateTable
CREATE TABLE "UserTasks" (
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "UserTasks_pkey" PRIMARY KEY ("userId","taskId")
);

-- CreateTable
CREATE TABLE "UserSubTasks" (
    "userId" TEXT NOT NULL,
    "subTaskId" TEXT NOT NULL,

    CONSTRAINT "UserSubTasks_pkey" PRIMARY KEY ("userId","subTaskId")
);

-- CreateTable
CREATE TABLE "TaskComments" (
    "cid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "TaskComments_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "SubTaskComments" (
    "cid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subTaskId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "SubTaskComments_pkey" PRIMARY KEY ("cid")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("pid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtask" ADD CONSTRAINT "Subtask_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtask" ADD CONSTRAINT "Subtask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("tid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjects" ADD CONSTRAINT "UserProjects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjects" ADD CONSTRAINT "UserProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("pid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTasks" ADD CONSTRAINT "UserTasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTasks" ADD CONSTRAINT "UserTasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("tid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubTasks" ADD CONSTRAINT "UserSubTasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubTasks" ADD CONSTRAINT "UserSubTasks_subTaskId_fkey" FOREIGN KEY ("subTaskId") REFERENCES "Subtask"("sid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComments" ADD CONSTRAINT "TaskComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComments" ADD CONSTRAINT "TaskComments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("tid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTaskComments" ADD CONSTRAINT "SubTaskComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTaskComments" ADD CONSTRAINT "SubTaskComments_subTaskId_fkey" FOREIGN KEY ("subTaskId") REFERENCES "Subtask"("sid") ON DELETE CASCADE ON UPDATE CASCADE;

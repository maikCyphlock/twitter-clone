-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Name" TEXT,
    "ImgUrl" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Bio" TEXT,
    "Email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "UserId" TEXT NOT NULL,
    "PostRefId" TEXT NOT NULL,
    CONSTRAINT "Likes_PostRefId_fkey" FOREIGN KEY ("PostRefId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Likes_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LikesComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "UserId" TEXT NOT NULL,
    "Userlike" TEXT NOT NULL,
    CONSTRAINT "LikesComment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LikesComment_Userlike_fkey" FOREIGN KEY ("Userlike") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Content" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "PostRefId" TEXT NOT NULL,
    CONSTRAINT "Comment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_PostRefId_fkey" FOREIGN KEY ("PostRefId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Published" BOOLEAN DEFAULT false,
    "Content" TEXT,
    "AuthorId" TEXT,
    CONSTRAINT "Post_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

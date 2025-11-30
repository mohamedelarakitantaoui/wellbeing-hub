/*
  Warnings:

  - Added the required column `updatedAt` to the `SupportMessage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SupportMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "status" TEXT NOT NULL DEFAULT 'sent',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" DATETIME,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SupportMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "SupportRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SupportMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
-- Set updatedAt to createdAt for existing rows
INSERT INTO "new_SupportMessage" ("content", "createdAt", "flagged", "id", "isRead", "roomId", "senderId", "updatedAt") 
SELECT "content", "createdAt", "flagged", "id", "isRead", "roomId", "senderId", "createdAt" FROM "SupportMessage";
DROP TABLE "SupportMessage";
ALTER TABLE "new_SupportMessage" RENAME TO "SupportMessage";
CREATE INDEX "SupportMessage_roomId_idx" ON "SupportMessage"("roomId");
CREATE INDEX "SupportMessage_senderId_idx" ON "SupportMessage"("senderId");
CREATE INDEX "SupportMessage_createdAt_idx" ON "SupportMessage"("createdAt");
CREATE INDEX "SupportMessage_isDeleted_idx" ON "SupportMessage"("isDeleted");
CREATE TABLE "new_SupportRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "supporterId" TEXT,
    "topic" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "routedTo" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "initialMessage" TEXT,
    "lastMessageAt" DATETIME,
    "lastMessagePreview" TEXT,
    "isArchivedForStudent" BOOLEAN NOT NULL DEFAULT false,
    "isArchivedForSupporter" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "claimedAt" DATETIME,
    "closedAt" DATETIME,
    CONSTRAINT "SupportRoom_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SupportRoom_supporterId_fkey" FOREIGN KEY ("supporterId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SupportRoom" ("claimedAt", "closedAt", "createdAt", "id", "initialMessage", "isPrivate", "routedTo", "status", "studentId", "supporterId", "topic", "updatedAt", "urgency") SELECT "claimedAt", "closedAt", "createdAt", "id", "initialMessage", "isPrivate", "routedTo", "status", "studentId", "supporterId", "topic", "updatedAt", "urgency" FROM "SupportRoom";
DROP TABLE "SupportRoom";
ALTER TABLE "new_SupportRoom" RENAME TO "SupportRoom";
CREATE INDEX "SupportRoom_studentId_idx" ON "SupportRoom"("studentId");
CREATE INDEX "SupportRoom_supporterId_idx" ON "SupportRoom"("supporterId");
CREATE INDEX "SupportRoom_status_idx" ON "SupportRoom"("status");
CREATE INDEX "SupportRoom_topic_idx" ON "SupportRoom"("topic");
CREATE INDEX "SupportRoom_urgency_idx" ON "SupportRoom"("urgency");
CREATE INDEX "SupportRoom_routedTo_idx" ON "SupportRoom"("routedTo");
CREATE INDEX "SupportRoom_lastMessageAt_idx" ON "SupportRoom"("lastMessageAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

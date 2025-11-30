/*
  Warnings:

  - Added the required column `eventType` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "SupportRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "supporterId" TEXT,
    "topic" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "routedTo" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "initialMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "claimedAt" DATETIME,
    "closedAt" DATETIME,
    CONSTRAINT "SupportRoom_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SupportRoom_supporterId_fkey" FOREIGN KEY ("supporterId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SupportMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SupportMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "SupportRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SupportMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT,
    "role" TEXT,
    "roomId" TEXT,
    "eventType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AuditLog" ("action", "actorId", "createdAt", "id", "metadata") SELECT "action", "actorId", "createdAt", "id", "metadata" FROM "AuditLog";
DROP TABLE "AuditLog";
ALTER TABLE "new_AuditLog" RENAME TO "AuditLog";
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX "AuditLog_eventType_idx" ON "AuditLog"("eventType");
CREATE INDEX "AuditLog_roomId_idx" ON "AuditLog"("roomId");
CREATE TABLE "new_CrisisAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'general',
    "roomSlug" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CrisisAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CrisisAlert" ("createdAt", "id", "message", "status", "updatedAt", "userId") SELECT "createdAt", "id", "message", "status", "updatedAt", "userId" FROM "CrisisAlert";
DROP TABLE "CrisisAlert";
ALTER TABLE "new_CrisisAlert" RENAME TO "CrisisAlert";
CREATE INDEX "CrisisAlert_userId_idx" ON "CrisisAlert"("userId");
CREATE INDEX "CrisisAlert_status_idx" ON "CrisisAlert"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "SupportRoom_studentId_idx" ON "SupportRoom"("studentId");

-- CreateIndex
CREATE INDEX "SupportRoom_supporterId_idx" ON "SupportRoom"("supporterId");

-- CreateIndex
CREATE INDEX "SupportRoom_status_idx" ON "SupportRoom"("status");

-- CreateIndex
CREATE INDEX "SupportRoom_topic_idx" ON "SupportRoom"("topic");

-- CreateIndex
CREATE INDEX "SupportRoom_urgency_idx" ON "SupportRoom"("urgency");

-- CreateIndex
CREATE INDEX "SupportRoom_routedTo_idx" ON "SupportRoom"("routedTo");

-- CreateIndex
CREATE INDEX "SupportMessage_roomId_idx" ON "SupportMessage"("roomId");

-- CreateIndex
CREATE INDEX "SupportMessage_senderId_idx" ON "SupportMessage"("senderId");

-- CreateIndex
CREATE INDEX "SupportMessage_createdAt_idx" ON "SupportMessage"("createdAt");

-- AlterTable
ALTER TABLE "User" ADD COLUMN "oauthProvider" TEXT;
ALTER TABLE "User" ADD COLUMN "oauthProviderId" TEXT;
ALTER TABLE "User" ADD COLUMN "profilePicture" TEXT;

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
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" DATETIME,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SupportMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "SupportRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SupportMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SupportMessage" ("content", "createdAt", "deletedAt", "flagged", "id", "isDeleted", "isRead", "readAt", "roomId", "senderId", "status", "type", "updatedAt") SELECT "content", "createdAt", "deletedAt", "flagged", "id", "isDeleted", "isRead", "readAt", "roomId", "senderId", "status", "type", "updatedAt" FROM "SupportMessage";
DROP TABLE "SupportMessage";
ALTER TABLE "new_SupportMessage" RENAME TO "SupportMessage";
CREATE INDEX "SupportMessage_roomId_idx" ON "SupportMessage"("roomId");
CREATE INDEX "SupportMessage_senderId_idx" ON "SupportMessage"("senderId");
CREATE INDEX "SupportMessage_createdAt_idx" ON "SupportMessage"("createdAt");
CREATE INDEX "SupportMessage_isDeleted_idx" ON "SupportMessage"("isDeleted");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

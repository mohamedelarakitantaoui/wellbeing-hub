-- CreateTable
CREATE TABLE "PeerTutor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "communicationStyle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "passwordHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PeerTutor_email_key" ON "PeerTutor"("email");

-- CreateIndex
CREATE INDEX "PeerTutor_email_idx" ON "PeerTutor"("email");

-- CreateIndex
CREATE INDEX "PeerTutor_status_idx" ON "PeerTutor"("status");

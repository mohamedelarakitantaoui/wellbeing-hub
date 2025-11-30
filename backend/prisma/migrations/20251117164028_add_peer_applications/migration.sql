-- CreateTable
CREATE TABLE "PeerApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "auiEmail" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "yearOfStudy" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "communicationStyle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "activationToken" TEXT,
    "tokenExpiresAt" DATETIME,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "rejectionReason" TEXT,
    "studentIdFileUrl" TEXT,
    "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PeerApplication_auiEmail_key" ON "PeerApplication"("auiEmail");

-- CreateIndex
CREATE UNIQUE INDEX "PeerApplication_activationToken_key" ON "PeerApplication"("activationToken");

-- CreateIndex
CREATE INDEX "PeerApplication_status_idx" ON "PeerApplication"("status");

-- CreateIndex
CREATE INDEX "PeerApplication_auiEmail_idx" ON "PeerApplication"("auiEmail");

-- CreateIndex
CREATE INDEX "PeerApplication_activationToken_idx" ON "PeerApplication"("activationToken");

-- CreateTable
CREATE TABLE "Exclusion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "excluderId" TEXT NOT NULL,
    "excludedId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Exclusion_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Exclusion_excluderId_fkey" FOREIGN KEY ("excluderId") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Exclusion_excludedId_fkey" FOREIGN KEY ("excludedId") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "giverId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "isPurchased" BOOLEAN NOT NULL DEFAULT false,
    "isReceived" BOOLEAN NOT NULL DEFAULT false,
    "photoUrl" TEXT,
    "thankYouMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchasedAt" DATETIME,
    "receivedAt" DATETIME,
    CONSTRAINT "Assignment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Assignment_giverId_fkey" FOREIGN KEY ("giverId") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Assignment_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Assignment" ("createdAt", "giverId", "id", "receiverId", "teamId") SELECT "createdAt", "giverId", "id", "receiverId", "teamId" FROM "Assignment";
DROP TABLE "Assignment";
ALTER TABLE "new_Assignment" RENAME TO "Assignment";
CREATE UNIQUE INDEX "Assignment_giverId_key" ON "Assignment"("giverId");
CREATE UNIQUE INDEX "Assignment_receiverId_key" ON "Assignment"("receiverId");
CREATE TABLE "new_Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "companyName" TEXT,
    "eventDate" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "budget" REAL,
    "currency" TEXT NOT NULL DEFAULT 'MYR',
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "drawComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Team" ("companyName", "createdAt", "drawComplete", "eventDate", "id", "isLocked", "name", "token") SELECT "companyName", "createdAt", "drawComplete", "eventDate", "id", "isLocked", "name", "token" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_token_key" ON "Team"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Exclusion_teamId_idx" ON "Exclusion"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Exclusion_excluderId_excludedId_key" ON "Exclusion"("excluderId", "excludedId");

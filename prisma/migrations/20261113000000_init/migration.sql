CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Wedding" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "partnerOne" TEXT NOT NULL,
    "partnerTwo" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time" TEXT NOT NULL DEFAULT '18:00',
    "venue" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "deadline" DATE,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Wedding_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attending" BOOLEAN NOT NULL,
    "guests" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT NOT NULL DEFAULT '',
    "tokenHash" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Response_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Response_guests_check" CHECK (("attending" AND "guests" BETWEEN 1 AND 10) OR (NOT "attending" AND "guests" = 0))
);
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Wedding_slug_key" ON "Wedding"("slug");
CREATE INDEX "Wedding_ownerId_createdAt_idx" ON "Wedding"("ownerId", "createdAt");
CREATE UNIQUE INDEX "Response_weddingId_tokenHash_key" ON "Response"("weddingId", "tokenHash");
CREATE INDEX "Response_weddingId_updatedAt_idx" ON "Response"("weddingId", "updatedAt");
CREATE INDEX "RateLimit_expiresAt_idx" ON "RateLimit"("expiresAt");
ALTER TABLE "Wedding" ADD CONSTRAINT "Wedding_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Response" ADD CONSTRAINT "Response_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

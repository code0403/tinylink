-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastClicked" TIMESTAMP(3),

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_code_key" ON "Link"("code");

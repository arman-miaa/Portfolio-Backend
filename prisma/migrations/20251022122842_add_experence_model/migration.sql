-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "certificateImg" TEXT,
    "technologies" TEXT[],
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

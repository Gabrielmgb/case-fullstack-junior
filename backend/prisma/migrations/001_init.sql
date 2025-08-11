-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADVISOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('RETIREMENT', 'SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM', 'EMERGENCY_FUND', 'EDUCATION', 'REAL_ESTATE', 'OTHER');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CONTRIBUTION', 'WITHDRAWAL', 'INCOME_CHANGE', 'EXPENSE_CHANGE', 'BONUS', 'OTHER');

-- CreateEnum
CREATE TYPE "EventFrequency" AS ENUM ('ONCE', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "InsuranceType" AS ENUM ('LIFE', 'DISABILITY', 'HEALTH', 'PROPERTY', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentFrequency" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADVISOR',
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "familyProfile" TEXT,
    "totalWealth" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "GoalType" NOT NULL,
    "targetValue" DECIMAL(15,2) NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_items" (
    "id" TEXT NOT NULL,
    "assetClass" TEXT NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "wallet_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "EventType" NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "frequency" "EventFrequency" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "initialWealth" DECIMAL(15,2) NOT NULL,
    "projectionRate" DECIMAL(5,4) NOT NULL,
    "projectionData" JSONB NOT NULL,
    "alignmentScore" DECIMAL(5,2),
    "suggestions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurances" (
    "id" TEXT NOT NULL,
    "type" "InsuranceType" NOT NULL,
    "coverage" DECIMAL(15,2) NOT NULL,
    "premium" DECIMAL(10,2) NOT NULL,
    "frequency" "PaymentFrequency" NOT NULL,
    "provider" TEXT NOT NULL,
    "policyNumber" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "insurances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_items" ADD CONSTRAINT "wallet_items_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

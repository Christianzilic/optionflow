-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('HOMEOWNER', 'DEVELOPER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AustralianState" AS ENUM ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'OPTION_ACTIVE', 'LISTED', 'OFFER_RECEIVED', 'UNDER_CONTRACT', 'ASSIGNED', 'REJECTED', 'OPTION_EXPIRED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "OptionDeedStatus" AS ENUM ('DRAFT', 'SENT_FOR_SIGNING', 'SIGNED', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AssignmentDeedStatus" AS ENUM ('DRAFT', 'SENT_FOR_SIGNING', 'SIGNED', 'COMPLETED', 'VOIDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "DeveloperOfferStatus" AS ENUM ('PENDING', 'UNDER_NEGOTIATION', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'HOMEOWNER',
    "image" TEXT,
    "passwordHash" TEXT,
    "stripeCustomerId" TEXT,
    "tosAcceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeownerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "legalName" TEXT,
    "isCompany" BOOLEAN NOT NULL DEFAULT false,
    "companyName" TEXT,
    "abn" TEXT,
    "acn" TEXT,
    "solicitorName" TEXT,
    "solicitorEmail" TEXT,
    "solicitorPhone" TEXT,
    "bankBsb" TEXT,
    "bankAccount" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeownerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeveloperProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT,
    "abn" TEXT,
    "acn" TEXT,
    "licenseNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "preferredStates" "AustralianState"[],
    "preferredMinPrice" INTEGER,
    "preferredMaxPrice" INTEGER,
    "preferredTypes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeveloperProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerId" TEXT NOT NULL,
    "adminNotes" TEXT,
    "streetAddress" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "state" "AustralianState" NOT NULL,
    "postcode" TEXT NOT NULL,
    "lotNumber" TEXT,
    "planNumber" TEXT,
    "titleReference" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "landAreaSqm" INTEGER,
    "currentZoning" TEXT,
    "proposedZoning" TEXT,
    "propertyType" TEXT NOT NULL DEFAULT 'house',
    "bedroomCount" INTEGER,
    "bathroomCount" INTEGER,
    "carSpaces" INTEGER,
    "yearBuilt" INTEGER,
    "currentUse" TEXT,
    "proposedDevelopment" TEXT,
    "homeownerAskingPrice" INTEGER,
    "agreedOptionPrice" INTEGER,
    "optionFeeAmount" INTEGER,
    "adminListPrice" INTEGER,
    "adminDescription" TEXT,
    "feasibilityNotes" TEXT,
    "feasibilityData" JSONB,
    "stateSpecificData" JSONB,
    "legalAckAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "listedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyDocument" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionDeed" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "status" "OptionDeedStatus" NOT NULL DEFAULT 'DRAFT',
    "grantor_legalName" TEXT NOT NULL,
    "grantor_address" TEXT NOT NULL,
    "grantor_abn" TEXT,
    "grantee_legalName" TEXT NOT NULL,
    "grantee_abn" TEXT,
    "grantee_address" TEXT NOT NULL,
    "state" "AustralianState" NOT NULL,
    "optionFeeAmount" INTEGER NOT NULL,
    "optionPrice" INTEGER NOT NULL,
    "commencementDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "extensionDays" INTEGER,
    "extensionFeeAmount" INTEGER,
    "specialConditions" TEXT,
    "stateSpecificClauses" JSONB,
    "draftPdfKey" TEXT,
    "signedPdfKey" TEXT,
    "docusignEnvelopeId" TEXT,
    "docusignStatus" TEXT,
    "sentAt" TIMESTAMP(3),
    "signedAt" TIMESTAMP(3),
    "expiryWarning30Sent" BOOLEAN NOT NULL DEFAULT false,
    "expiryWarning7Sent" BOOLEAN NOT NULL DEFAULT false,
    "expiryWarning1Sent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionDeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentDeed" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "status" "AssignmentDeedStatus" NOT NULL DEFAULT 'DRAFT',
    "assignor_legalName" TEXT NOT NULL,
    "assignor_abn" TEXT,
    "assignor_address" TEXT NOT NULL,
    "assignee_legalName" TEXT NOT NULL,
    "assignee_abn" TEXT,
    "assignee_address" TEXT NOT NULL,
    "state" "AustralianState" NOT NULL,
    "originalOptionPrice" INTEGER NOT NULL,
    "assignmentPrice" INTEGER NOT NULL,
    "adminMargin" INTEGER NOT NULL,
    "developerDeposit" INTEGER NOT NULL,
    "assignmentDate" TIMESTAMP(3) NOT NULL,
    "completionDate" TIMESTAMP(3) NOT NULL,
    "stateSpecificClauses" JSONB,
    "draftPdfKey" TEXT,
    "signedPdfKey" TEXT,
    "docusignEnvelopeId" TEXT,
    "docusignStatus" TEXT,
    "sentAt" TIMESTAMP(3),
    "signedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentDeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeveloperOffer" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "status" "DeveloperOfferStatus" NOT NULL DEFAULT 'PENDING',
    "offerPrice" INTEGER NOT NULL,
    "depositAmount" INTEGER,
    "proposedSettlement" TIMESTAMP(3),
    "conditions" TEXT,
    "developerNotes" TEXT,
    "adminNotes" TEXT,
    "legalAckAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeveloperOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeveloperEnquiry" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "adminReply" TEXT,
    "repliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeveloperEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "stripePaymentIntentId" TEXT,
    "stripeChargeId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'aud',
    "description" TEXT NOT NULL,
    "optionDeedId" TEXT,
    "assignmentDeedId" TEXT,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "metadata" JSONB,
    "resendId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeownerProfile_userId_key" ON "HomeownerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DeveloperProfile_userId_key" ON "DeveloperProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "OptionDeed_propertyId_key" ON "OptionDeed"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "OptionDeed_docusignEnvelopeId_key" ON "OptionDeed"("docusignEnvelopeId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentDeed_propertyId_key" ON "AssignmentDeed"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentDeed_docusignEnvelopeId_key" ON "AssignmentDeed"("docusignEnvelopeId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripePaymentIntentId_key" ON "Payment"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_optionDeedId_key" ON "Payment"("optionDeedId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_assignmentDeedId_key" ON "Payment"("assignmentDeedId");

-- AddForeignKey
ALTER TABLE "HomeownerProfile" ADD CONSTRAINT "HomeownerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeveloperProfile" ADD CONSTRAINT "DeveloperProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDocument" ADD CONSTRAINT "PropertyDocument_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionDeed" ADD CONSTRAINT "OptionDeed_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentDeed" ADD CONSTRAINT "AssignmentDeed_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeveloperOffer" ADD CONSTRAINT "DeveloperOffer_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeveloperOffer" ADD CONSTRAINT "DeveloperOffer_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeveloperEnquiry" ADD CONSTRAINT "DeveloperEnquiry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeveloperEnquiry" ADD CONSTRAINT "DeveloperEnquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_optionDeedId_fkey" FOREIGN KEY ("optionDeedId") REFERENCES "OptionDeed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_assignmentDeedId_fkey" FOREIGN KEY ("assignmentDeedId") REFERENCES "AssignmentDeed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

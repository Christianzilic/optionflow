"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { generateOptionDeedPdf } from "@/deeds/generators/generateOptionDeed";
import { generateAssignmentDeedPdf } from "@/deeds/generators/generateAssignmentDeed";
import type { AustralianState } from "@/lib/generated/prisma/client";

// ─── OPTION DEEDS ─────────────────────────────────────────────────────────────

export async function createOptionDeed(data: {
  propertyId: string;
  grantor_legalName: string;
  grantor_address: string;
  grantor_abn?: string;
  grantee_legalName: string;
  grantee_abn?: string;
  grantee_address: string;
  optionFeeAmount: number;
  optionPrice: number;
  commencementDate: Date;
  expiryDate: Date;
  extensionDays?: number;
  extensionFeeAmount?: number;
  specialConditions?: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const property = await prisma.property.findUnique({ where: { id: data.propertyId } });
  if (!property) throw new Error("Property not found");

  const deed = await prisma.optionDeed.create({
    data: {
      ...data,
      state: property.state,
      status: "DRAFT",
    },
  });

  await prisma.property.update({
    where: { id: data.propertyId },
    data: {
      status: "OPTION_ACTIVE",
      agreedOptionPrice: data.optionPrice,
      optionFeeAmount: data.optionFeeAmount,
    },
  });

  const pdfBuffer = await generateOptionDeedPdf(deed.id);

  const storageKey = `deeds/option/${data.propertyId}/${deed.id}/draft.pdf`;
  await storePdf(storageKey, pdfBuffer);

  await prisma.optionDeed.update({
    where: { id: deed.id },
    data: { draftPdfKey: storageKey },
  });

  await logAudit({
    userId: session.user.id,
    action: "OPTION_DEED_CREATED",
    entityType: "OptionDeed",
    entityId: deed.id,
  });

  revalidatePath(`/admin/properties/${data.propertyId}`);
  return deed;
}

export async function createAssignmentDeed(data: {
  propertyId: string;
  assignee_legalName: string;
  assignee_abn?: string;
  assignee_address: string;
  assignmentPrice: number;
  developerDeposit: number;
  assignmentDate: Date;
  completionDate: Date;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
    include: { optionDeed: true },
  });
  if (!property?.optionDeed) throw new Error("No active option deed found");

  const adminMargin = data.assignmentPrice - property.optionDeed.optionPrice - property.optionDeed.optionFeeAmount;

  const deed = await prisma.assignmentDeed.create({
    data: {
      propertyId: data.propertyId,
      state: property.state,
      assignor_legalName: property.optionDeed.grantee_legalName,
      assignor_abn: property.optionDeed.grantee_abn,
      assignor_address: property.optionDeed.grantee_address,
      assignee_legalName: data.assignee_legalName,
      assignee_abn: data.assignee_abn,
      assignee_address: data.assignee_address,
      originalOptionPrice: property.optionDeed.optionPrice,
      assignmentPrice: data.assignmentPrice,
      adminMargin,
      developerDeposit: data.developerDeposit,
      assignmentDate: data.assignmentDate,
      completionDate: data.completionDate,
      status: "DRAFT",
    },
  });

  const pdfBuffer = await generateAssignmentDeedPdf(deed.id);
  const storageKey = `deeds/assignment/${data.propertyId}/${deed.id}/draft.pdf`;
  await storePdf(storageKey, pdfBuffer);

  await prisma.assignmentDeed.update({
    where: { id: deed.id },
    data: { draftPdfKey: storageKey },
  });

  await prisma.property.update({
    where: { id: data.propertyId },
    data: { status: "UNDER_CONTRACT", adminListPrice: data.assignmentPrice },
  });

  await logAudit({
    userId: session.user.id,
    action: "ASSIGNMENT_DEED_CREATED",
    entityType: "AssignmentDeed",
    entityId: deed.id,
    metadata: { adminMargin },
  });

  revalidatePath(`/admin/properties/${data.propertyId}`);
  return deed;
}

async function storePdf(key: string, buffer: Buffer) {
  const { uploadPdf } = await import("@/lib/storage");
  await uploadPdf(key, buffer);
}

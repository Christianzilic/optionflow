"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import type { AustralianState } from "@/lib/generated/prisma/client";
import { sendPropertySubmittedEmail, sendPropertyApprovedEmail, sendPropertyRejectedEmail } from "@/lib/email";

export async function createPropertyDraft(data: {
  streetAddress: string;
  suburb: string;
  state: AustralianState;
  postcode: string;
  lotNumber?: string;
  planNumber?: string;
  titleReference?: string;
  landAreaSqm?: number;
  currentZoning?: string;
  proposedZoning?: string;
  propertyType: string;
  bedroomCount?: number;
  bathroomCount?: number;
  carSpaces?: number;
  yearBuilt?: number;
  currentUse?: string;
  proposedDevelopment?: string;
  homeownerAskingPrice?: number;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const property = await prisma.property.create({
    data: {
      ...data,
      ownerId: session.user.id,
      status: "DRAFT",
    },
  });

  await logAudit({
    userId: session.user.id,
    action: "PROPERTY_DRAFT_CREATED",
    entityType: "Property",
    entityId: property.id,
  });

  return property;
}

export async function submitProperty(propertyId: string, legalAckAt: Date) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property || property.ownerId !== session.user.id) throw new Error("Not found");
  if (property.status !== "DRAFT") throw new Error("Property already submitted");

  const updated = await prisma.property.update({
    where: { id: propertyId },
    data: { status: "SUBMITTED", submittedAt: new Date(), legalAckAt },
  });

  await logAudit({
    userId: session.user.id,
    action: "PROPERTY_SUBMITTED",
    entityType: "Property",
    entityId: propertyId,
  });

  const address = `${property.streetAddress}, ${property.suburb}`;
  sendPropertySubmittedEmail(session.user.email!, address).catch(() => {});

  revalidatePath("/homeowner/dashboard");
  revalidatePath("/admin/submissions");
  return updated;
}

export async function approveProperty(propertyId: string, adminNotes?: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const updated = await prisma.property.update({
    where: { id: propertyId },
    data: { status: "APPROVED", approvedAt: new Date(), adminNotes },
  });

  await logAudit({
    userId: session.user.id,
    action: "PROPERTY_APPROVED",
    entityType: "Property",
    entityId: propertyId,
    metadata: { adminNotes },
  });

  const owner = await prisma.user.findUnique({ where: { id: updated.ownerId }, select: { email: true } });
  if (owner?.email) {
    const addr = `${updated.streetAddress}, ${updated.suburb}`;
    sendPropertyApprovedEmail(owner.email, addr, adminNotes).catch(() => {});
  }

  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/properties/${propertyId}`);
  return updated;
}

export async function rejectProperty(propertyId: string, adminNotes: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const updated = await prisma.property.update({
    where: { id: propertyId },
    data: { status: "REJECTED", adminNotes },
  });

  await logAudit({
    userId: session.user.id,
    action: "PROPERTY_REJECTED",
    entityType: "Property",
    entityId: propertyId,
    metadata: { adminNotes },
  });

  const owner = await prisma.user.findUnique({ where: { id: updated.ownerId }, select: { email: true } });
  if (owner?.email) {
    const addr = `${updated.streetAddress}, ${updated.suburb}`;
    sendPropertyRejectedEmail(owner.email, addr, adminNotes).catch(() => {});
  }

  revalidatePath("/admin/submissions");
  return updated;
}

export async function listProperty(
  propertyId: string,
  data: { adminListPrice: number; adminDescription: string },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const updated = await prisma.property.update({
    where: { id: propertyId },
    data: { ...data, status: "LISTED", listedAt: new Date() },
  });

  await logAudit({
    userId: session.user.id,
    action: "PROPERTY_LISTED",
    entityType: "Property",
    entityId: propertyId,
    metadata: data,
  });

  revalidatePath("/marketplace");
  revalidatePath(`/admin/properties/${propertyId}`);
  return updated;
}

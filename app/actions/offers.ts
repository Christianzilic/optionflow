"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function submitOffer(data: {
  propertyId: string;
  offerPrice: number;
  depositAmount?: number;
  conditions?: string;
  developerNotes?: string;
  legalAckAt: Date;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "DEVELOPER") throw new Error("Unauthorized");

  const property = await prisma.property.findUnique({ where: { id: data.propertyId, status: "LISTED" } });
  if (!property) throw new Error("Property not available");

  const offer = await prisma.developerOffer.create({
    data: {
      propertyId: data.propertyId,
      developerId: session.user.id,
      offerPrice: data.offerPrice,
      depositAmount: data.depositAmount,
      conditions: data.conditions,
      developerNotes: data.developerNotes,
      legalAckAt: data.legalAckAt,
    },
  });

  await prisma.property.update({
    where: { id: data.propertyId },
    data: { status: "OFFER_RECEIVED" },
  });

  await logAudit({
    userId: session.user.id,
    action: "OFFER_SUBMITTED",
    entityType: "DeveloperOffer",
    entityId: offer.id,
    metadata: { offerPrice: data.offerPrice, propertyId: data.propertyId },
  });

  revalidatePath(`/marketplace/${data.propertyId}`);
  revalidatePath(`/admin/properties/${data.propertyId}`);
  return offer;
}

export async function submitEnquiry(propertyId: string, message: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const enquiry = await prisma.developerEnquiry.create({
    data: { propertyId, userId: session.user.id, message },
  });

  revalidatePath(`/marketplace/${propertyId}`);
  return enquiry;
}

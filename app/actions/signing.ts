"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createSigningEnvelope } from "@/lib/docusign";
import { generateOptionDeedPdf } from "@/deeds/generators/generateOptionDeed";
import { generateAssignmentDeedPdf } from "@/deeds/generators/generateAssignmentDeed";
import { sendDeedSentEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function sendOptionDeedForSigning(deedId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const deed = await prisma.optionDeed.findUniqueOrThrow({
    where: { id: deedId },
    include: {
      property: {
        include: { owner: { select: { name: true, email: true } } },
      },
    },
  });

  if (deed.status !== "DRAFT") throw new Error("Deed is not in DRAFT status");

  const pdfBuffer = await generateOptionDeedPdf(deedId);

  const { envelopeId } = await createSigningEnvelope({
    pdfBuffer,
    documentName: `Option Deed — ${deed.property.streetAddress}.pdf`,
    emailSubject: `Option Deed for signing — ${deed.property.streetAddress}, ${deed.property.suburb}`,
    signer: {
      name: deed.grantor_legalName,
      email: deed.property.owner.email!,
      clientUserId: deed.property.owner.email!,
    },
  });

  await prisma.optionDeed.update({
    where: { id: deedId },
    data: { status: "SENT_FOR_SIGNING", docusignEnvelopeId: envelopeId, docusignStatus: "sent" },
  });

  await logAudit({
    userId: session.user.id,
    action: "OPTION_DEED_SENT_FOR_SIGNING",
    entityType: "OptionDeed",
    entityId: deedId,
    metadata: { envelopeId },
  });

  const address = `${deed.property.streetAddress}, ${deed.property.suburb}`;
  sendDeedSentEmail(deed.property.owner.email!, address, "option").catch(() => {});

  revalidatePath(`/admin/properties/${deed.propertyId}`);
  return { envelopeId };
}

export async function sendAssignmentDeedForSigning(deedId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const deed = await prisma.assignmentDeed.findUniqueOrThrow({
    where: { id: deedId },
    include: { property: { include: { owner: { select: { name: true, email: true } } } } },
  });

  if (deed.status !== "DRAFT") throw new Error("Deed is not in DRAFT status");

  const pdfBuffer = await generateAssignmentDeedPdf(deedId);

  const { envelopeId } = await createSigningEnvelope({
    pdfBuffer,
    documentName: `Assignment Deed — ${deed.property.streetAddress}.pdf`,
    emailSubject: `Assignment Deed for signing — ${deed.property.streetAddress}, ${deed.property.suburb}`,
    signer: {
      name: deed.assignee_legalName,
      email: deed.assignee_address,
      clientUserId: deed.assignee_address,
    },
  });

  await prisma.assignmentDeed.update({
    where: { id: deedId },
    data: { status: "SENT_FOR_SIGNING", docusignEnvelopeId: envelopeId, docusignStatus: "sent" },
  });

  await logAudit({
    userId: session.user.id,
    action: "ASSIGNMENT_DEED_SENT_FOR_SIGNING",
    entityType: "AssignmentDeed",
    entityId: deedId,
    metadata: { envelopeId },
  });

  const address = `${deed.property.streetAddress}, ${deed.property.suburb}`;
  sendDeedSentEmail(deed.property.owner.email!, address, "assignment").catch(() => {});

  revalidatePath(`/admin/properties/${deed.propertyId}`);
  return { envelopeId };
}

export async function getEmbeddedSigningUrl(deedId: string, deedType: "option" | "assignment") {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const APP_URL_LOCAL = APP_URL;

  if (deedType === "option") {
    const deed = await prisma.optionDeed.findUniqueOrThrow({
      where: { id: deedId },
      include: { property: { include: { owner: { select: { name: true, email: true } } } } },
    });
    if (deed.status !== "SENT_FOR_SIGNING" || !deed.docusignEnvelopeId) throw new Error("Not ready for signing");

    const { createEmbeddedSigningUrl } = await import("@/lib/docusign");
    return createEmbeddedSigningUrl({
      envelopeId: deed.docusignEnvelopeId,
      signer: {
        name: deed.grantor_legalName,
        email: deed.property.owner.email!,
        clientUserId: deed.property.owner.email!,
      },
      returnUrl: `${APP_URL_LOCAL}/homeowner/properties/${deed.propertyId}?signed=1`,
    });
  } else {
    const deed = await prisma.assignmentDeed.findUniqueOrThrow({
      where: { id: deedId },
      include: { property: true },
    });
    if (deed.status !== "SENT_FOR_SIGNING" || !deed.docusignEnvelopeId) throw new Error("Not ready for signing");

    const { createEmbeddedSigningUrl } = await import("@/lib/docusign");
    return createEmbeddedSigningUrl({
      envelopeId: deed.docusignEnvelopeId,
      signer: {
        name: deed.assignee_legalName,
        email: deed.assignee_address,
        clientUserId: deed.assignee_address,
      },
      returnUrl: `${APP_URL_LOCAL}/developer/offers?signed=1`,
    });
  }
}

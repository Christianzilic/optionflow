import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadPdf } from "@/lib/storage";
import { sendDeedSignedEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import crypto from "crypto";

function verifyHmac(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("base64");
  return hmac === signature;
}

// Docusign sends Connect webhooks as JSON
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-docusign-signature-1") ?? "";
  const secret = process.env.DOCUSIGN_WEBHOOK_SECRET ?? "";

  // Verify HMAC if secret is configured
  if (secret && !verifyHmac(body, signature, secret)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let event: {
    event: string;
    data: {
      envelopeId: string;
      envelopeSummary?: { status?: string };
    };
  };

  try {
    event = JSON.parse(body);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const { envelopeId } = event.data;
  const status = event.data.envelopeSummary?.status ?? event.event;

  if (status !== "completed") {
    // Update docusignStatus but don't do full completion flow
    await prisma.optionDeed.updateMany({
      where: { docusignEnvelopeId: envelopeId },
      data: { docusignStatus: status },
    }).catch(() => {});
    await prisma.assignmentDeed.updateMany({
      where: { docusignEnvelopeId: envelopeId },
      data: { docusignStatus: status },
    }).catch(() => {});
    return new NextResponse("ok");
  }

  // Download signed PDF
  let signedPdfBuffer: Buffer;
  try {
    const { downloadSignedDocument } = await import("@/lib/docusign");
    signedPdfBuffer = await downloadSignedDocument(envelopeId);
  } catch (err) {
    console.error("[docusign webhook] failed to download signed PDF", err);
    return new NextResponse("Download failed", { status: 500 });
  }

  // Try option deed first
  const optionDeed = await prisma.optionDeed.findFirst({
    where: { docusignEnvelopeId: envelopeId },
    include: {
      property: {
        include: { owner: { select: { email: true } } },
      },
    },
  });

  if (optionDeed) {
    const storageKey = `deeds/option/${optionDeed.propertyId}/${optionDeed.id}/signed.pdf`;
    await uploadPdf(storageKey, signedPdfBuffer);

    await prisma.optionDeed.update({
      where: { id: optionDeed.id },
      data: {
        status: "SIGNED",
        docusignStatus: "completed",
        signedPdfKey: storageKey,
        signedAt: new Date(),
      },
    });

    await prisma.property.update({
      where: { id: optionDeed.propertyId },
      data: { status: "OPTION_ACTIVE" },
    });

    await logAudit({
      action: "OPTION_DEED_SIGNED",
      entityType: "OptionDeed",
      entityId: optionDeed.id,
      metadata: { envelopeId },
    });

    const address = `${optionDeed.property.streetAddress}, ${optionDeed.property.suburb}`;
    if (optionDeed.property.owner.email) {
      sendDeedSignedEmail(optionDeed.property.owner.email, address, "option").catch(() => {});
    }
    return new NextResponse("ok");
  }

  // Try assignment deed
  const assignmentDeed = await prisma.assignmentDeed.findFirst({
    where: { docusignEnvelopeId: envelopeId },
    include: {
      property: {
        include: { owner: { select: { email: true } } },
      },
    },
  });

  if (assignmentDeed) {
    const storageKey = `deeds/assignment/${assignmentDeed.propertyId}/${assignmentDeed.id}/signed.pdf`;
    await uploadPdf(storageKey, signedPdfBuffer);

    await prisma.assignmentDeed.update({
      where: { id: assignmentDeed.id },
      data: {
        status: "SIGNED",
        docusignStatus: "completed",
        signedPdfKey: storageKey,
        signedAt: new Date(),
      },
    });

    await logAudit({
      action: "ASSIGNMENT_DEED_SIGNED",
      entityType: "AssignmentDeed",
      entityId: assignmentDeed.id,
      metadata: { envelopeId },
    });

    const address = `${assignmentDeed.property.streetAddress}, ${assignmentDeed.property.suburb}`;
    if (assignmentDeed.property.owner.email) {
      sendDeedSignedEmail(assignmentDeed.property.owner.email, address, "assignment").catch(() => {});
    }
  }

  return new NextResponse("ok");
}

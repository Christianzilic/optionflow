import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!); }

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) return new NextResponse("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const { type, referenceId, userId } = intent.metadata as {
      type: "OPTION_FEE" | "DEVELOPER_DEPOSIT";
      referenceId: string;
      userId: string;
    };

    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: intent.id },
      data: { status: "SUCCEEDED" },
    });

    if (type === "OPTION_FEE") {
      await prisma.optionDeed.update({
        where: { id: referenceId },
        data: { status: "ACTIVE" },
      });
      await logAudit({
        userId,
        action: "OPTION_FEE_PAID",
        entityType: "OptionDeed",
        entityId: referenceId,
        metadata: { amount: intent.amount, intentId: intent.id },
      });
    }

    if (type === "DEVELOPER_DEPOSIT") {
      await prisma.assignmentDeed.update({
        where: { id: referenceId },
        data: { status: "COMPLETED" },
      });
      const deed = await prisma.assignmentDeed.findUnique({
        where: { id: referenceId },
        select: { propertyId: true },
      });
      if (deed) {
        await prisma.property.update({
          where: { id: deed.propertyId },
          data: { status: "ASSIGNED" },
        });
      }
      await logAudit({
        userId,
        action: "DEVELOPER_DEPOSIT_PAID",
        entityType: "AssignmentDeed",
        entityId: referenceId,
        metadata: { amount: intent.amount, intentId: intent.id },
      });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: intent.id },
      data: { status: "FAILED" },
    });
  }

  return new NextResponse("ok");
}

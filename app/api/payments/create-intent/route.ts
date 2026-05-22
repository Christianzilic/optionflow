import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!); }

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const body = await request.json();
  const { type, referenceId } = body as { type: "OPTION_FEE" | "DEVELOPER_DEPOSIT"; referenceId: string };

  let amountCents: number;
  let description: string;
  let propertyId: string;

  if (type === "OPTION_FEE") {
    const deed = await prisma.optionDeed.findUnique({
      where: { id: referenceId },
      include: { property: { select: { id: true, streetAddress: true, suburb: true } } },
    });
    if (!deed) return new NextResponse("Deed not found", { status: 404 });
    amountCents = deed.optionFeeAmount;
    description = `Option fee — ${deed.property.streetAddress}, ${deed.property.suburb}`;
    propertyId = deed.property.id;
  } else if (type === "DEVELOPER_DEPOSIT") {
    const deed = await prisma.assignmentDeed.findUnique({
      where: { id: referenceId },
      include: { property: { select: { id: true, streetAddress: true, suburb: true } } },
    });
    if (!deed) return new NextResponse("Deed not found", { status: 404 });
    amountCents = deed.developerDeposit;
    description = `Developer deposit — ${deed.property.streetAddress}, ${deed.property.suburb}`;
    propertyId = deed.property.id;
  } else {
    return new NextResponse("Invalid payment type", { status: 400 });
  }

  // Ensure Stripe customer exists
  let stripeCustomerId = (await prisma.user.findUnique({ where: { id: session.user.id } }))?.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await getStripe().customers.create({
      email: session.user.email,
      name: session.user.name ?? undefined,
      metadata: { userId: session.user.id },
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({ where: { id: session.user.id }, data: { stripeCustomerId } });
  }

  const intent = await getStripe().paymentIntents.create({
    amount: amountCents,
    currency: "aud",
    customer: stripeCustomerId,
    description,
    metadata: { type, referenceId, userId: session.user.id },
  });

  await prisma.payment.create({
    data: {
      propertyId,
      stripePaymentIntentId: intent.id,
      amount: amountCents,
      description,
      optionDeedId: type === "OPTION_FEE" ? referenceId : undefined,
      assignmentDeedId: type === "DEVELOPER_DEPOSIT" ? referenceId : undefined,
    },
  });

  return NextResponse.json({ clientSecret: intent.client_secret });
}

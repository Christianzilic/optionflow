"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateDeveloperProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const companyName = formData.get("companyName") as string;
  const abn = formData.get("abn") as string;
  const licenseNumber = formData.get("licenseNumber") as string;
  const preferredStates = formData.getAll("preferredStates") as import("@/lib/generated/prisma/client").AustralianState[];
  const minPrice = formData.get("preferredMinPrice") ? Math.round(parseFloat(formData.get("preferredMinPrice") as string) * 100) : null;
  const maxPrice = formData.get("preferredMaxPrice") ? Math.round(parseFloat(formData.get("preferredMaxPrice") as string) * 100) : null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name || null, phone: phone || null },
  });

  await prisma.developerProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      companyName: companyName || null,
      abn: abn || null,
      licenseNumber: licenseNumber || null,
      preferredStates,
      preferredMinPrice: minPrice,
      preferredMaxPrice: maxPrice,
    },
    update: {
      companyName: companyName || null,
      abn: abn || null,
      licenseNumber: licenseNumber || null,
      preferredStates,
      preferredMinPrice: minPrice,
      preferredMaxPrice: maxPrice,
    },
  });

  revalidatePath("/developer/profile");
}

export async function updateHomeownerProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const legalName = formData.get("legalName") as string;
  const abn = formData.get("abn") as string;
  const solicitorName = formData.get("solicitorName") as string;
  const solicitorEmail = formData.get("solicitorEmail") as string;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name || null, phone: phone || null },
  });

  await prisma.homeownerProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      legalName: legalName || null,
      abn: abn || null,
      solicitorName: solicitorName || null,
      solicitorEmail: solicitorEmail || null,
    },
    update: {
      legalName: legalName || null,
      abn: abn || null,
      solicitorName: solicitorName || null,
      solicitorEmail: solicitorEmail || null,
    },
  });

  revalidatePath("/homeowner/profile");
}

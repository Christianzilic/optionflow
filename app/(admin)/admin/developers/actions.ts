"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleDeveloperVerified(profileId: string, currentlyVerified: boolean) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.developerProfile.update({
    where: { id: profileId },
    data: { isVerified: !currentlyVerified },
  });

  revalidatePath("/admin/developers");
}

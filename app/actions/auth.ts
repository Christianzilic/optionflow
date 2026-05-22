"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import type { UserRole } from "@/lib/generated/prisma/client";

export type RegisterState =
  | { success: true; userId: string }
  | { success: false; error: string };

export async function registerUser(formData: FormData): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "HOMEOWNER") as UserRole;
  const tosAccepted = formData.get("tosAccepted") === "true";

  if (!name || !email || !password) return { success: false, error: "All fields are required." };
  if (password.length < 8) return { success: false, error: "Password must be at least 8 characters." };
  if (!tosAccepted) return { success: false, error: "You must accept the terms of service." };
  if (!["HOMEOWNER", "DEVELOPER"].includes(role)) return { success: false, error: "Invalid role." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { success: false, error: "An account with that email already exists." };

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      tosAcceptedAt: new Date(),
      homeownerProfile: role === "HOMEOWNER" ? { create: {} } : undefined,
      developerProfile: role === "DEVELOPER" ? { create: { preferredStates: [], preferredTypes: [] } } : undefined,
    },
  });

  await logAudit({ userId: user.id, action: "USER_REGISTERED", entityType: "User", entityId: user.id, metadata: { role } });

  return { success: true, userId: user.id };
}

"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function logAudit({
  userId,
  action,
  entityType,
  entityId,
  metadata,
  ipAddress,
}: {
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: { userId, action, entityType, entityId, metadata: metadata as Prisma.InputJsonValue | undefined, ipAddress },
    });
  } catch {
    // Audit failures must never break the main flow
    console.error("[audit] failed to write audit log", { action, entityType, entityId });
  }
}

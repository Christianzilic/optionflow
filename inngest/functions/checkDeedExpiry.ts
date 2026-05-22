import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { sendExpiryWarningEmail } from "@/lib/email";

export const checkDeedExpiry = inngest.createFunction(
  { id: "check-deed-expiry", name: "Check option deed expiry", triggers: [{ cron: "0 21 * * *" }] }, // 07:00 AEST (UTC+10)
  async ({ step }) => {
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in1Day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

    const activeDeeds = await step.run("fetch-active-deeds", () =>
      prisma.optionDeed.findMany({
        where: { status: "ACTIVE" },
        include: {
          property: {
            select: { ownerId: true, streetAddress: true, suburb: true, id: true },
            include: { owner: { select: { email: true } } },
          },
        },
      }),
    );

    let expired = 0;
    let warned = 0;

    for (const deed of activeDeeds) {
      const daysUntil = Math.floor((new Date(deed.expiryDate).getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

      if (daysUntil <= 0) {
        await step.run(`expire-deed-${deed.id}`, async () => {
          await prisma.optionDeed.update({ where: { id: deed.id }, data: { status: "EXPIRED" } });
          await prisma.property.update({
            where: { id: deed.propertyId },
            data: { status: "OPTION_EXPIRED" },
          });
          await logAudit({ action: "OPTION_DEED_EXPIRED", entityType: "OptionDeed", entityId: deed.id });
        });
        expired++;
      } else if (daysUntil <= 1 && !deed.expiryWarning1Sent) {
        await step.run(`warn-1day-${deed.id}`, async () => {
          await prisma.optionDeed.update({ where: { id: deed.id }, data: { expiryWarning1Sent: true } });
          const email = deed.property.owner?.email;
          if (email) await sendExpiryWarningEmail(email, `${deed.property.streetAddress}, ${deed.property.suburb}`, 1).catch(() => {});
        });
        warned++;
      } else if (daysUntil <= 7 && !deed.expiryWarning7Sent) {
        await step.run(`warn-7day-${deed.id}`, async () => {
          await prisma.optionDeed.update({ where: { id: deed.id }, data: { expiryWarning7Sent: true } });
          const email = deed.property.owner?.email;
          if (email) await sendExpiryWarningEmail(email, `${deed.property.streetAddress}, ${deed.property.suburb}`, 7).catch(() => {});
        });
        warned++;
      } else if (daysUntil <= 30 && !deed.expiryWarning30Sent) {
        await step.run(`warn-30day-${deed.id}`, async () => {
          await prisma.optionDeed.update({ where: { id: deed.id }, data: { expiryWarning30Sent: true } });
          const email = deed.property.owner?.email;
          if (email) await sendExpiryWarningEmail(email, `${deed.property.streetAddress}, ${deed.property.suburb}`, 30).catch(() => {});
        });
        warned++;
      }
    }

    return { checked: activeDeeds.length, expired, warned };
  },
);

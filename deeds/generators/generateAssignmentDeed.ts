import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { prisma } from "@/lib/prisma";
import { resolveStateClauses } from "@/deeds/utils/stateClauseResolver";
import { AssignmentDeedDocument } from "@/deeds/templates/assignment-deed/AssignmentDeedDocument";
import type { AssignmentDeedData } from "@/deeds/types";
import type { AustralianState } from "@/lib/generated/prisma/client";

export async function generateAssignmentDeedPdf(deedId: string): Promise<Buffer> {
  const deed = await prisma.assignmentDeed.findUniqueOrThrow({
    where: { id: deedId },
    include: {
      property: {
        select: { streetAddress: true, suburb: true, state: true, postcode: true },
      },
    },
  });

  const clauses = resolveStateClauses(deed.state as AustralianState);

  const data: AssignmentDeedData = {
    deedId: deed.id,
    propertyAddress: deed.property.streetAddress,
    suburb: deed.property.suburb,
    state: deed.state,
    postcode: deed.property.postcode,
    assignor_legalName: deed.assignor_legalName,
    assignor_abn: deed.assignor_abn ?? undefined,
    assignor_address: deed.assignor_address,
    assignee_legalName: deed.assignee_legalName,
    assignee_abn: deed.assignee_abn ?? undefined,
    assignee_address: deed.assignee_address,
    originalOptionPrice: deed.originalOptionPrice,
    assignmentPrice: deed.assignmentPrice,
    adminMargin: deed.adminMargin,
    developerDeposit: deed.developerDeposit,
    assignmentDate: deed.assignmentDate,
    completionDate: deed.completionDate,
    stateSpecificClauses: clauses,
    generatedAt: new Date(),
    platformAbn: process.env.PLATFORM_ABN,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(
    React.createElement(AssignmentDeedDocument, { data }) as any,
  );

  return Buffer.from(buffer);
}

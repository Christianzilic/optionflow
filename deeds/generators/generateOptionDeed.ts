import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { prisma } from "@/lib/prisma";
import { resolveStateClauses } from "@/deeds/utils/stateClauseResolver";
import { OptionDeedDocument } from "@/deeds/templates/option-deed/OptionDeedDocument";
import type { OptionDeedData } from "@/deeds/types";
import type { AustralianState } from "@/lib/generated/prisma/client";

export async function generateOptionDeedPdf(deedId: string): Promise<Buffer> {
  const deed = await prisma.optionDeed.findUniqueOrThrow({
    where: { id: deedId },
    include: {
      property: {
        select: {
          streetAddress: true,
          suburb: true,
          state: true,
          postcode: true,
          lotNumber: true,
          planNumber: true,
          titleReference: true,
        },
      },
    },
  });

  const clauses = resolveStateClauses(deed.state as AustralianState);

  const data: OptionDeedData = {
    deedId: deed.id,
    propertyAddress: deed.property.streetAddress,
    suburb: deed.property.suburb,
    state: deed.state,
    postcode: deed.property.postcode,
    lotNumber: deed.property.lotNumber ?? undefined,
    planNumber: deed.property.planNumber ?? undefined,
    titleReference: deed.property.titleReference ?? undefined,
    grantor_legalName: deed.grantor_legalName,
    grantor_address: deed.grantor_address,
    grantor_abn: deed.grantor_abn ?? undefined,
    grantee_legalName: deed.grantee_legalName,
    grantee_abn: deed.grantee_abn ?? undefined,
    grantee_address: deed.grantee_address,
    optionFeeAmount: deed.optionFeeAmount,
    optionPrice: deed.optionPrice,
    commencementDate: deed.commencementDate,
    expiryDate: deed.expiryDate,
    extensionDays: deed.extensionDays ?? undefined,
    extensionFeeAmount: deed.extensionFeeAmount ?? undefined,
    specialConditions: deed.specialConditions ?? undefined,
    stateSpecificClauses: clauses,
    generatedAt: new Date(),
    platformAbn: process.env.PLATFORM_ABN,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(
    React.createElement(OptionDeedDocument, { data }) as any,
  );

  return Buffer.from(buffer);
}

import type { StateSpecificClauses } from "@/deeds/types";

export const actClauses: StateSpecificClauses = {
  coolingOffPeriod:
    "A cooling-off period may apply pursuant to the Civil Law (Sale of Residential Property) Act 2003 (ACT). The parties should seek independent legal advice.",
  stampDutyNote:
    "Duty may be payable pursuant to the Duties Act 1999 (ACT). The parties are advised to seek independent advice from the ACT Revenue Office.",
  landTaxNote:
    "Land tax obligations remain with the registered owner. Note that the ACT has a unique land value system — seek specific advice.",
  planningReferenceLabel: "Development Application (DA)",
  titleSystemNote:
    "Land in the ACT is held on Crown leasehold. Title is identified by Unit Plan and Block.",
  witnessRequirements:
    "Each party must sign in the presence of an independent adult witness. The witness must not be a party to this deed or related to any party.",
  additionalDisclosures: [
    "This option deed is subject to the Civil Law (Property) Act 2006 (ACT).",
    "The Grantor acknowledges their obligations to provide pre-contract disclosure documents pursuant to the Civil Law (Sale of Residential Property) Act 2003 (ACT) upon exercise of this option.",
    "Land in the ACT is subject to Crown leasehold conditions — the parties should confirm compliance with any applicable Crown lease covenants.",
  ],
  contractActRef: "Civil Law (Property) Act 2006 (ACT)",
};

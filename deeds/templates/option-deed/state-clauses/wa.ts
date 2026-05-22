import type { StateSpecificClauses } from "@/deeds/types";

export const waClauses: StateSpecificClauses = {
  coolingOffPeriod: null,
  stampDutyNote:
    "Duty may be payable pursuant to the Duties Act 2008 (WA). The parties are advised to seek independent duty advice from the Office of State Revenue.",
  landTaxNote:
    "Land tax obligations pursuant to the Land Tax Assessment Act 2002 (WA) remain with the registered owner until completion.",
  planningReferenceLabel: "Development Application (DA)",
  titleSystemNote:
    "The property is held under the Transfer of Land Act 1893 (WA). Title is identified by Certificate of Title Volume and Folio.",
  witnessRequirements:
    "Each party must sign this deed in the presence of a witness aged 18 or older who is not a party to this deed.",
  additionalDisclosures: [
    "This option deed is subject to the Property Law Act 1969 (WA).",
    "The parties note REIWA standard conditions may be incorporated by reference upon exercise of this option, subject to specific agreement.",
  ],
  contractActRef: "Property Law Act 1969 (WA)",
};

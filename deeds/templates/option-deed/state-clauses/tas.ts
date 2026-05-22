import type { StateSpecificClauses } from "@/deeds/types";

export const tasClauses: StateSpecificClauses = {
  coolingOffPeriod: null,
  stampDutyNote:
    "Duty may be payable pursuant to the Duties Act 2001 (Tas). The parties are advised to seek independent advice from the State Revenue Office of Tasmania.",
  landTaxNote:
    "Land tax obligations pursuant to the Land Tax Act 2000 (Tas) remain with the registered owner until completion.",
  planningReferenceLabel: "Development Application (DA)",
  titleSystemNote:
    "The property is held under the Land Titles Act 1980 (Tas). Title is identified by Certificate of Title Volume and Folio.",
  witnessRequirements:
    "Execution by a company must be witnessed by a company officer. Individual parties must sign in the presence of an adult witness not a party to this deed.",
  additionalDisclosures: [
    "This option deed is subject to the Conveyancing and Law of Property Act 1884 (Tas).",
  ],
  contractActRef: "Conveyancing and Law of Property Act 1884 (Tas)",
};

import type { StateSpecificClauses } from "@/deeds/types";

export const nswClauses: StateSpecificClauses = {
  coolingOffPeriod: null,
  stampDutyNote:
    "Duty may be payable on exercise of this option pursuant to the Duties Act 1997 (NSW). The Grantee is advised to seek independent advice regarding any duty obligations.",
  landTaxNote:
    "Land tax obligations pursuant to the Land Tax Management Act 1956 (NSW) remain with the registered owner until completion.",
  planningReferenceLabel: "Development Application (DA)",
  titleSystemNote:
    "The property is held under the Real Property Act 1900 (NSW). Title is identified by Folio Identifier.",
  witnessRequirements:
    "Each party must sign this deed in the presence of a witness who is 18 years or older and not a party to this deed.",
  additionalDisclosures: [
    "This option deed is subject to the Conveyancing Act 1919 (NSW).",
    "The parties acknowledge that this deed does not constitute a contract for the sale of land for the purposes of s 66W of the Conveyancing Act 1919 (NSW) until the option is exercised.",
  ],
  contractActRef: "Conveyancing Act 1919 (NSW)",
};

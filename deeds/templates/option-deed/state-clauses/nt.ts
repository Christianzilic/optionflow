import type { StateSpecificClauses } from "@/deeds/types";

export const ntClauses: StateSpecificClauses = {
  coolingOffPeriod: null,
  stampDutyNote:
    "Stamp duty may be payable pursuant to the Stamp Duty Act 1978 (NT). The parties are advised to seek independent advice from the Territory Revenue Office.",
  landTaxNote:
    "The Northern Territory does not impose land tax on most residential properties. The parties should confirm the applicable position for this property.",
  planningReferenceLabel: "Development Application (DA)",
  titleSystemNote:
    "The property is held under the Land Title Act 2000 (NT). Title is identified by Title Reference.",
  witnessRequirements:
    "Each party must sign this deed in the presence of an adult witness who is not a party to this deed.",
  additionalDisclosures: [
    "This option deed is subject to the Law of Property Act 2000 (NT).",
    "If the property is subject to a pastoral lease, specific Territory legislation may apply — the parties should seek advice regarding any relevant restrictions.",
  ],
  contractActRef: "Law of Property Act 2000 (NT)",
};

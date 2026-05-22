import type { StateSpecificClauses } from "@/deeds/types";

export const qldClauses: StateSpecificClauses = {
  coolingOffPeriod:
    "A statutory cooling-off period of 5 business days may apply pursuant to the Property Occupations Act 2014 (Qld). The parties should seek independent legal advice.",
  stampDutyNote:
    "Transfer duty may be payable pursuant to the Duties Act 2001 (Qld). Duty is typically assessed on the higher of the consideration or the unencumbered value of the property.",
  landTaxNote:
    "Land tax obligations pursuant to the Land Tax Act 2010 (Qld) remain with the registered owner until completion.",
  planningReferenceLabel: "Development Application (DA)",
  titleSystemNote:
    "The property is held under the Land Title Act 1994 (Qld). Title is identified by Title Reference.",
  witnessRequirements:
    "Each signatory must sign in the presence of a witness who is 18 years or older, not a party to this deed, and not the solicitor acting for any party.",
  additionalDisclosures: [
    "This option deed is subject to the Property Law Act 1974 (Qld).",
    "The parties acknowledge the put and call option structure and their respective obligations under Queensland law.",
    "If the property is affected by a Body Corporate, the Body Corporate and Community Management Act 1997 (Qld) may apply.",
  ],
  contractActRef: "Property Law Act 1974 (Qld)",
};

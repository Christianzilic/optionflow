import type { AustralianState } from "@/lib/generated/prisma/client";
import type { StateSpecificClauses } from "@/deeds/types";
import { nswClauses } from "@/deeds/templates/option-deed/state-clauses/nsw";
import { vicClauses } from "@/deeds/templates/option-deed/state-clauses/vic";
import { qldClauses } from "@/deeds/templates/option-deed/state-clauses/qld";
import { waClauses } from "@/deeds/templates/option-deed/state-clauses/wa";
import { saClauses } from "@/deeds/templates/option-deed/state-clauses/sa";
import { tasClauses } from "@/deeds/templates/option-deed/state-clauses/tas";
import { actClauses } from "@/deeds/templates/option-deed/state-clauses/act";
import { ntClauses } from "@/deeds/templates/option-deed/state-clauses/nt";

const clauseMap: Record<AustralianState, StateSpecificClauses> = {
  NSW: nswClauses,
  VIC: vicClauses,
  QLD: qldClauses,
  WA: waClauses,
  SA: saClauses,
  TAS: tasClauses,
  ACT: actClauses,
  NT: ntClauses,
};

export function resolveStateClauses(state: AustralianState): StateSpecificClauses {
  return clauseMap[state];
}

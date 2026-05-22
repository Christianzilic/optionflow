export interface StateSpecificClauses {
  coolingOffPeriod: string | null;
  stampDutyNote: string;
  landTaxNote: string;
  planningReferenceLabel: string;
  titleSystemNote: string;
  witnessRequirements: string;
  additionalDisclosures: string[];
  contractActRef: string;
}

export interface OptionDeedData {
  deedId: string;
  propertyAddress: string;
  lotNumber?: string;
  planNumber?: string;
  titleReference?: string;
  state: string;
  suburb: string;
  postcode: string;
  grantor_legalName: string;
  grantor_address: string;
  grantor_abn?: string;
  grantee_legalName: string;
  grantee_abn?: string;
  grantee_address: string;
  optionFeeAmount: number;
  optionPrice: number;
  commencementDate: Date;
  expiryDate: Date;
  extensionDays?: number;
  extensionFeeAmount?: number;
  specialConditions?: string;
  stateSpecificClauses: StateSpecificClauses;
  generatedAt: Date;
  platformAbn?: string;
}

export interface AssignmentDeedData {
  deedId: string;
  propertyAddress: string;
  state: string;
  suburb: string;
  postcode: string;
  assignor_legalName: string;
  assignor_abn?: string;
  assignor_address: string;
  assignee_legalName: string;
  assignee_abn?: string;
  assignee_address: string;
  originalOptionPrice: number;
  assignmentPrice: number;
  adminMargin: number;
  developerDeposit: number;
  assignmentDate: Date;
  completionDate: Date;
  stateSpecificClauses: StateSpecificClauses;
  generatedAt: Date;
  platformAbn?: string;
}

import type { PropertyStatus, OptionDeedStatus, AssignmentDeedStatus } from "@/lib/generated/prisma/client";

export function propertyStatusLabel(status: PropertyStatus): string {
  const labels: Record<PropertyStatus, string> = {
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under review",
    APPROVED: "Approved",
    OPTION_ACTIVE: "Option active",
    LISTED: "Listed",
    OFFER_RECEIVED: "Offer received",
    UNDER_CONTRACT: "Under contract",
    ASSIGNED: "Assigned",
    REJECTED: "Rejected",
    OPTION_EXPIRED: "Option expired",
    WITHDRAWN: "Withdrawn",
  };
  return labels[status] ?? status;
}

export function propertyStatusColor(status: PropertyStatus): string {
  const colors: Record<PropertyStatus, string> = {
    DRAFT: "bg-zinc-100 text-zinc-600",
    SUBMITTED: "bg-blue-100 text-blue-700",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    OPTION_ACTIVE: "bg-emerald-100 text-emerald-700",
    LISTED: "bg-purple-100 text-purple-700",
    OFFER_RECEIVED: "bg-orange-100 text-orange-700",
    UNDER_CONTRACT: "bg-blue-100 text-blue-700",
    ASSIGNED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    OPTION_EXPIRED: "bg-zinc-100 text-zinc-500",
    WITHDRAWN: "bg-zinc-100 text-zinc-500",
  };
  return colors[status] ?? "bg-zinc-100 text-zinc-600";
}

export function formatAud(cents: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(cents / 100);
}

export const AU_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;

export const STATE_LABELS: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  WA: "Western Australia",
  SA: "South Australia",
  TAS: "Tasmania",
  ACT: "Australian Capital Territory",
  NT: "Northern Territory",
};

export const PROPERTY_TYPES = [
  { value: "house", label: "House / Dwelling" },
  { value: "unit", label: "Unit / Apartment" },
  { value: "vacant_land", label: "Vacant land" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "mixed", label: "Mixed use" },
] as const;

export function optionDeedStatusLabel(status: OptionDeedStatus): string {
  const labels: Record<OptionDeedStatus, string> = {
    DRAFT: "Draft",
    SENT_FOR_SIGNING: "Awaiting signatures",
    SIGNED: "Signed",
    ACTIVE: "Active",
    EXPIRED: "Expired",
    CANCELLED: "Cancelled",
  };
  return labels[status] ?? status;
}

export function assignmentDeedStatusLabel(status: AssignmentDeedStatus): string {
  const labels: Record<AssignmentDeedStatus, string> = {
    DRAFT: "Draft",
    SENT_FOR_SIGNING: "Awaiting signatures",
    SIGNED: "Signed",
    COMPLETED: "Completed",
    VOIDED: "Voided",
  };
  return labels[status] ?? status;
}

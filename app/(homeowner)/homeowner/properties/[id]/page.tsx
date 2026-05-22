import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { propertyStatusLabel, propertyStatusColor, formatAud, optionDeedStatusLabel, STATE_LABELS } from "@/lib/property-utils";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { SignDeedButton } from "./sign-deed-button";

export default async function HomeownerPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const property = await prisma.property.findUnique({
    where: { id },
    include: { optionDeed: true },
  });

  if (!property || property.ownerId !== session!.user.id) notFound();

  const daysUntilExpiry = property.optionDeed
    ? Math.ceil((property.optionDeed.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/homeowner/dashboard">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Dashboard</Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{property.streetAddress}</h1>
          <p className="text-zinc-500">{property.suburb}, {STATE_LABELS[property.state]} {property.postcode}</p>
        </div>
        <Badge className={propertyStatusColor(property.status)}>{propertyStatusLabel(property.status)}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <CardHeader><CardTitle className="text-sm">Property details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Type" value={property.propertyType} />
            <Row label="Land area" value={property.landAreaSqm ? `${property.landAreaSqm.toLocaleString()} m²` : null} />
            <Row label="Bedrooms / Bathrooms" value={[property.bedroomCount, property.bathroomCount].filter(Boolean).join(" / ") || null} />
            <Row label="Car spaces" value={property.carSpaces?.toString()} />
            <Row label="Year built" value={property.yearBuilt?.toString()} />
            <Row label="Current zoning" value={property.currentZoning} />
            <Row label="Lot / Plan" value={[property.lotNumber, property.planNumber].filter(Boolean).join(" / ") || null} />
            <Row label="Your asking price" value={property.homeownerAskingPrice ? formatAud(property.homeownerAskingPrice) : null} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Submission timeline</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Created" value={formatDistanceToNow(property.createdAt, { addSuffix: true })} />
            <Row label="Submitted" value={property.submittedAt ? formatDistanceToNow(property.submittedAt, { addSuffix: true }) : null} />
            <Row label="Approved" value={property.approvedAt ? formatDistanceToNow(property.approvedAt, { addSuffix: true }) : null} />
            {property.adminNotes && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-medium text-amber-800 mb-1">Admin notes</p>
                <p className="text-xs text-amber-700">{property.adminNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {property.optionDeed && (
          <Card className={daysUntilExpiry !== null && daysUntilExpiry <= 7 ? "border-red-300 bg-red-50" : ""}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Option deed</CardTitle>
              <Badge variant="secondary">{optionDeedStatusLabel(property.optionDeed.status)}</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Option fee" value={formatAud(property.optionDeed.optionFeeAmount)} />
              <Row label="Option price" value={formatAud(property.optionDeed.optionPrice)} />
              <Row label="Commencement" value={format(property.optionDeed.commencementDate, "d MMM yyyy")} />
              <Row label="Expiry" value={format(property.optionDeed.expiryDate, "d MMM yyyy")} />
              {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                <div className={`mt-2 text-xs font-medium ${daysUntilExpiry <= 7 ? "text-red-600" : daysUntilExpiry <= 30 ? "text-amber-600" : "text-zinc-500"}`}>
                  {daysUntilExpiry} days until expiry
                </div>
              )}
              <div className="pt-2 flex gap-2 flex-wrap">
                {property.optionDeed.draftPdfKey && (
                  <Link href={`/api/option-deeds/${property.optionDeed.id}/preview`} target="_blank">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" /> View deed PDF
                    </Button>
                  </Link>
                )}
                {property.optionDeed.status === "SENT_FOR_SIGNING" && (
                  <SignDeedButton deedId={property.optionDeed.id} />
                )}
                {property.optionDeed.status === "SIGNED" && (
                  <span className="text-xs text-green-700 font-medium flex items-center gap-1">✓ Signed</span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {property.proposedDevelopment && (
          <Card>
            <CardHeader><CardTitle className="text-sm">Proposed development</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600 whitespace-pre-wrap">{property.proposedDevelopment}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-2">
      <span className="text-zinc-500 shrink-0">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LegalDisclaimer } from "@/components/ui/legal-disclaimer";
import { formatAud, STATE_LABELS } from "@/lib/property-utils";
import { MapPin, FileText } from "lucide-react";
import Link from "next/link";
import { OfferForm } from "./offer-form";
import { EnquiryForm } from "./enquiry-form";

export default async function MarketplacePropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const property = await prisma.property.findUnique({
    where: { id, status: "LISTED" },
    include: {
      documents: { where: { isPublic: true } },
    },
  });

  if (!property) notFound();

  const isVerifiedDeveloper =
    session?.user?.role === "DEVELOPER" &&
    (await prisma.developerProfile.findUnique({
      where: { userId: session.user.id },
      select: { isVerified: true },
    }))?.isVerified;

  return (
    <div className="space-y-6 max-w-4xl">
      <LegalDisclaimer dismissible />

      {/* Header */}
      <div>
        <div className="flex items-start gap-3 mb-1">
          <h1 className="text-2xl font-bold text-zinc-900">{property.streetAddress}</h1>
          <Badge variant="secondary">{property.state}</Badge>
        </div>
        <p className="text-zinc-500 flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {property.suburb}, {STATE_LABELS[property.state]} {property.postcode}
        </p>
      </div>

      {/* Photo area */}
      <div className="h-56 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-xl flex items-center justify-center">
        <MapPin className="h-10 w-10 text-zinc-300" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          {/* Price */}
          {property.adminListPrice && (
            <div>
              <div className="text-3xl font-bold text-zinc-900">{formatAud(property.adminListPrice)}</div>
              <p className="text-sm text-zinc-500 mt-1">Assignment price</p>
            </div>
          )}

          {/* Key details */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Property details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              {property.landAreaSqm && (
                <div><span className="text-zinc-500">Land area</span><div className="font-medium">{property.landAreaSqm.toLocaleString()} m²</div></div>
              )}
              {property.currentZoning && (
                <div><span className="text-zinc-500">Current zoning</span><div className="font-medium">{property.currentZoning}</div></div>
              )}
              {property.proposedZoning && (
                <div><span className="text-zinc-500">Proposed zoning</span><div className="font-medium text-blue-700">{property.proposedZoning}</div></div>
              )}
              <div><span className="text-zinc-500">Property type</span><div className="font-medium capitalize">{property.propertyType}</div></div>
              {property.bedroomCount && (
                <div><span className="text-zinc-500">Bedrooms</span><div className="font-medium">{property.bedroomCount}</div></div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          {property.adminDescription && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Development opportunity</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600 whitespace-pre-wrap">{property.adminDescription}</p>
              </CardContent>
            </Card>
          )}

          {/* Feasibility (verified devs only) */}
          {isVerifiedDeveloper && property.feasibilityNotes && (
            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader><CardTitle className="text-sm text-emerald-800">Feasibility analysis</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-emerald-900 whitespace-pre-wrap">{property.feasibilityNotes}</p>
              </CardContent>
            </Card>
          )}

          {!isVerifiedDeveloper && session && (
            <div className="border border-dashed rounded-xl p-6 text-center text-sm text-zinc-500">
              <FileText className="h-6 w-6 mx-auto mb-2 text-zinc-300" />
              <p>Full feasibility analysis available to verified developers.</p>
              <Link href="/developer/profile" className="text-blue-600 underline">Complete verification →</Link>
            </div>
          )}

          {/* Documents */}
          {property.documents.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Documents</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {property.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-2 bg-zinc-50 rounded-lg">
                    <FileText className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm">{doc.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar: actions */}
        <div className="space-y-4">
          {session?.user?.role === "DEVELOPER" && (
            <>
              <OfferForm propertyId={property.id} listPrice={property.adminListPrice} />
              <Separator />
              <EnquiryForm propertyId={property.id} />
            </>
          )}
          {!session && (
            <Card>
              <CardContent className="pt-5 text-center space-y-3">
                <p className="text-sm text-zinc-600">Register as a developer to submit offers and access full details.</p>
                <Link href="/register?role=developer">
                  <Button className="w-full">Register as developer</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full">Sign in</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

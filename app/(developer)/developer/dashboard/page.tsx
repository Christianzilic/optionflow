import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FinanceBanner } from "@/components/ui/finance-banner";
import { formatAud } from "@/lib/property-utils";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Store } from "lucide-react";

export default async function DeveloperDashboardPage() {
  const session = await auth();
  const [offers, profile] = await Promise.all([
    prisma.developerOffer.findMany({
      where: { developerId: session!.user.id },
      include: { property: { select: { streetAddress: true, suburb: true, state: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.developerProfile.findUnique({ where: { userId: session!.user.id } }),
  ]);

  return (
    <div className="space-y-6 max-w-4xl">
      <FinanceBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Developer dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {profile?.isVerified ? "Verified developer" : "Verification pending — "}{!profile?.isVerified && (
              <Link href="/developer/profile" className="text-blue-600 underline">complete your profile</Link>
            )}
          </p>
        </div>
        <Link href="/marketplace">
          <Button size="sm">
            <Store className="h-4 w-4 mr-2" /> Browse properties
          </Button>
        </Link>
      </div>

      {offers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-zinc-500 mb-4">No offers submitted yet</p>
            <Link href="/marketplace"><Button>Browse available properties</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">My offers</h2>
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{offer.property.streetAddress}, {offer.property.suburb}</CardTitle>
                    <p className="text-xs text-zinc-400 mt-0.5">{offer.property.state} · Updated {formatDistanceToNow(offer.updatedAt, { addSuffix: true })}</p>
                  </div>
                  <Badge variant="secondary">{offer.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-0">
                <div className="text-sm font-semibold text-zinc-900">{formatAud(offer.offerPrice)}</div>
                <Link href={`/marketplace/${offer.propertyId}`}>
                  <Button variant="ghost" size="sm">View property <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

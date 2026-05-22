import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatAud, STATE_LABELS } from "@/lib/property-utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  UNDER_NEGOTIATION: "bg-blue-100 text-blue-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  WITHDRAWN: "bg-zinc-100 text-zinc-600",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  UNDER_NEGOTIATION: "Under negotiation",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export default async function DeveloperOffersPage() {
  const session = await auth();
  const offers = await prisma.developerOffer.findMany({
    where: { developerId: session!.user.id },
    include: {
      property: {
        select: {
          id: true,
          streetAddress: true,
          suburb: true,
          state: true,
          postcode: true,
          adminListPrice: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My offers</h1>
          <p className="text-sm text-zinc-500 mt-1">{offers.length} offer{offers.length !== 1 ? "s" : ""} submitted</p>
        </div>
        <Link href="/marketplace">
          <Button size="sm">Browse properties</Button>
        </Link>
      </div>

      {offers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Tag className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-500 mb-4">No offers yet</p>
            <Link href="/marketplace"><Button>Browse available properties</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">
                      {offer.property.streetAddress}, {offer.property.suburb}
                    </CardTitle>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {STATE_LABELS[offer.property.state]} · Updated {formatDistanceToNow(offer.updatedAt, { addSuffix: true })}
                    </p>
                  </div>
                  <Badge className={STATUS_COLORS[offer.status] ?? "bg-zinc-100 text-zinc-600"}>
                    {STATUS_LABELS[offer.status] ?? offer.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-zinc-900">{formatAud(offer.offerPrice)}</div>
                    {offer.property.adminListPrice && (
                      <div className="text-xs text-zinc-400">Listed at {formatAud(offer.property.adminListPrice)}</div>
                    )}
                    {offer.adminNotes && offer.status === "UNDER_NEGOTIATION" && (
                      <div className="mt-2 text-xs bg-blue-50 border border-blue-200 rounded p-2 text-blue-800">
                        <span className="font-medium">Admin note: </span>{offer.adminNotes}
                      </div>
                    )}
                    {offer.status === "ACCEPTED" && (
                      <div className="mt-2 text-xs bg-green-50 border border-green-200 rounded p-2 text-green-800">
                        Your offer has been accepted. Our team will be in touch shortly.
                      </div>
                    )}
                  </div>
                  <Link href={`/marketplace/${offer.property.id}`}>
                    <Button variant="ghost" size="sm">
                      View property <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

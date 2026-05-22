import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MapPin, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { propertyStatusLabel, propertyStatusColor } from "@/lib/property-utils";

export default async function HomeownerDashboardPage() {
  const session = await auth();
  const properties = await prisma.property.findMany({
    where: { ownerId: session!.user.id },
    include: { optionDeed: { select: { status: true, expiryDate: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Welcome back, {session!.user.name ?? "there"}</p>
        </div>
        <Link href="/homeowner/properties/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" /> Submit property
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-zinc-800 mb-2">No properties yet</h3>
            <p className="text-sm text-zinc-500 mb-4 max-w-sm">
              Submit your first property for assessment. We&apos;ll review its development potential and get back to you.
            </p>
            <Link href="/homeowner/properties/new">
              <Button>Submit a property</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Your properties</h2>
          <div className="space-y-3">
            {properties.map((p) => (
              <Card key={p.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-base font-semibold text-zinc-900">
                        {p.streetAddress}, {p.suburb} {p.state}
                      </CardTitle>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Updated {formatDistanceToNow(p.updatedAt, { addSuffix: true })}
                      </p>
                    </div>
                    <Badge className={propertyStatusColor(p.status)}>
                      {propertyStatusLabel(p.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-0">
                  <div className="text-sm text-zinc-600 space-x-3">
                    {p.landAreaSqm && <span>{p.landAreaSqm.toLocaleString()} m²</span>}
                    {p.optionDeed?.expiryDate && (
                      <span className="text-amber-600">
                        Option expires {formatDistanceToNow(p.optionDeed.expiryDate, { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <Link href={`/homeowner/properties/${p.id}`}>
                    <Button variant="ghost" size="sm">
                      View <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FinanceBanner } from "@/components/ui/finance-banner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, ArrowRight } from "lucide-react";
import { formatAud, AU_STATES, STATE_LABELS } from "@/lib/property-utils";
import type { AustralianState } from "@/lib/generated/prisma/client";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; type?: string; minPrice?: string; maxPrice?: string; q?: string }>;
}) {
  const filters = await searchParams;
  const session = await auth();
  const isVerifiedDeveloper = session?.user?.role === "DEVELOPER";

  const where: Record<string, unknown> = { status: "LISTED" };
  if (filters.state && AU_STATES.includes(filters.state as AustralianState)) {
    where.state = filters.state;
  }
  if (filters.type) where.propertyType = filters.type;
  if (filters.minPrice || filters.maxPrice) {
    where.adminListPrice = {
      ...(filters.minPrice ? { gte: parseInt(filters.minPrice) * 100 } : {}),
      ...(filters.maxPrice ? { lte: parseInt(filters.maxPrice) * 100 } : {}),
    };
  }

  const properties = await prisma.property.findMany({
    where,
    orderBy: { listedAt: "desc" },
    select: {
      id: true,
      streetAddress: true,
      suburb: true,
      state: true,
      postcode: true,
      propertyType: true,
      landAreaSqm: true,
      adminListPrice: true,
      adminDescription: true,
      currentZoning: true,
      proposedZoning: true,
      listedAt: true,
    },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <FinanceBanner />
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Property marketplace</h1>
        <p className="text-sm text-zinc-500 mt-1">{properties.length} properties available</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white border rounded-xl p-4">
        <Select defaultValue={filters.state ?? "all"}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All states" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All states</SelectItem>
            {AU_STATES.map((s) => <SelectItem key={s} value={s}>{s} — {STATE_LABELS[s]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input placeholder="Min price ($)" type="number" className="w-36" defaultValue={filters.minPrice} />
        <Input placeholder="Max price ($)" type="number" className="w-36" defaultValue={filters.maxPrice} />
      </div>

      {!isVerifiedDeveloper && session && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Verification required</strong> — Get your developer account verified to access full feasibility reports and information packs.{" "}
          <Link href="/developer/profile" className="underline font-medium">Complete your profile →</Link>
        </div>
      )}

      {!session && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <Link href="/register?role=developer" className="font-semibold underline">Register as a developer</Link> to access feasibility reports, submit offers, and enquire about properties.
        </div>
      )}

      {properties.length === 0 ? (
        <div className="bg-white border rounded-xl py-16 text-center text-sm text-zinc-400">
          No properties match your filters
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow overflow-hidden">
              {/* Placeholder image area */}
              <div className="h-40 bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-zinc-300" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-tight">
                    {p.streetAddress}, {p.suburb}
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">{p.state}</Badge>
                </div>
                {p.adminListPrice && (
                  <div className="text-xl font-bold text-zinc-900">{formatAud(p.adminListPrice)}</div>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                  {p.landAreaSqm && <span className="bg-zinc-100 px-2 py-0.5 rounded">{p.landAreaSqm.toLocaleString()} m²</span>}
                  {p.currentZoning && <span className="bg-zinc-100 px-2 py-0.5 rounded">Zoning: {p.currentZoning}</span>}
                  {p.proposedZoning && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">→ {p.proposedZoning}</span>}
                </div>
                {p.adminDescription && (
                  <p className="text-sm text-zinc-600 line-clamp-2">{p.adminDescription}</p>
                )}
                <Link href={`/marketplace/${p.id}`}>
                  <Button size="sm" className="w-full">
                    View details <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

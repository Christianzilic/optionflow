import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { propertyStatusLabel, propertyStatusColor, formatAud } from "@/lib/property-utils";
import { ArrowRight } from "lucide-react";

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const properties = await prisma.property.findMany({
    where: status ? { status: status as never } : undefined,
    include: { owner: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-zinc-900">All properties</h1>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50">
            <tr>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Property</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Owner</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Status</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">List price</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Updated</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y">
            {properties.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.streetAddress}</div>
                  <div className="text-xs text-zinc-400">{p.suburb}, {p.state}</div>
                </td>
                <td className="px-4 py-3 text-zinc-600">{p.owner.name ?? p.owner.email}</td>
                <td className="px-4 py-3">
                  <Badge className={propertyStatusColor(p.status)}>{propertyStatusLabel(p.status)}</Badge>
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {p.adminListPrice ? formatAud(p.adminListPrice) : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400">
                  {formatDistanceToNow(p.updatedAt, { addSuffix: true })}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/properties/${p.id}`}>
                    <Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

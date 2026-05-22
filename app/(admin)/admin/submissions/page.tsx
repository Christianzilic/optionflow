import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { propertyStatusLabel, propertyStatusColor } from "@/lib/property-utils";
import { ArrowRight } from "lucide-react";

export default async function SubmissionsPage() {
  const submissions = await prisma.property.findMany({
    where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    include: { owner: { select: { name: true, email: true, phone: true } } },
    orderBy: { submittedAt: "asc" },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Submissions</h1>
          <p className="text-sm text-zinc-500 mt-1">{submissions.length} pending review</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white border rounded-xl py-16 text-center text-sm text-zinc-400">
          No pending submissions
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-zinc-50">
              <tr>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Property</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Owner</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Details</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Submitted</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {submissions.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900">{p.streetAddress}</div>
                    <div className="text-xs text-zinc-400">{p.suburb}, {p.state} {p.postcode}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-zinc-700">{p.owner.name ?? "—"}</div>
                    <div className="text-xs text-zinc-400">{p.owner.email}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {p.landAreaSqm ? <div>{p.landAreaSqm.toLocaleString()} m²</div> : "—"}
                    {p.homeownerAskingPrice && (
                      <div className="text-xs text-zinc-400">
                        Asking: ${(p.homeownerAskingPrice / 100).toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={propertyStatusColor(p.status)}>{propertyStatusLabel(p.status)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {p.submittedAt ? formatDistanceToNow(p.submittedAt, { addSuffix: true }) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/properties/${p.id}`}>
                      <Button variant="outline" size="sm">
                        Review <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

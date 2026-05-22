import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, Building, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { propertyStatusLabel, propertyStatusColor } from "@/lib/property-utils";

export default async function AdminOverviewPage() {
  const [submissionsCount, listedCount, dealsCompleted, developerCount, recentProperties] =
    await Promise.all([
      prisma.property.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
      prisma.property.count({ where: { status: "LISTED" } }),
      prisma.property.count({ where: { status: "ASSIGNED" } }),
      prisma.user.count({ where: { role: "DEVELOPER" } }),
      prisma.property.findMany({
        take: 8,
        orderBy: { updatedAt: "desc" },
        include: { owner: { select: { name: true, email: true } } },
      }),
    ]);

  const stats = [
    { label: "Pending review", value: submissionsCount, icon: Inbox, href: "/admin/submissions", color: "text-amber-600" },
    { label: "Listed", value: listedCount, icon: Building, href: "/admin/properties", color: "text-blue-600" },
    { label: "Deals completed", value: dealsCompleted, icon: TrendingUp, href: "/admin/properties", color: "text-emerald-600" },
    { label: "Developers", value: developerCount, icon: Users, href: "/admin/developers", color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-zinc-900">Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-sm transition-shadow cursor-pointer">
              <CardHeader className="pb-1 pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</CardTitle>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-zinc-900">{value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Recent activity</h2>
        <div className="bg-white border rounded-xl overflow-hidden">
          {recentProperties.length === 0 ? (
            <div className="py-10 text-center text-sm text-zinc-400">No properties yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-zinc-50">
                <tr>
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Property</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Owner</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/properties/${p.id}`} className="font-medium text-blue-600 hover:underline">
                        {p.streetAddress}, {p.suburb}
                      </Link>
                      <div className="text-xs text-zinc-400">{p.state} · {p.postcode}</div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{p.owner.name ?? p.owner.email}</td>
                    <td className="px-4 py-3">
                      <Badge className={propertyStatusColor(p.status)}>{propertyStatusLabel(p.status)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">
                      {formatDistanceToNow(p.updatedAt, { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatAud } from "@/lib/property-utils";
import { formatDistanceToNow } from "date-fns";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: { property: { select: { streetAddress: true, suburb: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-zinc-900">Payments</h1>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50">
            <tr>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Description</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Property</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Amount</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Status</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 text-zinc-700">{p.description}</td>
                <td className="px-4 py-3 text-zinc-600">{p.property.streetAddress}, {p.property.suburb}</td>
                <td className="px-4 py-3 font-medium">{formatAud(p.amount)}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.status === "SUCCEEDED" ? "default" : "secondary"}>{p.status}</Badge>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400">
                  {formatDistanceToNow(p.createdAt, { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

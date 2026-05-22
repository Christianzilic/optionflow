import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

export default async function AuditLogPage() {
  const logs = await prisma.auditLog.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-zinc-900">Audit log</h1>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50">
            <tr>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Action</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Entity</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">User</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-50">
                <td className="px-4 py-2.5 font-mono text-xs text-blue-700">{log.action}</td>
                <td className="px-4 py-2.5 text-zinc-600">
                  <span className="text-zinc-400 text-xs">{log.entityType}</span> {log.entityId.slice(0, 8)}…
                </td>
                <td className="px-4 py-2.5 text-zinc-600">
                  {log.user?.name ?? log.user?.email ?? "system"}
                </td>
                <td className="px-4 py-2.5 text-xs text-zinc-400">
                  {formatDistanceToNow(log.createdAt, { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

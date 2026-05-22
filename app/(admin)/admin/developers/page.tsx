import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleVerifiedButton } from "./toggle-verified";
import { formatDistanceToNow } from "date-fns";

export default async function AdminDevelopersPage() {
  const developers = await prisma.user.findMany({
    where: { role: "DEVELOPER" },
    include: { developerProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-zinc-900">Developers ({developers.length})</h1>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50">
            <tr>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Developer</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Company</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Verified</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase">Joined</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y">
            {developers.map((dev) => (
              <tr key={dev.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{dev.name ?? "—"}</div>
                  <div className="text-xs text-zinc-400">{dev.email}</div>
                </td>
                <td className="px-4 py-3 text-zinc-600">{dev.developerProfile?.companyName ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={dev.developerProfile?.isVerified ? "default" : "secondary"}>
                    {dev.developerProfile?.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400">
                  {formatDistanceToNow(dev.createdAt, { addSuffix: true })}
                </td>
                <td className="px-4 py-3">
                  {dev.developerProfile && (
                    <ToggleVerifiedButton
                      profileId={dev.developerProfile.id}
                      isVerified={dev.developerProfile.isVerified}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

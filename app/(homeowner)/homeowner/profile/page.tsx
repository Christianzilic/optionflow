import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateProfileForm } from "./update-profile-form";

export default async function HomeownerProfilePage() {
  const session = await auth();
  const [user, profile] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: session!.user.id } }),
    prisma.homeownerProfile.findUnique({ where: { userId: session!.user.id } }),
  ]);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-zinc-900">Profile settings</h1>
      <UpdateProfileForm user={user} profile={profile} />
    </div>
  );
}

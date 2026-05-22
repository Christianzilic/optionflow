import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DeveloperProfileForm } from "./developer-profile-form";

export default async function DeveloperProfilePage() {
  const session = await auth();
  const [user, profile] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: session!.user.id } }),
    prisma.developerProfile.findUnique({ where: { userId: session!.user.id } }),
  ]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Developer profile</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Complete your profile to get verified and access full property information packs.
        </p>
      </div>
      <DeveloperProfileForm user={user} profile={profile} />
    </div>
  );
}

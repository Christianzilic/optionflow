import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PortalHeader } from "@/components/layout/portal-header";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export default async function HomeownerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "HOMEOWNER") redirect("/login");

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        userName={session.user.name}
        userEmail={session.user.email}
        profileHref="/homeowner/profile"
      />
      <div className="flex flex-1">
        <aside className="hidden md:flex flex-col w-56 border-r bg-white p-4 shrink-0">
          <SidebarNav portal="homeowner" />
        </aside>
        <main className="flex-1 p-6 md:p-8 max-w-5xl">{children}</main>
      </div>
    </div>
  );
}

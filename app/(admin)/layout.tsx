import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PortalHeader } from "@/components/layout/portal-header";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        userName={session.user.name}
        userEmail={session.user.email}
        profileHref="/admin"
      />
      <div className="flex flex-1">
        <aside className="hidden md:flex flex-col w-56 border-r bg-white p-4 shrink-0">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3 px-3">Admin</p>
          <SidebarNav portal="admin" />
        </aside>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

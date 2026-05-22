"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Plus, FileText, User, LayoutDashboard, Search, Tag, Building2, Users, CreditCard, ClipboardList, BarChart2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };

const NAV_ITEMS: Record<string, NavItem[]> = {
  homeowner: [
    { href: "/homeowner/dashboard", label: "Dashboard", icon: Home },
    { href: "/homeowner/properties/new", label: "Submit property", icon: Plus },
    { href: "/homeowner/properties", label: "My properties", icon: FileText },
    { href: "/homeowner/profile", label: "Profile", icon: User },
  ],
  developer: [
    { href: "/developer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/marketplace", label: "Marketplace", icon: Search },
    { href: "/developer/offers", label: "My offers", icon: Tag },
    { href: "/developer/profile", label: "Profile", icon: User },
  ],
  admin: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/submissions", label: "Submissions", icon: ClipboardList },
    { href: "/admin/properties", label: "Properties", icon: Building2 },
    { href: "/admin/developers", label: "Developers", icon: Users },
    { href: "/admin/payments", label: "Payments", icon: CreditCard },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/admin/audit-log", label: "Audit log", icon: FileText },
  ],
};

export function SidebarNav({ portal }: { portal: "homeowner" | "developer" | "admin" }) {
  const pathname = usePathname();
  const items = NAV_ITEMS[portal];

  return (
    <nav className="space-y-1">
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname.startsWith(href)
              ? "bg-blue-50 text-blue-700"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
          )}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

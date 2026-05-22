"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Building2, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PortalHeaderProps {
  userName?: string | null;
  userEmail?: string | null;
  profileHref: string;
}

export function PortalHeader({ userName, userEmail, profileHref }: PortalHeaderProps) {
  return (
    <header className="h-14 border-b bg-white flex items-center px-4 sm:px-6 justify-between sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-blue-600" />
        <span className="font-bold text-zinc-900">Devbud.</span>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-9 items-center gap-2 rounded-md px-3 text-sm hover:bg-zinc-100 transition-colors">
          <User className="h-4 w-4" />
          <span className="max-w-[120px] truncate hidden sm:block">{userName ?? userEmail}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {userEmail && <div className="px-2 py-1.5 text-xs text-zinc-500 truncate">{userEmail}</div>}
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href={profileHref} />}>
            Profile settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-600">
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

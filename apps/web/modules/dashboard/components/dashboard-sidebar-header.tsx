"use client";

import Image from "next/image";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@reentwise/ui/src/components/sidebar";
import { DASHBOARD_SIDEBAR_BRAND_SUBTITLE } from "@/modules/dashboard/lib/dashboard-display";

export function DashboardSidebarHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/dashboard">
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-primary p-1.5">
              <Image
                src="/logo.png"
                alt="reentwise"
                width={32}
                height={32}
                className="size-full object-contain"
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Reentwise</span>
              <span className="truncate text-xs">
                {DASHBOARD_SIDEBAR_BRAND_SUBTITLE}
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

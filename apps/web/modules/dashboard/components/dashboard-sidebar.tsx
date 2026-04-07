"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@reentwise/ui/src/components/sidebar";
import { dashboardNavMain, dashboardNavSecondary } from "@/modules/dashboard/data/dashboard-sidebar-data";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { DashboardSidebarHeader } from "./dashboard-sidebar-header";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <DashboardSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dashboardNavMain} />
        <NavSecondary items={dashboardNavSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  IconBuildingSkyscraper,
  IconCurrencyDollar,
  IconFileText,
  IconHelpCircle,
  IconHome,
  IconMessageCircle,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@reentwise/ui/src/components/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Inicio",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      title: "Propiedades",
      icon: IconBuildingSkyscraper,
      url: "/dashboard/properties",
    },
    {
      title: "Pagos",
      url: "/dashboard/payments",
      icon: IconCurrencyDollar,
    },
    {
      title: "Inquilinos",
      url: "/dashboard/tenants",
      icon: IconUsers,
    },
    {
      title: "Auditorías",
      url: "/dashboard/audits",
      icon: IconFileText,
    },
  ],
  navSecondary: [
    {
      title: "Soporte",
      url: "#",
      icon: IconHelpCircle,
    },
    {
      title: "Feedback",
      url: "#",
      icon: IconMessageCircle,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
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
                  <span className="truncate font-medium">reentwise</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

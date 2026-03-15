"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@reentwise/ui/src/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@reentwise/ui/src/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@reentwise/ui/src/components/sidebar";
import { authClient } from "@reentwise/auth/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeThemeSelector } from "./change-theme";
import { buttonVariants } from "@reentwise/ui/src/components/button";
import { IconSettings } from "@tabler/icons-react";
import { TooltipProvider } from "@reentwise/ui/src/components/tooltip";
import { Tooltip, TooltipTrigger } from "@reentwise/ui/src/components/tooltip";
import { TooltipContent } from "@reentwise/ui/src/components/tooltip";

export function NavUser() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        credentials: "include",
        onSuccess: () => {
          router.push("/auth");
        },
      },
    });
  };

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="bg-background data-[state=open]:bg-background data-[state=open]:text-sidebar-accent-foreground animate-pulse"
          />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-xl">
                <AvatarImage
                  src={session?.user.image || undefined}
                  alt={session?.user.name}
                />
                <AvatarFallback className="rounded-xl">
                  {session?.user.name
                    .split(" ")
                    .map((name) => name.charAt(0).toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {session?.user.name}
                </span>
                <span className="truncate text-xs">{session?.user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl space-y-2"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-xl">
                  <AvatarImage
                    src={session?.user.image || undefined}
                    alt={session?.user.name}
                  />
                  <AvatarFallback className="rounded-xl">
                    {session?.user.name
                      .split(" ")
                      .map((name) => name.charAt(0).toUpperCase())
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session?.user.name}
                  </span>
                  <span className="truncate text-xs">
                    {session?.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard/settings"
                    className={buttonVariants({
                      variant: "ghost",
                      className: "justify-start rounded-xl w-full",
                    })}
                  >
                    <IconSettings className="size-4" />
                    <span>Configuración</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clic para ir a la configuración</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ChangeThemeSelector className="w-full" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive"
            >
              <LogOut className="text-destructive" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

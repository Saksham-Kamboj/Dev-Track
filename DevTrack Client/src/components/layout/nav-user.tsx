"use client";

import {
  BadgeCheck,
  Bell,
  // ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { NAVIGATION_TEXTS } from "@/constants";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/context/sidebar-context";
import { useLogout } from "@/hooks/useLogout";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile, state } = useSidebar();
  const { logout } = useLogout();

  // Determine avatar size based on sidebar state
  const avatarSize = state === "collapsed" ? "h-8 w-8" : "h-[70px] w-[70px]";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-40 flex flex-col items-center justify-center outline-none">
              <Avatar className={`${avatarSize} rounded-full`}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{NAVIGATION_TEXTS.SIDEBAR.AVATAR_FALLBACK}</AvatarFallback>
              </Avatar>
              {/* Hide user info when sidebar is collapsed and not mobile */}
              {(state !== "collapsed" || isMobile) && (
                <div className="flex flex-col text-left text-sm leading-tight items-center justify-center">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              )}
              {/* <ChevronsUpDown className="ml-auto size-4" /> */}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{NAVIGATION_TEXTS.SIDEBAR.AVATAR_FALLBACK}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                {NAVIGATION_TEXTS.USER_MENU.UPGRADE_TO_PRO}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                {NAVIGATION_TEXTS.USER_MENU.ACCOUNT}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                {NAVIGATION_TEXTS.USER_MENU.BILLING}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                {NAVIGATION_TEXTS.USER_MENU.NOTIFICATIONS}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut />
              {NAVIGATION_TEXTS.USER_MENU.LOG_OUT}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

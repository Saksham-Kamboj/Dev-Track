import * as React from "react";
import { useSelector } from "react-redux";
import { NAVIGATION_TEXTS } from "@/constants";

import { NavMain } from "@/components/layout/nav-main";
// import { NavProjects } from "@/components/layout/nav-projects";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  // SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  developerMenuItems,
  adminMenuItems,
} from "@/components/layout/sidebar-data";
import type { RootState } from "@/redux/store";
import type { NavMainItem } from "@/types/layout/nav.types";
import type { IMenuItem } from "@/components/layout/sidebar-data";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Get user and role from Redux
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role?.toLowerCase() || "";

  // Select menu items based on role
  let menuItems;
  if (role === "admin") {
    menuItems = adminMenuItems;
  } else {
    menuItems = developerMenuItems;
  }

  // Map sidebar-data menu items to NavMainItem structure
  const mapMenuItemsToNavMain = (items: IMenuItem[]): NavMainItem[] => {
    return items.map((item) => {
      const hasSubmenu = Array.isArray(item.submenu) && item.submenu.length > 0;
      // Only pass icon if it matches LucideIcon (for now, omit icon if not)
      const navItem: NavMainItem = {
        title: item.title,
        url: item.path || "#",
        icon: item.icon,
        items:
          hasSubmenu && item.submenu
            ? item.submenu.map((sub: IMenuItem) => ({
              title: sub.title,
              url: sub.path || "#",
              icon: sub.icon,
            }))
            : undefined,
      };
      return navItem;
    });
  };

  const navMainItems = mapMenuItemsToNavMain(menuItems);

  // Dummy user data fallback
  const sidebarUser = user
    ? {
      name: user.email.split("@")[0],
      email: user.email,
      avatar: "/avatars/shadcn.jpg",
    }
    : {
      name: NAVIGATION_TEXTS.SIDEBAR.USER_FALLBACK_NAME,
      email: NAVIGATION_TEXTS.SIDEBAR.USER_FALLBACK_EMAIL,
      avatar: "/avatars/shadcn.jpg",
    };

  return (
    <Sidebar collapsible="icon" {...props} className="">
      <SidebarHeader>
        <NavUser user={sidebarUser} />
      </SidebarHeader>
      <SidebarContent className="">
        <NavMain items={navMainItems} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}

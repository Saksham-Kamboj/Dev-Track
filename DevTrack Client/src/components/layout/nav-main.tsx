"use client";

import { ChevronRight } from "lucide-react";
import type { NavMainItem } from "../../types";
import { useLocation, Link } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({ items }: { items: NavMainItem[] }) {
  const location = useLocation();
  const pathname = location.pathname;

  // Helper to check if a menu or submenu is active
  const isItemActive = (url: string) => {
    if (!url || url === "#") return false;
    // Exact match or startsWith for parent menus
    return pathname === url || pathname.startsWith(url + "/");
  };

  // Use muted color for active and hover bg in light mode, keep dark mode as is
  const activeAndHoverBgClass =
    "bg-muted hover:bg-muted dark:bg-sidebar-accent/60 dark:hover:bg-sidebar-accent/60";

  // Hover and active text and icon color - primary only in light mode, keep dark mode default
  // Using !important to override default sidebar styles
  const textIconClass = "hover:!text-primary hover:[&>svg]:!text-primary data-[active=true]:!text-primary data-[active=true]:[&>svg]:!text-primary dark:hover:!text-sidebar-accent-foreground dark:hover:[&>svg]:!text-sidebar-accent-foreground dark:data-[active=true]:!text-sidebar-accent-foreground dark:data-[active=true]:[&>svg]:!text-sidebar-accent-foreground";

  // ChevronRight specific hover classes that work with collapsible states
  const chevronHoverClass = "hover:!text-primary data-[active=true]:!text-primary dark:hover:!text-sidebar-accent-foreground dark:data-[active=true]:!text-sidebar-accent-foreground";

  return (
    <SidebarGroup className="px-0">
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          const isParentActive =
            isItemActive(item.url) ||
            (hasSubItems && item.items?.some((sub) => isItemActive(sub.url)));
          return hasSubItems ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isParentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isParentActive}
                    className={`h-12 rounded-none border-l-4 transition-colors ${textIconClass} group-data-[state=open]/collapsible:hover:!text-primary group-data-[state=closed]/collapsible:hover:!text-primary dark:group-data-[state=open]/collapsible:hover:!text-sidebar-accent-foreground dark:group-data-[state=closed]/collapsible:hover:!text-sidebar-accent-foreground ${isParentActive
                      ? `border-primary ${activeAndHoverBgClass}`
                      : "border-transparent"
                      }`}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className={`ml-auto transition-all duration-200 group-data-[state=open]/collapsible:rotate-90 ${chevronHoverClass} group-data-[state=open]/collapsible:hover:!text-primary group-data-[state=closed]/collapsible:hover:!text-primary dark:group-data-[state=open]/collapsible:hover:!text-sidebar-accent-foreground dark:group-data-[state=closed]/collapsible:hover:!text-sidebar-accent-foreground`} />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="">
                  <SidebarMenuSub className="pr-0 mr-1">
                    {item.items?.map((subItem) => {
                      const isSubActive = isItemActive(subItem.url);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                            className={`h-10 rounded-none border-l-4 transition-colors ${textIconClass} ${isSubActive
                              ? `border-primary ${activeAndHoverBgClass}`
                              : "border-transparent"
                              }`}
                          >
                            <Link to={subItem.url}>
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isParentActive}
                className={`h-12 rounded-none border-l-4 transition-colors ${textIconClass} ${isParentActive
                  ? `border-primary ${activeAndHoverBgClass}`
                  : "border-transparent"
                  }`}
              >
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

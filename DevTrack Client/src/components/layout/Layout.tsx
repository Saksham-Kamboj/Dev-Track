import React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "../ui/mode-toggle";
import { useLocation, Link } from "react-router-dom";
import { generateBreadcrumbs } from "@/helper";
import { getDashboardRouteForRole } from "@/helper";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useLocation();
  const breadcrumbs = generateBreadcrumbs(router.pathname);
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role?.toLowerCase() || "";
  const dashboardRoute = getDashboardRouteForRole(role);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="max-w-full overflow-x-hidden">
        <header className="flex justify-between h-16 px-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.length === 0 && (
                  <BreadcrumbItem>
                    <BreadcrumbPage>Home</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  // For first segment, if it's a role, link to dashboard
                  const isRoleSegment =
                    index === 0 &&
                    ["admin", "developer"].includes(
                      crumb.label.toLowerCase()
                    );
                  return (
                    <React.Fragment key={`${crumb.href}-${index}`}>
                      <BreadcrumbItem
                        className={isLast ? "" : "hidden md:block"}
                      >
                        {isLast ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : isRoleSegment ? (
                          <BreadcrumbLink asChild>
                            <Link to={dashboardRoute}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={crumb.href}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-full overflow-x-hidden">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { PAGE_ROUTES } from "@/constants";
import {
  LayoutDashboard,
  FileText,
  // BarChart2,
  // Map,
  User,
  ShieldUser,
  // Users,
  // Calendar,
  // Brain,
  // Cpu,
  // Bot,
  // FilePlus2,
  // FileSearch,
  // NotebookText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type IMenuItem = {
  title: string;
  path?: string;
  icon?: LucideIcon;
  submenu?: IMenuItem[];
};

export const developerMenuItems: IMenuItem[] = [
  {
    title: "Dashboard",
    path: PAGE_ROUTES.DEVELOPER.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "Task Management",
    path: PAGE_ROUTES.DEVELOPER.TASK.ALL,
    icon: FileText,
  },
  {
    title: "Profile",
    path: PAGE_ROUTES.DEVELOPER.PROFILE,
    icon: User,
  },
];

export const adminMenuItems: IMenuItem[] = [
  {
    title: "Dashboard",
    path: PAGE_ROUTES.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    path: PAGE_ROUTES.ADMIN.USER_MANAGEMENT,
    icon: ShieldUser,
  },
  // {
  //   title: "Document Management",
  //   path: PAGE_ROUTES.ADMIN.DOCUMENTS.ALL,
  //   icon: FileText,
  // },
  // {
  //   title: "Report Management",
  //   path: PAGE_ROUTES.ADMIN.REPORTS.BASE,
  //   icon: BarChart2,
  //   submenu: [
  //     {
  //       title: "AI Generated Report",
  //       path: PAGE_ROUTES.ADMIN.REPORTS.AI_GENERATED,
  //       icon: FileText,
  //     },
  //     {
  //       title: "Ad Hoc Report",
  //       path: PAGE_ROUTES.ADMIN.REPORTS.AD_HOC_REPORT,
  //       icon: FileText,
  //     },
  //   ],
  // },
  {
    title: "Profile",
    path: PAGE_ROUTES.ADMIN.PROFILE,
    icon: User,
  },
];

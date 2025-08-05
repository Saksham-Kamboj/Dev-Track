import { PAGE_ROUTES } from "@/constants";

export function getDashboardRouteForRole(role: string) {
  switch (role) {
    case "admin":
      return PAGE_ROUTES.ADMIN.DASHBOARD;
    case "developer":
      return PAGE_ROUTES.DEVELOPER.DASHBOARD;
    default:
      return PAGE_ROUTES.COMMON.NOT_FOUND;
  }
}

export function generateBreadcrumbs(pathname: string) {
  const pathSegments = pathname.split("/").filter(Boolean); // remove empty segments

  // Map segments to breadcrumb objects
  const breadcrumbs = pathSegments.map((segment, index) => {
    // Create href by joining all previous segments + current
    const href = "/" + pathSegments.slice(0, index + 1).join("/");

    // Format label: capitalize and replace dashes with spaces
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return { label, href };
  });

  return breadcrumbs;
}

// Smart breadcrumb generation that understands menu hierarchy
export function generateSmartBreadcrumbs(pathname: string, menuItems?: any[]) {
  if (!menuItems || menuItems.length === 0) {
    return generateBreadcrumbs(pathname);
  }

  const breadcrumbs = [];
  const pathSegments = pathname.split("/").filter(Boolean);

  // 1. Add role breadcrumb (first segment)
  if (pathSegments.length > 0) {
    const roleName = pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1);
    breadcrumbs.push({
      label: roleName,
      href: `/${pathSegments[0]}`
    });
  }

  // 2. Check if current path is a submenu item
  const currentSubmenuItem = findSubmenuItem(pathname, menuItems);
  const parentMenu = findParentMenu(pathname, menuItems);

  if (currentSubmenuItem && parentMenu) {
    // This is a submenu item - create proper breadcrumb structure

    // Add parent menu breadcrumb
    // If current page is the first submenu item, parent should link to current page
    // Otherwise, parent should link to first submenu item
    const isFirstSubmenuItem = parentMenu.submenu && parentMenu.submenu[0]?.path === pathname;

    breadcrumbs.push({
      label: parentMenu.title,
      href: isFirstSubmenuItem
        ? pathname  // Stay on current page if it's the first submenu
        : (parentMenu.submenu && parentMenu.submenu.length > 0
          ? parentMenu.submenu[0].path
          : parentMenu.path)
    });

    // Add current submenu item breadcrumb (only if it's not the first submenu item)
    if (!isFirstSubmenuItem) {
      breadcrumbs.push({
        label: currentSubmenuItem.title,
        href: pathname
      });
    }

  } else {
    // This is a regular menu item or unknown path
    const currentMenuItem = findMenuItem(pathname, menuItems);

    if (currentMenuItem) {
      breadcrumbs.push({
        label: currentMenuItem.title,
        href: pathname
      });
    } else {
      // Fallback to path-based breadcrumbs for remaining segments
      for (let i = 1; i < pathSegments.length; i++) {
        const href = "/" + pathSegments.slice(0, i + 1).join("/");
        const label = pathSegments[i].replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
        breadcrumbs.push({
          label,
          href
        });
      }
    }
  }

  return breadcrumbs;
}

// Helper function to find a submenu item by path
function findSubmenuItem(path: string, menuItems: any[]): any | null {
  for (const item of menuItems) {
    if (item.submenu) {
      for (const subItem of item.submenu) {
        if (subItem.path === path) {
          return subItem;
        }
      }
    }
  }
  return null;
}

// Helper function to find the parent menu of a submenu item
function findParentMenu(path: string, menuItems: any[]): any | null {
  for (const item of menuItems) {
    if (item.submenu) {
      for (const subItem of item.submenu) {
        if (subItem.path === path) {
          return item;
        }
      }
    }
  }
  return null;
}

// Helper function to find a menu item by path (main menu items only)
function findMenuItem(path: string, menuItems: any[]): any | null {
  for (const item of menuItems) {
    if (item.path === path) {
      return item;
    }
  }
  return null;
}

/**
 * Utility functions for handling lastLogin display and formatting
 */

export interface LastLoginInfo {
  displayText: string;
  colorClass: string;
  tooltip: string;
  isOnline: boolean;
  category: 'never' | 'recent' | 'today' | 'week' | 'old';
}

/**
 * Format lastLogin timestamp for display
 * @param lastLogin - ISO string or null
 * @returns Formatted lastLogin information
 */
export function formatLastLogin(lastLogin: string | null): LastLoginInfo {
  // Handle null/undefined lastLogin (user never logged in)
  if (!lastLogin) {
    return {
      displayText: 'Never logged in',
      colorClass: 'text-muted-foreground',
      tooltip: 'User has never logged in',
      isOnline: false,
      category: 'never'
    };
  }

  const date = new Date(lastLogin);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  let displayText = '';
  let colorClass = 'text-muted-foreground';
  let isOnline = false;
  let category: LastLoginInfo['category'] = 'old';

  if (diffInMinutes < 5) {
    displayText = 'Online now';
    colorClass = 'text-green-600';
    isOnline = true;
    category = 'recent';
  } else if (diffInMinutes < 30) {
    displayText = `${diffInMinutes}m ago`;
    colorClass = 'text-green-600';
    category = 'recent';
  } else if (diffInHours < 1) {
    displayText = 'Less than 1h ago';
    colorClass = 'text-green-600';
    category = 'recent';
  } else if (diffInHours < 24) {
    displayText = `${diffInHours}h ago`;
    colorClass = 'text-emerald-600';
    category = 'today';
  } else if (diffInDays < 7) {
    displayText = `${diffInDays}d ago`;
    colorClass = 'text-yellow-600';
    category = 'week';
  } else if (diffInDays < 30) {
    displayText = `${diffInDays}d ago`;
    colorClass = 'text-orange-600';
    category = 'old';
  } else {
    displayText = `${diffInDays}d ago`;
    colorClass = 'text-red-600';
    category = 'old';
  }

  return {
    displayText,
    colorClass,
    tooltip: `Last login: ${date.toLocaleString()}`,
    isOnline,
    category
  };
}

/**
 * Get user activity status based on lastLogin
 * @param lastLogin - ISO string or null
 * @returns Activity status
 */
export function getUserActivityStatus(lastLogin: string | null): {
  status: 'online' | 'recent' | 'away' | 'inactive' | 'never';
  label: string;
  color: string;
} {
  const info = formatLastLogin(lastLogin);

  switch (info.category) {
    case 'never':
      return {
        status: 'never',
        label: 'Never logged in',
        color: 'gray'
      };
    case 'recent':
      return {
        status: info.isOnline ? 'online' : 'recent',
        label: info.isOnline ? 'Online' : 'Recently active',
        color: 'green'
      };
    case 'today':
      return {
        status: 'recent',
        label: 'Active today',
        color: 'emerald'
      };
    case 'week':
      return {
        status: 'away',
        label: 'Away',
        color: 'yellow'
      };
    case 'old':
      return {
        status: 'inactive',
        label: 'Inactive',
        color: 'red'
      };
    default:
      return {
        status: 'inactive',
        label: 'Unknown',
        color: 'gray'
      };
  }
}

/**
 * Sort users by lastLogin (most recent first)
 * @param users - Array of users with lastLogin field
 * @returns Sorted users array
 */
export function sortUsersByLastLogin<T extends { lastLogin: string | null }>(users: T[]): T[] {
  return [...users].sort((a, b) => {
    // Users who never logged in go to the end
    if (!a.lastLogin && !b.lastLogin) return 0;
    if (!a.lastLogin) return 1;
    if (!b.lastLogin) return -1;

    // Sort by most recent first
    return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
  });
}

/**
 * Filter users by activity status
 * @param users - Array of users with lastLogin field
 * @param status - Activity status to filter by
 * @returns Filtered users array
 */
export function filterUsersByActivity<T extends { lastLogin: string | null }>(
  users: T[],
  status: 'online' | 'recent' | 'away' | 'inactive' | 'never'
): T[] {
  return users.filter(user => {
    const activityStatus = getUserActivityStatus(user.lastLogin);
    return activityStatus.status === status;
  });
}

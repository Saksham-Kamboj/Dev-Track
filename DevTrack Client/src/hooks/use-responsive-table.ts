import { useState, useCallback } from 'react';

/**
 * Hook to handle responsive table behavior
 * Adapts table layout based on container width changes (e.g., sidebar toggle)
 */
export function useResponsiveTable() {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isCompact, setIsCompact] = useState<boolean>(false);

  // Update container width and determine if compact mode is needed
  const updateContainerWidth = useCallback((width: number) => {
    setContainerWidth(width);
    // Consider compact mode for widths less than 1024px
    setIsCompact(width < 1024);
  }, []);

  // ResizeObserver to watch container size changes
  const observeContainer = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        updateContainerWidth(width);
      }
    });

    resizeObserver.observe(element);

    // Initial measurement
    updateContainerWidth(element.offsetWidth);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateContainerWidth]);

  // Get responsive column configuration
  const getResponsiveColumns = useCallback((baseColumns: any[], availableWidth: number) => {
    // If we have plenty of space, show all columns
    if (availableWidth > 1200) {
      return baseColumns;
    }

    // For medium screens, hide less important columns
    if (availableWidth > 768) {
      return baseColumns.filter(col =>
        !['joinDate', 'lastLogin', 'generated_by', 'origin', 'creator_name'].includes(col.key)
      );
    }

    // For small screens, show only essential columns
    return baseColumns.filter(col => {
      // User Management essential columns
      if (['name', 'role', 'status'].includes(col.key)) return true;

      // AI Report essential columns
      if (['title', 'status', 'priority'].includes(col.key)) return true;

      // Document Management essential columns
      if (['document_name', 'document_type', 'status'].includes(col.key)) return true;

      return false;
    });
  }, []);

  // Get responsive grid template based on container width
  const getResponsiveGridTemplate = useCallback((
    columns: any[],
    showCheckboxes: boolean = false,
    showActions: boolean = true,
    showSerialNumber: boolean = true,
    availableWidth: number = containerWidth
  ) => {
    let gridColumns: string[] = [];

    // Calculate total fixed width for non-flexible columns
    let fixedWidth = 0;
    if (showCheckboxes) fixedWidth += 48; // Checkbox column
    if (showSerialNumber) fixedWidth += 80; // Serial number column
    if (showActions) fixedWidth += 48; // Actions column

    // Count fixed-width columns and calculate their widths
    let fixedColumns = 0;
    columns?.forEach((column) => {
      const columnKey = column.key;

      // User Management columns
      if (['userId'].includes(columnKey)) {
        fixedWidth += availableWidth > 1024 ? 120 : 100;
        fixedColumns++;
      }
      // Badge columns (status, role, priority, type, classification)
      else if (['role', 'status', 'priority', 'report_type', 'classification_level'].includes(columnKey)) {
        fixedWidth += availableWidth > 768 ? 140 : 120;
        fixedColumns++;
      }
      // Date columns
      else if (['joinDate', 'lastLogin', 'generated_at', 'uploaded_at'].includes(columnKey)) {
        fixedWidth += availableWidth > 1024 ? 140 : 120;
        fixedColumns++;
      }
    });

    // Calculate remaining space for flexible columns
    const flexibleColumns = columns?.length - fixedColumns;
    const remainingWidth = Math.max(0, (availableWidth || 800) - fixedWidth);
    const flexColumnWidth = flexibleColumns > 0 ? remainingWidth / flexibleColumns : 120;

    // Checkbox column
    if (showCheckboxes) {
      gridColumns.push('48px');
    }

    // Serial number column
    if (showSerialNumber) {
      gridColumns.push('80px');
    }

    // Build grid columns with calculated widths
    columns?.forEach((column) => {
      const columnKey = column.key;

      switch (columnKey) {
        // User Management specific columns
        case 'userId':
          gridColumns.push(availableWidth > 1024 ? '120px' : '100px');
          break;
        case 'name':
          // Name column gets more space but is constrained
          const nameWidth = Math.max(180, Math.min(flexColumnWidth * 1.5, 300));
          gridColumns.push(`${nameWidth}px`);
          break;

        // AI Report specific columns
        case 'title':
          // Title column gets more space for AI reports
          const titleWidth = Math.max(200, Math.min(flexColumnWidth * 1.8, 350));
          gridColumns.push(`${titleWidth}px`);
          break;

        // Document Management specific columns
        case 'document_name':
          const docNameWidth = Math.max(180, Math.min(flexColumnWidth * 1.5, 300));
          gridColumns.push(`${docNameWidth}px`);
          break;

        // Badge columns (consistent sizing)
        case 'role':
        case 'status':
        case 'priority':
        case 'report_type':
        case 'classification_level':
        case 'document_type':
        case 'document_category':
          gridColumns.push(availableWidth > 768 ? '140px' : '120px');
          break;

        // Date columns
        case 'joinDate':
        case 'lastLogin':
        case 'generated_at':
        case 'uploaded_at':
          gridColumns.push(availableWidth > 1024 ? '140px' : '120px');
          break;

        // Text columns (medium width)
        case 'origin':
        case 'creator_name':
        case 'generated_by':
          gridColumns.push(availableWidth > 768 ? '160px' : '140px');
          break;

        default:
          // Other flexible columns get equal remaining space
          const defaultWidth = Math.max(120, flexColumnWidth);
          gridColumns.push(`${defaultWidth}px`);
      }
    });

    // Actions column - fixed width on the right side of each row (if enabled)
    if (showActions) {
      gridColumns.push('48px');
    }

    // Safety check: ensure total width doesn't exceed container
    const totalCalculatedWidth = gridColumns.reduce((sum, col) => {
      const width = parseFloat(col.replace('px', ''));
      return sum + (isNaN(width) ? 120 : width);
    }, 0);

    // If calculated width exceeds container, scale down proportionally
    if (totalCalculatedWidth > availableWidth && availableWidth > 0) {
      const scaleFactor = (availableWidth * 0.95) / totalCalculatedWidth; // 95% to leave some margin
      gridColumns = gridColumns.map(col => {
        const width = parseFloat(col.replace('px', ''));
        if (!isNaN(width)) {
          return `${Math.floor(width * scaleFactor)}px`;
        }
        return col;
      });
    }

    return gridColumns.join(' ');
  }, [containerWidth]);

  // Get responsive class names
  const getResponsiveClasses = useCallback(() => {
    return {
      container: `w-full ${isCompact ? 'text-sm' : ''}`,
      header: `${isCompact ? 'h-10' : 'h-12'}`,
      cell: `${isCompact ? 'px-2 py-2' : 'px-4 py-3'}`,
      text: isCompact ? 'text-xs' : 'text-sm'
    };
  }, [isCompact]);

  return {
    containerWidth,
    isCompact,
    observeContainer,
    getResponsiveColumns,
    getResponsiveGridTemplate,
    getResponsiveClasses,
    updateContainerWidth
  };
}

export default useResponsiveTable;

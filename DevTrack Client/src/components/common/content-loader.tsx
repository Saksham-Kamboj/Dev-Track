import { memo } from 'react';
import LoadingSpinner from './loading-spinner';

// Optimized loading component for layout content with theme support
const ContentLoader = memo(() => (
  <div className="flex items-center justify-center w-full h-96 bg-background">
    <div className="flex flex-col items-center space-y-3">
      <LoadingSpinner size="sm" />
      <p className="text-xs text-muted-foreground">Loading content...</p>
    </div>
  </div>
));
ContentLoader.displayName = 'ContentLoader';

export default ContentLoader;

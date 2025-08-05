import { memo } from 'react';
import LoadingSpinner from './loading-spinner';

// Optimized loading component for Suspense with theme support
const PageLoader = memo(() => (
  <div className="flex items-center justify-center w-full h-screen bg-background text-foreground">
    <div className="flex flex-col items-center space-y-4">
      <LoadingSpinner size="md" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
));
PageLoader.displayName = 'PageLoader';

export default PageLoader;

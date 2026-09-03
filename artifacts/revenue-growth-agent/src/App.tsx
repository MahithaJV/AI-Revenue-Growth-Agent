import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import { Shell } from '@/components/layout';
import Home from '@/pages/home';
import Catalog from '@/pages/catalog';
import Analytics from '@/pages/analytics';
import ActivityPage from '@/pages/activity';
import Settings from '@/pages/settings';
import NotFound from '@/pages/not-found';
import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';

const queryClient = new QueryClient();

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <Shell><RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/catalog" component={Catalog} /><Route path="/analytics" component={Analytics} /><Route path="/activity" component={ActivityPage} /><Route path="/settings" component={Settings} /><Route component={NotFound} /></Switch></RoutedErrorBoundary></Shell>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
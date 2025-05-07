import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import HowItWorks from "@/pages/howitworks";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AdOptimizerProvider } from "./providers/AdOptimizerProvider";
import { DirectInstallButton } from "@/components/DirectInstallButton";
import { AdOptimizerDashboard } from "@/components/AdOptimizerDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/how-it-works" component={HowItWorks} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Only show the ad optimizer dashboard in development mode
  const showAdOptimizerDashboard = import.meta.env.DEV;
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AdOptimizerProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <DirectInstallButton />
            {showAdOptimizerDashboard && <AdOptimizerDashboard />}
          </TooltipProvider>
        </AdOptimizerProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

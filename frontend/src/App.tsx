import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService, User } from "@/lib/auth";
import { Login } from "@/components/Login";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EmployeeDirectory from "./pages/EmployeeDirectory";
import Goals from "./pages/Goals";
import Reviews from "./pages/Reviews";
import ReviewCycleDetails from "./pages/ReviewCycleDetails";
import Skills from "./pages/Skills";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser as User | null);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser as User | null);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="dark">
            <Login onLogin={handleLogin} />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="dark">
          <BrowserRouter>
            <Layout user={user} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route
                  path="/profile/:id"
                  element={<Profile currentUser={user} />}
                />
                <Route path="/employees" element={<EmployeeDirectory />} />
                <Route path="/goals" element={<Goals user={user} />} />
                <Route path="/reviews" element={<Reviews user={user} />} />
                <Route
                  path="/reviews/:id"
                  element={<ReviewCycleDetails user={user} />}
                />
                <Route path="/skills" element={<Skills user={user} />} />
                <Route path="/reports" element={<Reports user={user} />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

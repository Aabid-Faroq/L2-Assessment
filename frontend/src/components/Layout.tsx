import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { authService, User as AuthUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/hooks/use-sidebar";

interface LayoutProps {
  children: React.ReactNode;
  user: AuthUser;
  onLogout: () => void;
}

export function Layout({ children, user, onLogout }: LayoutProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/");
    onLogout();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar user={user} />

        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="hidden lg:block">
                <h1 className="text-xl font-semibold text-foreground">
                  Performance Review System
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to={`/profile/${user.employeeId}`}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <User className="h-4 w-4" />
                <span>{user?.name}</span>
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs capitalize text-primary">
                  {user?.role}
                </span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-gradient-subtle p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

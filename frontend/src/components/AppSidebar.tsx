import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { User } from "@/lib/auth";
import {
  BarChart3,
  Users,
  Target,
  FileText,
  Settings,
  Award,
  PieChart,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AppSidebarProps {
  user: User;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const location = useLocation();

  const navItems = [
    { href: "/", icon: BarChart3, label: "Dashboard" },
    { href: "/goals", icon: Target, label: "Goals" },
    { href: "/reviews", icon: FileText, label: "Reviews" },
    { href: "/skills", icon: Award, label: "Skills" },
    {
      href: "/reports",
      icon: PieChart,
      label: "Reports",
      roles: ["hr", "manager"],
    },
    {
      href: "/employees",
      icon: Users,
      label: "Employee Directory",
      roles: ["hr"],
    },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <span className="text-lg font-semibold">PerfTrack</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map(
            (item) =>
              (!item.roles || item.roles.includes(user.role)) && (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    as={Link}
                    to={item.href}
                    isActive={location.pathname === item.href}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}


import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Package,
  BarChartBig,
  Settings,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if not admin or manager
  React.useEffect(() => {
    if (currentUser && !["admin", "manager"].includes(currentUser.role)) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      name: "Stores",
      href: "/dashboard/stores",
      icon: <Store className="mr-2 h-4 w-4" />,
    },
    {
      name: "Products",
      href: "/dashboard/products",
      icon: <Package className="mr-2 h-4 w-4" />,
    },
    {
      name: "Sales",
      href: "/dashboard/sales",
      icon: <BarChartBig className="mr-2 h-4 w-4" />,
    },
  ];

  // Only show Users for admin
  if (isAdmin) {
    navItems.push({
      name: "Users",
      href: "/dashboard/users",
      icon: <Users className="mr-2 h-4 w-4" />,
    });
  }

  navItems.push({
    name: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  });

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r bg-muted/30 md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-brand-indigo" />
            <span className="text-xl font-bold">StatioStore</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Management
            </h3>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    isActive(item.href)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {currentUser?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium leading-none">
                {currentUser?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentUser?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <div className="border-b md:hidden">
          <div className="flex h-16 items-center px-4">
            <Link to="/" className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <span className="text-xl font-bold">StatioStore</span>
            </Link>
          </div>
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

import { useLocation, useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Headphones,
  Users,
  MapPin,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Truck,
  Clock,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-utiliza.png";
import { useSidebar } from "@/contexts/SidebarContext";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Monitoramento", href: "/dashboard" },
  { icon: Headphones, label: "Atendimentos", href: "/atendimentos"},
  { icon: PhoneCall, label: "Chamados", href: "/chamados" },
  { icon: Truck, label: "Prestadores", href: "/prestadores" },
  { icon: Users, label: "Equipe", href: "/equipe" },
  { icon: MapPin, label: "Mapa ao Vivo", href: "/mapa" },
  { icon: Clock, label: "Histórico", href: "/historico" },
  { icon: BarChart3, label: "Relatórios", href: "/relatorios" },
];

const bottomItems: NavItem[] = [
  { icon: Settings, label: "Configurações", href: "/config" },
];

interface StoredUser {
  id: string;
  name: string;
  email: string;
}

function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function Sidebar() {
  const { collapsed, toggleCollapsed } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-500 ease-out",
        collapsed ? "w-20" : "w-72"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border/50">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <img src={logo} alt="Utiliza Assistência" className="h-10 w-auto" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className={cn(
              "h-9 w-9 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all",
              collapsed && "mx-auto"
            )}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item, index) => {
            const isActive =
              location.pathname === item.href ||
              (item.href === "/atendimentos" && location.pathname.startsWith("/atendimentos/")) ||
              (item.href === "/chamados" && location.pathname.startsWith("/chamados/"));
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  "animate-slide-in-left",
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
              <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform duration-300",
                  !isActive && "group-hover:scale-110",
                  collapsed && "mx-auto"
                )} strokeWidth={1.5} />
              {!collapsed && (
                  <>
                    <span className="font-medium text-sm flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "text-xs font-bold px-2.5 py-1 rounded-full transition-colors",
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "bg-destructive/20 text-destructive"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-sidebar-border/50 space-y-1.5">
          {bottomItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-300"
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", collapsed && "mx-auto")} strokeWidth={1.5} />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
            </Link>
          ))}

          {/* User */}
          {!collapsed && (
            <div className="flex items-center gap-3 px-4 py-4 mt-3 rounded-2xl bg-gradient-to-r from-sidebar-accent to-sidebar-accent/50 border border-sidebar-border/30">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-primary-foreground">
                  {user?.name
                    ? user.name
                        .split(/\s+/)
                        .map((s) => s[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "AD"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user?.name ?? "Admin"}
                </p>
                <p className="text-xs text-sidebar-foreground/50 truncate">
                  {user?.email ?? "—"}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-xl text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/80"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

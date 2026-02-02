import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User, Calendar, Home, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return <>{children}</>;

  const isDoctor = user.role === "doctor";
  
  const links = isDoctor 
    ? [
        { href: "/doctor/dashboard", label: "Dashboard", icon: Home },
        { href: "/doctor/patients", label: "Patients", icon: User },
        { href: "/doctor/prescriptions", label: "Prescriptions", icon: FileText },
      ]
    : [
        { href: "/patient/dashboard", label: "Dashboard", icon: Home },
        { href: "/patient/book-appointment", label: "Book Appointment", icon: Calendar },
        { href: "/patient/appointments", label: "My Appointments", icon: Activity },
        { href: "/patient/prescriptions", label: "My Prescriptions", icon: FileText },
      ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-200 shadow-sm flex-shrink-0 z-20">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-slate-900 leading-tight">DentalCare</h1>
                <p className="text-xs text-muted-foreground font-medium">Medical Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="px-3 py-2">
              <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Menu
              </p>
              <div className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = location === link.href;
                  return (
                    <Link key={link.href} href={link.href} className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? "bg-primary text-white shadow-md shadow-primary/20" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                    `}>
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/5 hover:border-destructive/20"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}

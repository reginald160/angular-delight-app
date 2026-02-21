import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users,
  Bell,
  MessageSquare,
  LogOut, 
  User,
  Menu,
  X,
  Home,
  UserCheck,
  Calendar,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { authApi } from '@/services/AuthService';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/jobs', label: 'Manage Jobs', icon: Briefcase },
  { path: '/admin/applications', label: 'Applications', icon: FileText },
  { path: '/admin/interviews', label: 'Interviews', icon: Calendar },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/user-details', label: 'User Details', icon: UserCheck },
  { path: '/admin/notifications', label: 'Notifications', icon: Bell },
  { path: '/admin/chats', label: 'Chats', icon: MessageSquare },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
   await signOut();
      navigate("/auth")
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center">
              <span className="text-destructive-foreground font-serif font-bold text-sm">A</span>
            </div>
            <span className="font-serif font-bold text-foreground">Admin Panel</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-40 transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
            <div className="w-10 h-10 rounded-lg bg-destructive flex items-center justify-center">
              <span className="text-destructive-foreground font-serif font-bold text-lg">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-foreground">Admin Panel</span>
              <span className="text-xs text-muted-foreground">UK Pathway</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-destructive text-destructive-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.Email}
                </p>
                <p className="text-xs text-destructive font-medium">Admin</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
            <Link to="/" className="block mt-2">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

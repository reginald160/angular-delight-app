import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Home, 
  Briefcase, 
  Car, 
  LogOut, 
  CreditCard,
  User,
  Menu,
  X,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ProfileModal } from '@/components/profile/ProfileModal';
import { ProfileReminder } from '@/components/profile/ProfileReminder';
import { useChat } from '@/hooks/useChat';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/visa', label: 'Visa Support', icon: FileText },
  { path: '/dashboard/housing', label: 'Housing', icon: Home },
  { path: '/dashboard/jobs', label: 'Jobs', icon: Briefcase },
  { path: '/dashboard/my-applications', label: 'My Applications', icon: FileText },
  { path: '/dashboard/my-interviews', label: 'My Interviews', icon: Briefcase },
  { path: '/dashboard/driving', label: 'Driving', icon: Car },
  { path: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const {connected, notificationCount} = useChat();

  const handleSignOut = async () => {
    await signOut();
  };

  // Helper to get current page title from path
  const currentPathLabel = navItems.find(item => item.path === location.pathname)?.label || 'Overview';

  return (
    <div className="min-h-screen bg-muted/30 flex">
      
      {/* 1. SIDEBAR (Desktop & Mobile) */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-50 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-lg">UK</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-foreground leading-none">UK Pathway</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer (User Controls) */}
          <div className="p-4 border-t border-border space-y-2">
             <div className="flex items-center gap-3 px-2 py-3 mb-2 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                   <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-xs font-semibold truncate">{user?.Email?.split('@')[0]}</p>
                   <p className="text-[10px] text-muted-foreground truncate">{user?.Email}</p>
                </div>
             </div>
            
            <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => setProfileOpen(true)}>
              <Settings className="w-4 h-4" /> Settings
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:pl-64">
        
        {/* SHARED HEADER (Mobile Menu + Desktop Notifications) */}
        <header className="sticky top-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile Burger Menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            {/* Desktop Breadcrumb/Title */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Pages</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">{currentPathLabel}</span>
            </div>
          </div>

          {/* The Notification Bell - Now visible on ALL screen sizes */}
          <div className="flex items-center gap-2">
             <NotificationBell />
             <div className="h-6 w-[1px] bg-border mx-2 hidden lg:block" />
             <Link to="/" className="hidden lg:block text-xs font-medium hover:text-primary transition-colors">
                Public Site
             </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 lg:p-8 flex-1">
           <div className="max-w-7xl mx-auto">
              {children}
           </div>
        </main>
      </div>

      {/* 3. OVERLAYS & MODALS */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <ChatPanel />
      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
      <ProfileReminder />
    </div>
  );
};
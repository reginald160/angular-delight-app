import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdmin } from '@/hooks/useAdmin';
import { 
  Search, User, Loader2, Lock, Unlock, Eye, 
  Mail, Phone, Calendar, Shield, FileText 
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from '@/services/api';

export default function AdminUsers() {
  const { isAdmin, loading, users, handleLock, refreshUsers } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null); // State for modal
  const { toast } = useToast();

  const handleToggleLock = async (userId: string, isLocked: boolean) => {
    setActionLoading(userId);
    try {
      await handleLock(userId);
      toast({
        title: isLocked ? "User Unlocked" : "User Locked",
        description: `Successfully updated user status.`,
      });
      if (refreshUsers) await refreshUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const filteredUsers = users.filter(u =>
    (u.first_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.last_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Users Management</h1>
        <p className="text-muted-foreground">View and manage user access permissions</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((u) => (
          <Card key={u.id} className={u.is_locked ? "border-destructive/50 bg-destructive/5" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center relative">
                  <User className="h-6 w-6 text-muted-foreground" />
                  {u.is_locked && (
                    <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1">
                      <Lock className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {u.first_name || u.last_name 
                      ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
                      : 'Unnamed User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                
                <div className="flex gap-1">
                  {/* View Details Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedUser(u as any)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  {/* Lock/Unlock Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={actionLoading === u.id}
                    onClick={() => handleToggleLock(u.id, !!u.is_locked)}
                    className={u.is_locked ? "text-green-600 hover:bg-green-50" : "text-destructive hover:bg-destructive/10"}
                  >
                    {actionLoading === u.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : u.is_locked ? (
                      <Unlock className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">User Details</DialogTitle>
            <DialogDescription>
              Full profile information for the selected user.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={selectedUser.is_locked ? "destructive" : "secondary"}>
                      {selectedUser.is_locked ? "Disabled" : "Active"}
                    </Badge>
                    <Badge variant="outline" className="flex gap-1">
                      <Shield className="h-3 w-3" /> {selectedUser.subscription_type || 'Basic'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span className="text-muted-foreground">{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span className="text-muted-foreground">{selectedUser.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Member Since:</span>
                  <span className="text-muted-foreground">
                    {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-2">Documents</p>
                {selectedUser.cv_url ? (
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <a href={selectedUser.cv_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 text-primary" />
                      View Curriculum Vitae (CV)
                    </a>
                  </Button>
                ) : (
                  <div className="text-sm text-muted-foreground italic bg-muted p-3 rounded-md">
                    No CV uploaded for this user.
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
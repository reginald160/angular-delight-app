import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/hooks/useAdmin';

interface AdminUserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string;
  phone: string | null;
  created_at: string;
  is_locked: boolean;
  subscription_type?: string;
  cv_url?: string;
}
import {
  Search, User, Loader2, Lock, Unlock, Eye, Mail, Phone,
  Calendar, Shield, FileText, CreditCard, ArrowLeft, X,
  Crown, CheckCircle, XCircle, ExternalLink
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
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionInfo {
  id: string;
  status: string;
  tier: string | null;
  product_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
}

export default function AdminUserDetails() {
  const { isAdmin, loading, users, handleLock, refreshUsers } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const { toast } = useToast();

  const fetchSubscription = async (userId: string) => {
    setSubLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error) {
        setSubscription(data as SubscriptionInfo | null);
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
    } finally {
      setSubLoading(false);
    }
  };

  const openUserDetails = (user: AdminUserProfile) => {
    setSelectedUser(user);
    setSubscription(null);
    fetchSubscription(user.id);
  };

  const handleToggleLock = async (userId: string, isLocked: boolean) => {
    setActionLoading(userId);
    try {
      await handleLock(userId);
      toast({
        title: isLocked ? "User Unlocked" : "User Locked",
        description: "Successfully updated user status.",
      });
      if (refreshUsers) await refreshUsers();
    } catch {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>;
      case 'canceled':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Canceled</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200"><Crown className="h-3 w-3 mr-1" /> Trial</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Inactive'}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">User Details</h1>
        <p className="text-muted-foreground">View full user profiles, CVs, and subscription information</p>
      </div>

      {/* Search */}
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

      {/* Users Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((u) => (
          <Card
            key={u.id}
            className={`cursor-pointer transition-all hover:shadow-md ${u.is_locked ? "border-destructive/50 bg-destructive/5" : "hover:border-primary/30"}`}
            onClick={() => openUserDetails(u as any)}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center relative shrink-0">
                  <User className="h-6 w-6 text-primary" />
                  {u.is_locked && (
                    <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5">
                      <Lock className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {u.first_name || u.last_name
                      ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
                      : 'Unnamed User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>

              <div className="flex gap-2 mt-3">
                <Badge variant={u.is_locked ? "destructive" : "secondary"} className="text-xs">
                  {u.is_locked ? "Locked" : "Active"}
                </Badge>
                {(u as any).subscription_type && (
                  <Badge variant="outline" className="text-xs">
                    <Crown className="h-3 w-3 mr-1" /> {(u as any).subscription_type}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No users found matching your search.
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">User Full Details</DialogTitle>
            <DialogDescription>
              Complete profile, documents, and subscription information.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-2">
              {/* Profile Header */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant={selectedUser.is_locked ? "destructive" : "secondary"}>
                      {selectedUser.is_locked ? "Locked" : "Active"}
                    </Badge>
                    {selectedUser.subscription_type && (
                      <Badge variant="outline">
                        <Shield className="h-3 w-3 mr-1" /> {selectedUser.subscription_type}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={actionLoading === selectedUser.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleLock(selectedUser.id, !!selectedUser.is_locked);
                  }}
                  className={selectedUser.is_locked ? "text-green-600 border-green-200" : "text-destructive border-destructive/30"}
                >
                  {actionLoading === selectedUser.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : selectedUser.is_locked ? (
                    <><Unlock className="h-4 w-4 mr-1" /> Unlock</>
                  ) : (
                    <><Lock className="h-4 w-4 mr-1" /> Lock</>
                  )}
                </Button>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium min-w-[60px]">Email:</span>
                    <span className="text-muted-foreground break-all">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium min-w-[60px]">Phone:</span>
                    <span className="text-muted-foreground">{selectedUser.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium min-w-[60px]">Joined:</span>
                    <span className="text-muted-foreground">
                      {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* CV / Documents */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Documents</h4>
                {selectedUser.cv_url ? (
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <a href={selectedUser.cv_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 text-primary" />
                      View Curriculum Vitae (CV)
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                    </a>
                  </Button>
                ) : (
                  <div className="text-sm text-muted-foreground italic bg-muted/50 p-4 rounded-lg flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    No CV uploaded for this user.
                  </div>
                )}
              </div>

              <Separator />

              {/* Subscription */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <CreditCard className="h-4 w-4 inline mr-1" /> Subscription
                </h4>
                {subLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : subscription ? (
                  <Card className="border-primary/20">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Status</span>
                        {getStatusBadge(subscription.status)}
                      </div>
                      {subscription.tier && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Plan</span>
                          <span className="font-medium capitalize">{subscription.tier}</span>
                        </div>
                      )}
                      {subscription.current_period_start && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Period Start</span>
                          <span>{new Date(subscription.current_period_start).toLocaleDateString('en-GB')}</span>
                        </div>
                      )}
                      {subscription.current_period_end && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Period End</span>
                          <span>{new Date(subscription.current_period_end).toLocaleDateString('en-GB')}</span>
                        </div>
                      )}
                      {subscription.stripe_subscription_id && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Subscription ID</span>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{subscription.stripe_subscription_id}</code>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Since</span>
                        <span>{new Date(subscription.created_at).toLocaleDateString('en-GB')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-sm text-muted-foreground italic bg-muted/50 p-4 rounded-lg flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    No active subscription found.
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

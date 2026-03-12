import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CreditCard, RefreshCw, Undo2, XCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SubscriptionRecord {
  id: string;
  user_id: string;
  status: string;
  tier: string | null;
  stripe_customer_id: string | null;
  product_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  updated_at: string;
  user_email: string | null;
  user_name: string | null;
}

export default function AdminSubscriptions() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'refund' | 'cancel';
    sub: SubscriptionRecord | null;
  }>({ open: false, type: 'refund', sub: null });

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-subscriptions', {
        body: { action: 'list' },
      });
      if (error) throw error;
      setSubscriptions(data?.subscriptions || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to load subscriptions', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchSubscriptions();
  }, [isAdmin]);

  const handleAction = async () => {
    const { type, sub } = confirmDialog;
    if (!sub?.stripe_customer_id) return;
    setConfirmDialog({ open: false, type: 'refund', sub: null });
    setActionLoading(sub.id);

    try {
      const { data, error } = await supabase.functions.invoke('admin-subscriptions', {
        body: {
          action: type,
          stripe_customer_id: sub.stripe_customer_id,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: 'Success',
        description: type === 'refund' ? 'Refund initiated successfully' : 'Subscription cancelled',
      });
      fetchSubscriptions();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || `Failed to ${type}`, variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'refunded': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Subscriptions</h1>
          <p className="text-muted-foreground">Manage user subscriptions and payments</p>
        </div>
        <Button variant="outline" onClick={fetchSubscriptions} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            All Subscriptions ({subscriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : subscriptions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No subscriptions found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sub.user_name || 'Unnamed'}</p>
                          <p className="text-sm text-muted-foreground">{sub.user_email || 'No email'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{sub.tier || 'None'}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColor(sub.status)}`}>
                          {sub.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {sub.current_period_start
                          ? format(new Date(sub.current_period_start), 'dd MMM yyyy')
                          : '—'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {sub.current_period_end
                          ? format(new Date(sub.current_period_end), 'dd MMM yyyy')
                          : '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(sub.updated_at), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        {sub.status === 'active' && sub.stripe_customer_id && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionLoading === sub.id}
                              onClick={() => setConfirmDialog({ open: true, type: 'refund', sub })}
                            >
                              {actionLoading === sub.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Undo2 className="h-3 w-3 mr-1" />
                              )}
                              Refund
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={actionLoading === sub.id}
                              onClick={() => setConfirmDialog({ open: true, type: 'cancel', sub })}
                            >
                              {actionLoading === sub.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              Cancel
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, type: 'refund', sub: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === 'refund' ? 'Initiate Refund' : 'Cancel Subscription'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === 'refund'
                ? `Are you sure you want to refund the payment for ${confirmDialog.sub?.user_name || confirmDialog.sub?.user_email}? This will process a refund through Stripe.`
                : `Are you sure you want to cancel the subscription for ${confirmDialog.sub?.user_name || confirmDialog.sub?.user_email}? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, go back</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction} className={confirmDialog.type === 'cancel' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}>
              Yes, {confirmDialog.type === 'refund' ? 'refund' : 'cancel'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdmin } from '@/hooks/useAdmin';
import { SendNotificationModal } from '@/components/admin/SendNotificationModal';
import { Search, Bell, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function AdminNotifications() {
  const { isAdmin, loading, users, sendNotification } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

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
    (u.last_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground">Send notifications to users</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Bell className="h-4 w-4 mr-2" />
          Send Notification
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((u) => (
          <Card key={u.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {u.first_name || u.last_name 
                      ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
                      : 'Unnamed User'}
                  </p>
                  <p className="text-sm text-muted-foreground">{u.phone || 'No phone'}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setModalOpen(true);
                  }}
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredUsers.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center text-muted-foreground">
              No users found
            </CardContent>
          </Card>
        )}
      </div>

      <SendNotificationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        users={users}
        onSend={sendNotification}
      />
    </AdminLayout>
  );
}

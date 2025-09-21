import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, Search, Filter, Trash2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  read: boolean;
  created_at: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        toast({
          variant: "destructive",
          title: "Fehler",
          description: "Benachrichtigungen konnten nicht geladen werden."
        });
        return;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast({
        title: "Erfolgreich",
        description: "Alle Benachrichtigungen als gelesen markiert."
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Fehler beim Markieren der Benachrichtigungen."
      });
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast({
        title: "Gelöscht",
        description: "Benachrichtigung wurde gelöscht."
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Benachrichtigung konnte nicht gelöscht werden."
      });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.data?.thread_id) {
      window.location.href = `/threads/${notification.data.thread_id}`;
    } else if (notification.data?.application_id) {
      window.location.href = `/applications/${notification.data.application_id}`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_new':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'admin_application_new':
        return <MessageSquare className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchTerm === "" || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'unread' && !notification.read) ||
      (filterType === 'read' && notification.read);

    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const breadcrumbs = [
    { label: "Übersicht", href: "/" },
    { label: "Benachrichtigungen" }
  ];

  if (loading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-md animate-pulse" />
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Benachrichtigungen</h1>
            <p className="text-muted-foreground font-ui">
              {unreadCount > 0 ? `${unreadCount} ungelesene Benachrichtigung${unreadCount !== 1 ? 'en' : ''}` : 'Alle Benachrichtigungen gelesen'}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} className="gap-2">
              <Check className="h-4 w-4" />
              Alle als gelesen markieren
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Benachrichtigungen suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterType} onValueChange={(value: 'all' | 'unread' | 'read') => setFilterType(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="unread">Ungelesen</SelectItem>
              <SelectItem value="read">Gelesen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                {searchTerm || filterType !== 'all' ? 'Keine passenden Benachrichtigungen' : 'Keine Benachrichtigungen'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all' 
                  ? 'Ändern Sie Ihre Filter oder Suchbegriffe.'
                  : 'Sie haben zurzeit keine Benachrichtigungen.'
                }
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${
                            !notification.read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        
                        {notification.message && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        )}
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: de
                          })}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="gap-2"
                          >
                            <Check className="h-4 w-4" />
                            Als gelesen markieren
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Löschen
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Statistics */}
        {notifications.length > 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              {filteredNotifications.length} von {notifications.length} Benachrichtigung{notifications.length !== 1 ? 'en' : ''} angezeigt
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
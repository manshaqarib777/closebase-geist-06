import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MessageSquare, 
  Send, 
  Phone, 
  Video, 
  MoreHorizontal,
  Plus,
  Filter,
  Archive,
  Star,
  Clock,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  sender: "company" | "candidate";
  content: string;
  timestamp: string;
  read: boolean;
}

interface Thread {
  id: string;
  candidateName: string;
  candidateAvatar: string;
  jobTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: "active" | "archived" | "starred";
  messages: Message[];
}

const threadsData: Thread[] = [
  {
    id: "1",
    candidateName: "Sarah Müller",
    candidateAvatar: "SM",
    jobTitle: "Senior Sales Consultant B2B",
    lastMessage: "Vielen Dank für die schnelle Rückmeldung. Wann könnten wir ein Gespräch führen?",
    lastMessageTime: "vor 5 Min.",
    unreadCount: 2,
    status: "active",
    messages: [
      {
        id: "1",
        sender: "company",
        content: "Hallo Sarah, vielen Dank für Ihre Bewerbung auf die Position als Senior Sales Consultant. Wir sind sehr interessiert an Ihrem Profil.",
        timestamp: "14:30",
        read: true
      },
      {
        id: "2",
        sender: "candidate",
        content: "Vielen Dank für die schnelle Rückmeldung. Wann könnten wir ein Gespräch führen?",
        timestamp: "14:35",
        read: false
      }
    ]
  },
  {
    id: "2",
    candidateName: "Thomas Weber",
    candidateAvatar: "TW",
    jobTitle: "Closer für High-Ticket Sales",
    lastMessage: "Gerne kann ich Ihnen weitere Referenzen zusenden.",
    lastMessageTime: "vor 2 Std.",
    unreadCount: 0,
    status: "active",
    messages: [
      {
        id: "1",
        sender: "company",
        content: "Hallo Thomas, können Sie uns mehr über Ihre Erfahrung im High-Ticket Sales erzählen?",
        timestamp: "12:15",
        read: true
      },
      {
        id: "2",
        sender: "candidate",
        content: "Gerne kann ich Ihnen weitere Referenzen zusenden.",
        timestamp: "12:45",
        read: true
      }
    ]
  },
  {
    id: "3",
    candidateName: "Anna Schmidt",
    candidateAvatar: "AS",
    jobTitle: "Sales Development Rep",
    lastMessage: "Ich freue mich auf unser Interview am Donnerstag.",
    lastMessageTime: "gestern",
    unreadCount: 0,
    status: "starred",
    messages: [
      {
        id: "1",
        sender: "company",
        content: "Wir würden gerne ein Interview mit Ihnen führen. Passt Ihnen Donnerstag um 14:00?",
        timestamp: "gestern 16:20",
        read: true
      },
      {
        id: "2",
        sender: "candidate",
        content: "Ich freue mich auf unser Interview am Donnerstag.",
        timestamp: "gestern 16:45",
        read: true
      }
    ]
  }
];

export default function CompanyMessages() {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(threadsData[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageFilter, setMessageFilter] = useState("all");
  const [newMessage, setNewMessage] = useState("");

  const filteredThreads = threadsData.filter(thread => {
    const matchesSearch = thread.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thread.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = messageFilter === "all" || 
                         (messageFilter === "unread" && thread.unreadCount > 0) ||
                         (messageFilter === "starred" && thread.status === "starred") ||
                         (messageFilter === "archived" && thread.status === "archived");
    
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThread) return;
    
    // Here you would typically send the message to your backend
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "starred":
        return <Star className="w-4 h-4 text-yellow-500 fill-current" />;
      case "archived":
        return <Archive className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <AppLayout 
      breadcrumbs={[
        { label: "Nachrichten" }
      ]}
    >
      <div className="flex h-[calc(100vh-8rem)] bg-background">
        {/* Messages List */}
        <div className="w-80 border-r border-border bg-card">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Nachrichten</h2>
              <Button size="icon" variant="ghost">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Kandidaten durchsuchen..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter */}
            <Select value={messageFilter} onValueChange={setMessageFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Nachrichten</SelectItem>
                <SelectItem value="unread">Ungelesen</SelectItem>
                <SelectItem value="starred">Markiert</SelectItem>
                <SelectItem value="archived">Archiviert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Threads List */}
          <ScrollArea className="h-[calc(100%-180px)]">
            <div className="p-2">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  className={`p-3 mb-1 rounded-lg cursor-pointer transition-colors ${
                    selectedThread?.id === thread.id 
                      ? "bg-primary/10 border border-primary/20" 
                      : "hover:bg-surface"
                  }`}
                  onClick={() => setSelectedThread(thread)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/15 text-primary font-medium text-sm">
                        {thread.candidateAvatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground text-sm truncate">
                          {thread.candidateName}
                        </h4>
                        {getStatusIcon(thread.status)}
                        {thread.unreadCount > 0 && (
                          <Badge variant="default" className="ml-auto text-xs h-5 min-w-[20px] rounded-full">
                            {thread.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1 truncate">
                        {thread.jobTitle}
                      </p>
                      <p className="text-xs text-foreground/70 truncate">
                        {thread.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {thread.lastMessageTime}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {selectedThread ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/15 text-primary font-medium">
                      {selectedThread.candidateAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {selectedThread.candidateName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedThread.jobTitle}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedThread.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "company" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "company"
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface text-foreground border border-border"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs ${
                          message.sender === "company" 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        }`}>
                          {message.timestamp}
                        </span>
                        {message.sender === "company" && (
                          <CheckCircle2 className={`w-3 h-3 ${
                            message.read ? "text-primary-foreground/70" : "text-primary-foreground/50"
                          }`} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder="Nachricht schreiben..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 min-h-[60px] max-h-32 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="mb-2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-surface/50">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Wählen Sie eine Unterhaltung
              </h3>
              <p className="text-muted-foreground">
                Klicken Sie auf eine Nachricht, um die Unterhaltung zu öffnen.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
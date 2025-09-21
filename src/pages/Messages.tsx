import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Send, 
  Paperclip, 
  Calendar,
  Link,
  MoreVertical,
  Check,
  CheckCheck,
  ExternalLink,
  Settings
} from "lucide-react";

interface MessageThread {
  id: string;
  job_title: string;
  company_name: string;
  company_logo?: string;
  last_message: string;
  last_message_time: Date;
  unread_count: number;
  status: 'active' | 'closed';
}

interface Message {
  id: string;
  thread_id: string;
  sender: 'user' | 'company' | 'system';
  content: string;
  timestamp: Date;
  is_read: boolean;
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
}

const mockThreads: MessageThread[] = [
  {
    id: "1",
    job_title: "Senior Sales Manager",
    company_name: "TechFlow GmbH",
    company_logo: "/placeholder.svg",
    last_message: "Vielen Dank für Ihr Interesse. Wann hätten Sie Zeit für ein kurzes Gespräch?",
    last_message_time: new Date('2024-01-15T14:30:00'),
    unread_count: 2,
    status: 'active'
  },
  {
    id: "2",
    job_title: "Business Development Rep",
    company_name: "SalesForce Pro",
    last_message: "Ihre Bewerbung wurde erfolgreich eingereicht.",
    last_message_time: new Date('2024-01-12T10:15:00'),
    unread_count: 0,
    status: 'active'
  }
];

const mockMessages: Message[] = [
  {
    id: "1",
    thread_id: "1",
    sender: "company",
    content: "Hallo! Vielen Dank für Ihre Bewerbung als Senior Sales Manager. Ihr Profil hat uns sehr beeindruckt.",
    timestamp: new Date('2024-01-15T10:00:00'),
    is_read: true
  },
  {
    id: "2",
    thread_id: "1",
    sender: "user",
    content: "Vielen Dank für die schnelle Rückmeldung! Ich freue mich sehr über Ihr Interesse.",
    timestamp: new Date('2024-01-15T11:30:00'),
    is_read: true
  },
  {
    id: "3",
    thread_id: "1",
    sender: "company",
    content: "Gerne würden wir Sie zu einem kurzen Gespräch einladen. Wann hätten Sie Zeit für ein 30-minütiges Video-Call?",
    timestamp: new Date('2024-01-15T14:30:00'),
    is_read: false
  },
  {
    id: "4",
    thread_id: "1",
    sender: "system",
    content: "Status wurde geändert: Interview geplant",
    timestamp: new Date('2024-01-15T14:35:00'),
    is_read: false
  }
];

const savedReplies = [
  "Vielen Dank für Ihre Nachricht. Ich freue mich über Ihr Interesse an meinem Profil.",
  "Gerne können wir einen Termin vereinbaren. Ich bin flexibel und passe mich Ihren Zeiten an.",
  "Vielen Dank für die Einladung zum Interview. Ich freue mich darauf, Sie kennenzulernen.",
  "Können Sie mir mehr Details zur Position und den Anforderungen mitteilen?"
];

function formatMessageTime(date: Date) {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else if (diffDays < 7) {
    return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
  } else {
    return date.toLocaleDateString('de-DE');
  }
}

export default function Messages() {
  const { threadId } = useParams();
  const [selectedThread, setSelectedThread] = useState(threadId || mockThreads[0]?.id);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const breadcrumbs = [
    { label: "Übersicht", href: "/" },
    { label: "Nachrichten" }
  ];

  const filteredThreads = mockThreads.filter(thread => {
    const matchesSearch = thread.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thread.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'unread' && thread.unread_count > 0);
    
    return matchesSearch && matchesFilter;
  });

  const currentThread = mockThreads.find(t => t.id === selectedThread);
  const threadMessages = mockMessages.filter(m => m.thread_id === selectedThread);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // Add message logic here
    setMessageText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const insertQuickText = (text: string) => {
    setMessageText(text);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="h-[calc(100vh-12rem)] flex gap-8">
        {/* Thread List */}
        <div className="w-80 flex flex-col">
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm h-full flex flex-col">
            <div className="p-4 border-b border-black/5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">Nachrichten</h2>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                  <Input
                    placeholder="Suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-black/10"
                  />
                </div>
                
                <Select value={filter} onValueChange={(value) => setFilter(value as 'all' | 'unread')}>
                  <SelectTrigger className="border-black/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle</SelectItem>
                    <SelectItem value="unread">Ungelesen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div>
                {filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className={`p-4 cursor-pointer transition-colors duration-200 border-b border-black/5 last:border-b-0 ${
                      selectedThread === thread.id 
                        ? 'bg-[var(--color-primary)]/6 border-[var(--color-primary)]/15' 
                        : 'hover:bg-black/2'
                    }`}
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={thread.company_logo} />
                        <AvatarFallback className="bg-[var(--color-surface)] text-[var(--color-text)]">
                          {thread.company_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium truncate ${
                            thread.unread_count > 0 ? 'font-semibold text-[var(--color-text)]' : 'text-[var(--color-text)]'
                          }`}>
                            {thread.job_title}
                          </h4>
                          {thread.unread_count > 0 && (
                            <Badge className="text-xs bg-[var(--color-primary)] text-white ml-2">
                              {thread.unread_count}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-[var(--color-muted)] truncate mt-0.5">
                          {thread.company_name}
                        </p>
                        
                        <p className={`text-xs mt-1 truncate ${
                          thread.unread_count > 0 ? 'font-medium text-[var(--color-text)]' : 'text-[var(--color-muted)]'
                        }`}>
                          {thread.last_message}
                        </p>
                        
                        <p className="text-xs text-[var(--color-muted)] mt-1">
                          {formatMessageTime(thread.last_message_time)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredThreads.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                    <Search className="h-8 w-8 text-[var(--color-muted)]" />
                  </div>
                  <p className="text-sm text-[var(--color-muted)]">Keine Nachrichten gefunden</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentThread ? (
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm h-full flex flex-col">
              {/* Chat Header */}
              <div className="py-3 px-4 border-b border-black/5 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentThread.company_logo} />
                      <AvatarFallback className="bg-[var(--color-surface)] text-[var(--color-text)]">
                        {currentThread.company_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-[var(--color-text)]">{currentThread.job_title}</h3>
                      <p className="text-sm text-[var(--color-muted)]">
                        Remote · SaaS · Provision 12%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                      <Calendar className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Group messages by day */}
                {threadMessages.map((message, index) => {
                  const isNewDay = index === 0 || 
                    new Date(message.timestamp).toDateString() !== 
                    new Date(threadMessages[index - 1].timestamp).toDateString();
                  
                  return (
                    <React.Fragment key={message.id}>
                      {isNewDay && (
                        <div className="text-center my-4">
                          <span className="text-xs text-[var(--color-muted)] bg-[var(--color-surface)] px-3 py-1 rounded-full">
                            {new Date(message.timestamp).toLocaleDateString('de-DE', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </span>
                        </div>
                      )}
                      
                      <div
                        className={`flex ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[68%] ${
                            message.sender === 'user'
                              ? 'rounded-3xl rounded-tr-md bg-[var(--color-primary)] text-white px-4 py-3 shadow'
                              : message.sender === 'system'
                              ? 'bg-[var(--color-surface)] text-[var(--color-muted)] text-center text-xs px-3 py-2 rounded-xl'
                              : 'rounded-3xl rounded-tl-md bg-[var(--color-surface)] text-[var(--color-text)] px-4 py-3 shadow-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          
                          <div className={`flex items-center gap-1 mt-1 ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}>
                            <span className={`text-xs ${
                              message.sender === 'user' ? 'text-white/70' : 'text-[var(--color-muted)]'
                            }`}>
                              {formatMessageTime(message.timestamp)}
                            </span>
                            
                            {message.sender === 'user' && (
                              message.is_read ? (
                                <CheckCheck className="h-3 w-3 text-white/70" />
                              ) : (
                                <Check className="h-3 w-3 text-white/70" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
              
              {/* Composer */}
              <div className="border-t border-black/5 p-3 bg-white sticky bottom-0">
                {/* Quick Actions */}
                <div className="flex gap-2 mb-3">
                  <Select onValueChange={insertQuickText}>
                    <SelectTrigger className="w-48 border-black/10">
                      <SelectValue placeholder="Danke-Vorlage" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedReplies.map((reply, index) => (
                        <SelectItem key={index} value={reply}>
                          {reply.substring(0, 40)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm" className="gap-2 border-black/10 text-[var(--color-muted)] hover:text-[var(--color-text)]">
                    <Link className="h-4 w-4" />
                    Interview-Link einfügen
                  </Button>
                  
                  <Button variant="outline" size="sm" className="gap-2 border-black/10 text-[var(--color-muted)] hover:text-[var(--color-text)]">
                    <Calendar className="h-4 w-4" />
                    Kalender-Slots
                  </Button>
                </div>
                
                {/* Message Input */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Nachricht schreiben... (Strg+Enter zum Senden)"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="min-h-[60px] resize-none pr-10 border-black/10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-2 right-2 h-6 w-6 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                  <Search className="h-10 w-10 text-[var(--color-muted)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--color-text)]">
                  Wähle einen Chat, um Nachrichten anzuzeigen
                </h3>
                <p className="text-[var(--color-muted)] mb-4">
                  Beginnen Sie eine Unterhaltung oder wählen Sie eine bestehende aus der Liste aus
                </p>
                <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90" asChild>
                  <a href="/jobs">Jobs durchsuchen</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
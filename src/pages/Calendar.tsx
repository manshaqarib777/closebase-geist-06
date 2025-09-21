import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Download, 
  Upload,
  Clock,
  MapPin,
  Video,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  meet_link?: string;
  notes?: string;
  source: 'chat' | 'manual' | 'import';
  company_name?: string;
  job_title?: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Interview - Senior Sales Manager",
    start: new Date('2024-01-16T14:00:00'),
    end: new Date('2024-01-16T15:00:00'),
    meet_link: "https://meet.google.com/abc-def-ghi",
    notes: "Erstes Interview mit HR-Team",
    source: 'chat',
    company_name: "TechFlow GmbH",
    job_title: "Senior Sales Manager"
  },
  {
    id: "2",
    title: "Follow-up Call - BDR Position",
    start: new Date('2024-01-18T10:30:00'),
    end: new Date('2024-01-18T11:00:00'),
    location: "Telefon: +49 30 12345678",
    notes: "Nachgespräch zur Klärung offener Fragen",
    source: 'manual',
    company_name: "SalesForce Pro"
  },
  {
    id: "3",
    title: "Präsentation - Vertriebsberater",
    start: new Date('2024-01-19T15:00:00'),
    end: new Date('2024-01-19T16:30:00'),
    location: "Berlin Office, Unter den Linden 1",
    notes: "Präsentation der Verkaufsstrategie",
    source: 'manual',
    company_name: "SolarMax Solutions"
  }
];

function formatEventTime(start: Date, end: Date) {
  const startTime = start.toLocaleTimeString('de-DE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const endTime = end.toLocaleTimeString('de-DE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  return `${startTime} - ${endTime}`;
}

function formatEventDate(date: Date) {
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getWeekDays(date: Date) {
  const week = [];
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    week.push(day);
  }
  
  return week;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    location: '',
    meet_link: '',
    notes: ''
  });

  const breadcrumbs = [
    { label: "Übersicht", href: "/" },
    { label: "Kalender" }
  ];

  const weekDays = getWeekDays(currentDate);
  
  const getEventsForDay = (date: Date) => {
    return mockEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const handleCreateEvent = () => {
    // Validation
    if (!formData.title || !formData.start || !formData.end) {
      return;
    }
    
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);
    
    if (startDate >= endDate) {
      return;
    }
    
    // Create event logic here
    setIsCreateModalOpen(false);
    setFormData({
      title: '',
      start: '',
      end: '',
      location: '',
      meet_link: '',
      notes: ''
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const exportToICS = () => {
    // ICS export logic
    const blob = new Blob(['ICS export content'], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kalender.ics';
    a.click();
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Kalender</h1>
            <p className="text-muted-foreground font-ui">
              Verwalten Sie Ihre Interviews und Termine
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={exportToICS} className="gap-2">
              <Download className="h-4 w-4" />
              Exportieren
            </Button>
            
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Importieren
            </Button>
            
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Neuer Termin
            </Button>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h2 className="text-xl font-heading font-semibold min-w-[200px] text-center">
              {view === 'week' 
                ? `${weekDays[0].toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}`
                : currentDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
              }
            </h2>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Tabs value={view} onValueChange={(value) => setView(value as 'week' | 'month')}>
            <TabsList>
              <TabsTrigger value="week">Woche</TabsTrigger>
              <TabsTrigger value="month">Monat</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Calendar Grid */}
        {view === 'week' ? (
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => {
              const isToday = day.toDateString() === new Date().toDateString();
              const events = getEventsForDay(day);
              
              return (
                <Card key={index} className={isToday ? 'ring-2 ring-cb-primary' : ''}>
                  <CardHeader className="pb-3">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground font-ui">
                        {day.toLocaleDateString('de-DE', { weekday: 'short' })}
                      </div>
                      <div className={`text-lg font-semibold ${
                        isToday ? 'text-cb-primary' : ''
                      }`}>
                        {day.getDate()}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-2">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="p-2 bg-cb-primary/10 rounded cursor-pointer hover:bg-cb-primary/20 transition-colors"
                      >
                        <div className="text-xs font-medium text-cb-primary truncate">
                          {event.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatEventTime(event.start, event.end)}
                        </div>
                        {event.company_name && (
                          <div className="text-xs text-muted-foreground truncate">
                            {event.company_name}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {events.length === 0 && (
                      <div className="text-xs text-muted-foreground text-center py-4">
                        Keine Termine
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12 text-muted-foreground">
                Monatsansicht in Entwicklung
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Anstehende Termine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEvents
                .filter(event => event.start > new Date())
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-cb-primary rounded-full"></div>
                      
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {formatEventDate(event.start)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatEventTime(event.start, event.end)}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          )}
                          {event.meet_link && (
                            <div className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Video-Call
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {event.source === 'chat' ? 'Chat' : 
                       event.source === 'manual' ? 'Manuell' : 'Import'}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Event Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Neuen Termin erstellen</DialogTitle>
            <DialogDescription>
              Erstellen Sie einen neuen Kalendereintrag
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="z.B. Interview mit..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Start *</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={formData.start}
                  onChange={(e) => setFormData(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="end">Ende *</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={formData.end}
                  onChange={(e) => setFormData(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Ort</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="z.B. Berlin Office oder Telefonnummer"
              />
            </div>
            
            <div>
              <Label htmlFor="meet_link">Video-Link</Label>
              <Input
                id="meet_link"
                type="url"
                value={formData.meet_link}
                onChange={(e) => setFormData(prev => ({ ...prev, meet_link: e.target.value }))}
                placeholder="https://meet.google.com/..."
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notizen</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Zusätzliche Informationen..."
                className="min-h-20"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateEvent}>
              Erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              {selectedEvent.company_name && (
                <DialogDescription>{selectedEvent.company_name}</DialogDescription>
              )}
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                {formatEventDate(selectedEvent.start)}
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {formatEventTime(selectedEvent.start, selectedEvent.end)}
              </div>
              
              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selectedEvent.location}
                </div>
              )}
              
              {selectedEvent.meet_link && (
                <div className="flex items-center gap-2 text-sm">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={selectedEvent.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cb-primary hover:underline"
                  >
                    Video-Call beitreten
                  </a>
                </div>
              )}
              
              {selectedEvent.notes && (
                <div>
                  <Label className="text-sm font-medium">Notizen</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedEvent.notes}
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {selectedEvent.source === 'chat' ? 'Aus Chat' :
                   selectedEvent.source === 'manual' ? 'Manuell erstellt' : 'Importiert'}
                </Badge>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                Schließen
              </Button>
              <Button>
                Bearbeiten
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  );
}
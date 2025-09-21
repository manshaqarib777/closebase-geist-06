import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, MoreHorizontal, Shield, Clock, Eye, Edit, Trash2, Mail, Calendar } from "lucide-react";
import { useState } from "react";

const teamMembers = [
  {
    id: "1",
    name: "Sarah Müller",
    email: "sarah.mueller@techflow.com",
    role: "owner",
    status: "active",
    lastLogin: "vor 2 Std.",
    invitedAt: "2024-11-15",
    acceptedAt: "2024-11-15",
    avatar: "SM"
  },
  {
    id: "2",
    name: "Thomas Weber",
    email: "thomas.weber@techflow.com", 
    role: "recruiter",
    status: "active",
    lastLogin: "vor 1 Tag",
    invitedAt: "2024-11-20",
    acceptedAt: "2024-11-21",
    avatar: "TW"
  },
  {
    id: "3",
    name: "Anna Schmidt",
    email: "anna.schmidt@techflow.com",
    role: "viewer",
    status: "pending",
    lastLogin: "-",
    invitedAt: "2024-12-18",
    acceptedAt: null,
    avatar: "AS"
  }
];

const roleLabels = {
  owner: "Owner",
  recruiter: "Recruiter", 
  viewer: "Viewer"
};

const roleDescriptions = {
  owner: "Vollzugriff auf alle Funktionen und Einstellungen",
  recruiter: "Kann Jobs verwalten und Kandidaten bearbeiten",
  viewer: "Nur Lesezugriff auf Jobs und Kandidaten"
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "owner": return "bg-purple-100 text-purple-800 border-purple-200";
    case "recruiter": return "bg-blue-100 text-blue-800 border-blue-200";
    case "viewer": return "bg-gray-100 text-gray-800 border-gray-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800 border-green-200";
    case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
    case "inactive": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const auditLog = [
  {
    id: "1",
    user: "Sarah Müller",
    action: "Job veröffentlicht",
    target: "Senior Sales Consultant B2B",
    timestamp: "vor 3 Std."
  },
  {
    id: "2",
    user: "Thomas Weber", 
    action: "Kandidat zu Shortlist hinzugefügt",
    target: "Anna Schmidt",
    timestamp: "vor 5 Std."
  },
  {
    id: "3",
    user: "Sarah Müller",
    action: "Team-Mitglied eingeladen",
    target: "anna.schmidt@techflow.com",
    timestamp: "vor 2 Tagen"
  }
];

export default function CompanyTeam() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [require2FA, setRequire2FA] = useState(false);

  const handleInvite = () => {
    // Handle invitation logic here
    console.log("Inviting:", inviteEmail, "as", inviteRole);
    setIsInviteDialogOpen(false);
    setInviteEmail("");
    setInviteRole("viewer");
  };

  const handleResendInvite = (member: any) => {
    console.log("Resending invite to:", member.email);
  };

  const handleRoleChange = (memberId: string, newRole: string) => {
    console.log("Changing role for member:", memberId, "to:", newRole);
  };

  const handleRemoveMember = (memberId: string) => {
    console.log("Removing member:", memberId);
  };

  return (
    <AppLayout 
      breadcrumbs={[
        { label: "Team" }
      ]}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Team-Verwaltung
          </h1>
          <p className="text-muted-foreground font-ui">
            Verwalte Team-Mitglieder, Rollen und Berechtigungen für dein Unternehmen.
          </p>
        </div>
        
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cb-primary hover:bg-cb-primary/90 mt-4 lg:mt-0">
              <UserPlus className="w-4 h-4 mr-2" />
              Team-Mitglied einladen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neues Team-Mitglied einladen</DialogTitle>
              <DialogDescription>
                Lade eine Person zu deinem Team ein und weise ihr eine Rolle zu.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">E-Mail-Adresse</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="role">Rolle</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {roleDescriptions[inviteRole as keyof typeof roleDescriptions]}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleInvite} disabled={!inviteEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Einladung senden
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Team Members */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team-Mitglieder ({teamMembers.length}/10)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-cb-primary/10 text-cb-primary font-ui font-semibold">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-ui font-medium text-foreground">{member.name}</h4>
                        <Badge className={`text-xs border ${getRoleColor(member.role)}`}>
                          {roleLabels[member.role as keyof typeof roleLabels]}
                        </Badge>
                        <Badge className={`text-xs border ${getStatusColor(member.status)}`}>
                          {member.status === "active" ? "Aktiv" : member.status === "pending" ? "Ausstehend" : "Inaktiv"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{member.email}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Letzter Login: {member.lastLogin}</span>
                        <span>Eingeladen: {new Date(member.invitedAt).toLocaleDateString('de-DE')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {member.status === "pending" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleResendInvite(member)}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Erneut senden
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Rolle ändern
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Aktivitäten anzeigen
                          </DropdownMenuItem>
                          {member.role !== "owner" && (
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Entfernen
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audit Log */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitäts-Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-cb-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-ui font-medium text-foreground">
                        <span className="text-cb-primary">{entry.user}</span> {entry.action}
                      </p>
                      <p className="text-sm text-muted-foreground">{entry.target}</p>
                      <p className="text-xs text-muted-foreground mt-1">{entry.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Sicherheitseinstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-ui font-medium text-foreground">2FA erzwingen</p>
                  <p className="text-sm text-muted-foreground">
                    Alle Team-Mitglieder müssen 2FA aktivieren
                  </p>
                </div>
                <Switch 
                  checked={require2FA}
                  onCheckedChange={setRequire2FA}
                />
              </div>
              
              <div className="pt-4 border-t border-border">
                <Button variant="outline" className="w-full" size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  SSO konfigurieren
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Verfügbar im Scale Plan
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Roles Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rollen-Übersicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                      Owner
                    </Badge>
                    <span className="text-sm font-ui font-medium">1 Mitglied</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Vollzugriff auf alle Funktionen und Einstellungen
                  </p>
                </div>

                <div className="p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                      Recruiter
                    </Badge>
                    <span className="text-sm font-ui font-medium">1 Mitglied</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Kann Jobs verwalten und Kandidaten bearbeiten
                  </p>
                </div>

                <div className="p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                      Viewer
                    </Badge>
                    <span className="text-sm font-ui font-medium">1 Mitglied</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Nur Lesezugriff auf Jobs und Kandidaten
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team-Statistiken</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-3 border border-border rounded-lg">
                <div className="text-2xl font-heading font-bold text-foreground mb-1">
                  87%
                </div>
                <div className="text-sm text-muted-foreground">
                  Team-Aktivität
                </div>
              </div>

              <div className="text-center p-3 border border-border rounded-lg">
                <div className="text-2xl font-heading font-bold text-foreground mb-1">
                  2,3 Std.
                </div>
                <div className="text-sm text-muted-foreground">
                  Ø Antwortzeit
                </div>
              </div>

              <div className="text-center p-3 border border-border rounded-lg">
                <div className="text-2xl font-heading font-bold text-foreground mb-1">
                  24
                </div>
                <div className="text-sm text-muted-foreground">
                  Aktionen heute
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
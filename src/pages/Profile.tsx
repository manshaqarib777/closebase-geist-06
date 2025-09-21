import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProgressRing } from "@/components/ui/progress-ring";
import { ProfileFieldManager } from "@/components/ui/profile-field-manager";
import { VideoIntroduction } from "@/components/profile/video-introduction";
import { 
  Edit, 
  Upload, 
  Play, 
  Download, 
  MapPin, 
  Calendar,
  Clock,
  User,
  Briefcase,
  FileText,
  Video,
  Award,
  Plus,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Profile {
  name: string;
  email: string;
  location: string;
  avatar?: string;
  timezone: string;
  languages: string[];
  
  // Role & Experience
  roles: string[];
  experience_band: string;
  desired_roles: string[];
  personality_text: string;
  industries: string[];
  
  // Availability
  employment_type: string[];
  weekly_hours: number;
  availability_slots: string[];
  
  // Experience Timeline
  experience: {
    id: string;
    company: string;
    role_title: string;
    start_date: string;
    end_date?: string;
    achievements: string;
  }[];
  
  // Documents & Media
  cv_uploaded: boolean;
  video_uploaded: boolean;
  video_transcribed: boolean;
  
  // External Links
  linkedin_url?: string;
  xing_url?: string;
  website_url?: string;
  
  // Completion
  profile_completion: number;
}

const mockProfile: Profile = {
  name: "Max Mustermann",
  email: "max.mustermann@email.com", 
  location: "Berlin, Deutschland",
  avatar: "/placeholder.svg",
  timezone: "Europe/Berlin",
  languages: ["de", "en"],
  
  roles: ["closer", "consultant"],
  experience_band: "3_5_years",
  desired_roles: ["closer", "full_cycle"],
  personality_text: "Ich bin ein erfahrener Sales Professional mit Leidenschaft für kundenorientierte Lösungen. Meine Stärke liegt in der Beziehungsaufbau und der strukturierten Herangehensweise an komplexe Verkaufsprozesse.",
  industries: ["insurance", "finance", "photovoltaic"],
  
  employment_type: ["freelance", "employee"],
  weekly_hours: 35,
  availability_slots: ["morning", "afternoon"],
  
  experience: [
    {
      id: "1",
      company: "TechSales GmbH",
      role_title: "Senior Sales Manager",
      start_date: "2022-01",
      end_date: "2024-01",
      achievements: "Steigerung der Verkaufszahlen um 40%, Aufbau eines neuen Kundenportfolios mit €2M ARR"
    },
    {
      id: "2",
      company: "StartupVentures",
      role_title: "Business Development",
      start_date: "2020-03",
      end_date: "2021-12",
      achievements: "Entwicklung der Vertriebsstrategie, Akquisition von 50+ Neukunden"
    }
  ],
  
  cv_uploaded: true,
  video_uploaded: false,
  video_transcribed: false,
  
  linkedin_url: "https://linkedin.com/in/maxmustermann",
  
  profile_completion: 75
};

const roleLabels = {
  setter: "Setter",
  closer: "Closer", 
  consultant: "Berater",
  full_cycle: "Full Cycle"
};

const industryLabels = {
  insurance: "Versicherung",
  finance: "Finanz",
  marketing: "Marketing",
  social_media: "Social Media",
  digital_services: "Digital Services",
  ecommerce: "E-Commerce",
  photovoltaic: "Photovoltaik",
  consulting: "Beratung",
  energy: "Energie",
  real_estate: "Immobilien"
};

const experienceBandLabels = {
  "0_1_years": "0-1 Jahre",
  "1_3_years": "1-3 Jahre", 
  "3_5_years": "3-5 Jahre",
  "5_10_years": "5-10 Jahre",
  "10_plus_years": "10+ Jahre"
};

const employmentLabels = {
  freelance: "Freelance",
  employee: "Angestellt",
  both: "Beides"
};

export default function Profile() {
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  const breadcrumbs = [
    { label: "Übersicht", href: "/" },
    { label: "Profil" }
  ];

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const addExperience = () => {
    setEditForm(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          company: "",
          role_title: "",
          start_date: "",
          end_date: "",
          achievements: ""
        }
      ]
    }));
  };

  const removeExperience = (id: string) => {
    setEditForm(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex gap-6 items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-2xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-3">
                  <div>
                    <h1 className="text-2xl font-heading font-bold text-foreground">
                      {profile.name}
                    </h1>
                    <p className="text-muted-foreground font-ui">
                      {profile.email}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {profile.roles.map((role) => (
                      <Badge key={role}>{roleLabels[role as keyof typeof roleLabels]}</Badge>
                    ))}
                    {profile.employment_type.map((type) => (
                      <Badge key={type} variant="secondary">
                        {employmentLabels[type as keyof typeof employmentLabels]}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {profile.weekly_hours} Std/Woche
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {experienceBandLabels[profile.experience_band as keyof typeof experienceBandLabels]}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4">
                <div className="relative w-20 h-20">
                  <ProgressRing value={profile.profile_completion} className="w-20 h-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold">{profile.profile_completion}%</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {profile.video_uploaded && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Play className="h-4 w-4" />
                      Video ansehen
                    </Button>
                  )}
                  <Button onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Profil bearbeiten
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>Über mich</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Branchen</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.industries.map((industry) => (
                      <Badge key={industry} variant="outline">
                        {industryLabels[industry as keyof typeof industryLabels]}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Persönlichkeit & Arbeitsweise</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {profile.personality_text}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Experience Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Berufserfahrung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profile.experience.map((exp, index) => (
                    <div key={exp.id} className="relative">
                      {index !== profile.experience.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-full bg-muted"></div>
                      )}
                      
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-cb-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-5 w-5 text-cb-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium">{exp.role_title}</h4>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(exp.start_date).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })} - 
                            {exp.end_date 
                              ? new Date(exp.end_date).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
                              : ' Heute'
                            }
                          </p>
                          <p className="text-sm mt-2 text-muted-foreground">
                            {exp.achievements}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Profile Field Manager for Avg Deal Size */}
            <ProfileFieldManager 
              currentDealSize={15000} // Example value
              onDealSizeChange={(size) => {
                console.log('Deal size updated:', size);
                // This would update the profile data
              }}
            />

            {/* Video Introduction */}
            <VideoIntroduction 
              profile={{
                intro_video_path: mockProfile.video_uploaded ? 'sample-path.mp4' : undefined,
                intro_video_visibility: 'on_apply',
                intro_video_duration: 65,
                intro_video_uploaded_at: '2024-01-15T10:30:00Z'
              }}
              onUpdate={() => {
                // Refresh profile data
                console.log('Video updated');
              }}
            />

            {/* Documents & Media */}
            <Card>
              <CardHeader>
                <CardTitle>Dokumente & Nachweise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Lebenslauf</span>
                      </div>
                      {profile.cv_uploaded ? (
                        <CheckCircle className="h-5 w-5 text-cb-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {profile.cv_uploaded ? "Hochgeladen" : "Erforderlich"}
                    </p>
                    {profile.cv_uploaded ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Upload className="h-3 w-3" />
                          Ersetzen
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" className="gap-1">
                        <Upload className="h-3 w-3" />
                        Hochladen
                      </Button>
                    )}
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Video-Vorstellung</span>
                      </div>
                      {profile.video_uploaded ? (
                        <CheckCircle className="h-5 w-5 text-cb-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {profile.video_uploaded 
                        ? `Optional • ${profile.video_transcribed ? 'Transkribiert' : 'Wird transkribiert...'}`
                        : "Optional"
                      }
                    </p>
                    {profile.video_uploaded ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Play className="h-3 w-3" />
                          Ansehen
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Upload className="h-3 w-3" />
                          Ersetzen
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" className="gap-1">
                        <Upload className="h-3 w-3" />
                        Hochladen
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* SCI Assessment */}
                <div className="p-4 border rounded-lg bg-gradient-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-cb-accent" />
                      <span className="font-medium">SCI Assessment</span>
                      <Badge variant="outline" className="text-xs">Gold</Badge>
                    </div>
                    <Badge className="bg-cb-accent text-white">92</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Ihre Verkaufspersönlichkeit wurde analysiert
                  </p>
                  <Button variant="outline" size="sm">
                    Bericht ansehen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle>Profil-Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">CV hochgeladen</span>
                  {profile.cv_uploaded ? (
                    <CheckCircle className="h-4 w-4 text-cb-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Video vorgestellt</span>
                  {profile.video_uploaded ? (
                    <CheckCircle className="h-4 w-4 text-cb-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sprachen hinzugefügt</span>
                  {profile.languages.length > 0 ? (
                    <CheckCircle className="h-4 w-4 text-cb-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Berufserfahrung</span>
                  {profile.experience.length > 0 ? (
                    <CheckCircle className="h-4 w-4 text-cb-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verfügbarkeit</span>
                  {profile.availability_slots.length > 0 ? (
                    <CheckCircle className="h-4 w-4 text-cb-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* External Links */}
            <Card>
              <CardHeader>
                <CardTitle>Externe Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.linkedin_url && (
                  <div>
                    <Label className="text-xs text-muted-foreground">LinkedIn</Label>
                    <a 
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cb-primary hover:underline block truncate"
                    >
                      {profile.linkedin_url}
                    </a>
                  </div>
                )}
                
                {profile.xing_url && (
                  <div>
                    <Label className="text-xs text-muted-foreground">XING</Label>
                    <a 
                      href={profile.xing_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cb-primary hover:underline block truncate"
                    >
                      {profile.xing_url}
                    </a>
                  </div>
                )}
                
                {profile.website_url && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Website</Label>
                    <a 
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cb-primary hover:underline block truncate"
                    >
                      {profile.website_url}
                    </a>
                  </div>
                )}
                
                {!profile.linkedin_url && !profile.xing_url && !profile.website_url && (
                  <p className="text-sm text-muted-foreground">
                    Keine externen Profile hinzugefügt
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Profil bearbeiten</DialogTitle>
            <DialogDescription>
              Aktualisieren Sie Ihre Profildaten
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto flex-1">
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basics">Basis</TabsTrigger>
                <TabsTrigger value="role">Rolle</TabsTrigger>
                <TabsTrigger value="availability">Verfügbarkeit</TabsTrigger>
                <TabsTrigger value="experience">Erfahrung</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basics" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Ort</Label>
                    <Input
                      id="location"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="personality">Persönlichkeit & Arbeitsweise</Label>
                  <Textarea
                    id="personality"
                    value={editForm.personality_text}
                    onChange={(e) => setEditForm(prev => ({ ...prev, personality_text: e.target.value }))}
                    className="min-h-32"
                    placeholder="Beschreiben Sie Ihre Arbeitsweise und Persönlichkeit..."
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {editForm.personality_text.length}/1200 Zeichen
                  </div>
                </div>
              </TabsContent>
              
               <TabsContent value="role" className="space-y-4 mt-4">
                <div>
                  <Label>Aktuelle Rollen</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(roleLabels).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${key}`}
                          checked={editForm.roles.includes(key)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEditForm(prev => ({
                                ...prev,
                                roles: [...prev.roles, key]
                              }));
                            } else {
                              setEditForm(prev => ({
                                ...prev,
                                roles: prev.roles.filter(r => r !== key)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`role-${key}`} className="text-sm">{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Branchen</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                    {Object.entries(industryLabels).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`industry-${key}`}
                          checked={editForm.industries.includes(key)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEditForm(prev => ({
                                ...prev,
                                industries: [...prev.industries, key]
                              }));
                            } else {
                              setEditForm(prev => ({
                                ...prev,
                                industries: prev.industries.filter(i => i !== key)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`industry-${key}`} className="text-sm">{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="experience-band">Erfahrung</Label>
                  <Select
                    value={editForm.experience_band}
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, experience_band: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(experienceBandLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="availability" className="space-y-4 mt-4">
                <div>
                  <Label>Beschäftigungsart</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(employmentLabels).slice(0, 2).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`employment-${key}`}
                          checked={editForm.employment_type.includes(key)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEditForm(prev => ({
                                ...prev,
                                employment_type: [...prev.employment_type, key]
                              }));
                            } else {
                              setEditForm(prev => ({
                                ...prev,
                                employment_type: prev.employment_type.filter(t => t !== key)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`employment-${key}`} className="text-sm">{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="hours">Wochenstunden</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="1"
                    max="60"
                    value={editForm.weekly_hours}
                    onChange={(e) => setEditForm(prev => ({ ...prev, weekly_hours: Number(e.target.value) }))}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="experience" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <Label>Berufserfahrung</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExperience}
                    className="gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Hinzufügen
                  </Button>
                </div>
                
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {editForm.experience.map((exp) => (
                    <div key={exp.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Position</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(exp.id)}
                          className="h-6 w-6 p-0 text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Unternehmen"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        />
                        <Input
                          placeholder="Position"
                          value={exp.role_title}
                          onChange={(e) => updateExperience(exp.id, 'role_title', e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="month"
                          placeholder="Start"
                          value={exp.start_date}
                          onChange={(e) => updateExperience(exp.id, 'start_date', e.target.value)}
                        />
                        <Input
                          type="month"
                          placeholder="Ende (optional)"
                          value={exp.end_date}
                          onChange={(e) => updateExperience(exp.id, 'end_date', e.target.value)}
                        />
                      </div>
                      
                      <Textarea
                        placeholder="Erfolge und Verantwortlichkeiten..."
                        value={exp.achievements}
                        onChange={(e) => updateExperience(exp.id, 'achievements', e.target.value)}
                        className="min-h-20"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="links" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={editForm.linkedin_url || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="xing">XING URL</Label>
                  <Input
                    id="xing"
                    type="url"
                    placeholder="https://xing.com/profile/..."
                    value={editForm.xing_url || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, xing_url: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://..."
                    value={editForm.website_url || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, website_url: e.target.value }))}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Abbrechen
            </Button>
            <Button onClick={handleSave}>
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
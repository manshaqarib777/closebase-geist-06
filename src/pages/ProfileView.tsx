import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Edit, 
  Play, 
  MapPin, 
  Clock, 
  Euro, 
  Calendar,
  FileText,
  Video,
  Trophy,
  ExternalLink,
  Linkedin,
  Globe,
  Download
} from "lucide-react";

interface Experience {
  id: string;
  company: string;
  role_title: string;
  start_date: string;
  end_date?: string;
  achievements: string[];
}

interface Profile {
  id: string;
  display_name: string;
  location_city: string;
  location_country: string;
  avatar_url?: string;
  kpi_avg_deal_size_eur: number;
  sales_experience_years: number;
  desired_roles: string[];
  employment_type: string;
  weekly_hours: number;
  industries: string[];
  personality_text: string;
  experiences: Experience[];
  cv_file?: {
    name: string;
    size: number;
    url: string;
  };
  video_file?: {
    name: string;
    transcript_status: 'pending' | 'completed';
    url: string;
  };
  sci_badge?: {
    score: number;
    badge: string;
    date: Date;
  };
  linkedin_url?: string;
  website_url?: string;
  profile_completion_pct: number;
}

const mockProfile: Profile = {
  id: "1",
  display_name: "Max Mustermann",
  location_city: "Berlin",
  location_country: "Deutschland",
  avatar_url: "/placeholder.svg",
  kpi_avg_deal_size_eur: 15000,
  sales_experience_years: 5,
  desired_roles: ["Senior Sales Manager", "Key Account Manager", "Sales Consultant"],
  employment_type: "Festanstellung",
  weekly_hours: 40,
  industries: ["SaaS", "Fintech", "E-Commerce", "Marketing Tech"],
  personality_text: "Erfahrener Sales Professional mit einer Leidenschaft für B2B-Software und komplexe Lösungsvertriebe. Spezialisiert auf Enterprise-Kunden und strategische Partnerschaften. Ich bringe nachweislich starke Ergebnisse in der Neukundenakquise und verfüge über umfassende Erfahrung in consultative selling approaches.",
  experiences: [
    {
      id: "1",
      company: "TechFlow GmbH",
      role_title: "Senior Sales Manager",
      start_date: "2022-03",
      end_date: "2024-01",
      achievements: [
        "Umsatzsteigerung um 150% innerhalb von 18 Monaten",
        "Aufbau und Führung eines 4-köpfigen Sales-Teams",
        "Entwicklung der DACH-Markterschließungsstrategie"
      ]
    },
    {
      id: "2", 
      company: "SalesForce Solutions",
      role_title: "Account Executive",
      start_date: "2020-01",
      end_date: "2022-02",
      achievements: [
        "Konstant über 120% Zielerreichung",
        "Strategische Betreuung von 15 Enterprise-Accounts",
        "Mentor für Junior Sales Representatives"
      ]
    }
  ],
  cv_file: {
    name: "Lebenslauf_Max_Mustermann.pdf",
    size: 245000,
    url: "/files/cv.pdf"
  },
  video_file: {
    name: "video_introduction.mp4",
    transcript_status: "completed",
    url: "/files/video.mp4"
  },
  sci_badge: {
    score: 78,
    badge: "Gold",
    date: new Date('2024-01-15')
  },
  linkedin_url: "https://linkedin.com/in/maxmustermann",
  website_url: "https://maxmustermann.de",
  profile_completion_pct: 95
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getRoleTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'Senior Sales Manager': 'bg-purple-100 text-purple-700 border-purple-200',
    'Key Account Manager': 'bg-blue-100 text-blue-700 border-blue-200',
    'Sales Consultant': 'bg-green-100 text-green-700 border-green-200',
    'Business Development': 'bg-orange-100 text-orange-700 border-orange-200'
  };
  return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
};

export default function ProfileView() {
  const breadcrumbs = [
    { label: "Übersicht", href: "/" },
    { label: "Profil" }
  ];

  const handleEditProfile = () => {
    window.location.href = '/profile/edit';
  };

  const handleWatchVideo = () => {
    if (mockProfile.video_file) {
      window.open(mockProfile.video_file.url, '_blank');
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-8">
        {/* Profile Completion Banner */}
        {mockProfile.profile_completion_pct < 100 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {mockProfile.profile_completion_pct}%
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900">
                      Profil zu {mockProfile.profile_completion_pct}% vollständig
                    </h3>
                    <p className="text-sm text-blue-700">
                      Vervollständige dein Profil für bessere Job-Matches
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEditProfile}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Profil bearbeiten
                </Button>
              </div>
              <Progress value={mockProfile.profile_completion_pct} className="mt-3 h-2" />
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Header Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={mockProfile.avatar_url} />
                      <AvatarFallback className="text-xl bg-[var(--color-primary)] text-white">
                        {mockProfile.display_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                        {mockProfile.display_name}
                      </h1>
                      <div className="flex items-center gap-2 text-[var(--color-muted)] mb-4">
                        <MapPin className="h-4 w-4" />
                        {mockProfile.location_city}, {mockProfile.location_country}
                      </div>
                      
                      <div className="flex gap-3">
                        <Button onClick={handleEditProfile} className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-700)]">
                          <Edit className="h-4 w-4 mr-2" />
                          Profil bearbeiten
                        </Button>
                        {mockProfile.video_file && (
                          <Button variant="outline" onClick={handleWatchVideo}>
                            <Play className="h-4 w-4 mr-2" />
                            Video ansehen
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:text-right">
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-[var(--color-text)]">
                          €{mockProfile.kpi_avg_deal_size_eur.toLocaleString()}
                        </div>
                        <div className="text-xs text-[var(--color-muted)]">Ø Deal-Größe</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[var(--color-text)]">
                          {mockProfile.sales_experience_years}
                        </div>
                        <div className="text-xs text-[var(--color-muted)]">Jahre Erfahrung</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-black/5">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-[var(--color-text)] mb-2">Zielpositionen</h4>
                      <div className="flex flex-wrap gap-2">
                        {mockProfile.desired_roles.map((role, index) => (
                          <Badge key={index} className={getRoleTypeColor(role)}>
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-[var(--color-muted)]">
                        <Calendar className="h-4 w-4" />
                        {mockProfile.employment_type}
                      </div>
                      <div className="flex items-center gap-2 text-[var(--color-muted)]">
                        <Clock className="h-4 w-4" />
                        {mockProfile.weekly_hours} Std/Woche
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* About Card */}
          <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Über mich</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-[var(--color-text)] mb-2">Branchen</h4>
                <div className="flex flex-wrap gap-1">
                  {mockProfile.industries.map((industry, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-[var(--color-text)] mb-2">Persönlichkeit</h4>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  {mockProfile.personality_text.substring(0, 200)}...
                  <Button variant="ghost" size="sm" className="h-auto p-0 ml-1 text-[var(--color-primary)]">
                    Mehr anzeigen
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Experience Timeline */}
          <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Berufserfahrung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockProfile.experiences.map((exp, index) => (
                <div key={exp.id} className="relative">
                  {index < mockProfile.experiences.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-px bg-black/10" />
                  )}
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--color-text)]">
                        {exp.role_title}
                      </h4>
                      <p className="text-sm text-[var(--color-muted)] mb-2">
                        {exp.company} • {exp.start_date} - {exp.end_date || 'Heute'}
                      </p>
                      
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="text-sm text-[var(--color-muted)] flex items-start gap-2">
                            <span className="w-1 h-1 bg-[var(--color-muted)] rounded-full mt-2 shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Documents & Links */}
          <div className="space-y-6">
            {/* Documents */}
            <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Dokumente & Nachweise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* CV */}
                {mockProfile.cv_file && (
                  <div className="flex items-center justify-between p-3 bg-[var(--color-surface)] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text)] text-sm">
                          Lebenslauf
                        </p>
                        <p className="text-xs text-[var(--color-muted)]">
                          {formatFileSize(mockProfile.cv_file.size)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Video */}
                {mockProfile.video_file && (
                  <div className="flex items-center justify-between p-3 bg-[var(--color-surface)] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Video className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text)] text-sm">
                          Video-Vorstellung
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-[var(--color-muted)]">
                            {mockProfile.video_file.transcript_status === 'completed' ? 'Transkript erstellt' : 'Transkript ausstehend...'}
                          </p>
                          {mockProfile.video_file.transcript_status === 'completed' && (
                            <span className="text-emerald-500 text-xs">✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleWatchVideo}>
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* SCI Badge */}
                {mockProfile.sci_badge && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-yellow-900 text-sm">
                          SCI-Badge {mockProfile.sci_badge.badge}
                        </p>
                        <p className="text-xs text-yellow-700">
                          Score: {mockProfile.sci_badge.score}/100
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-yellow-700 hover:text-yellow-900">
                      Bericht ansehen
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Links */}
            <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockProfile.linkedin_url && (
                  <a 
                    href={mockProfile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-lg hover:bg-black/5 transition-colors"
                  >
                    <Linkedin className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-[var(--color-text)]">LinkedIn Profil</span>
                    <ExternalLink className="h-4 w-4 text-[var(--color-muted)] ml-auto" />
                  </a>
                )}
                
                {mockProfile.website_url && (
                  <a 
                    href={mockProfile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-lg hover:bg-black/5 transition-colors"
                  >
                    <Globe className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-[var(--color-text)]">Website</span>
                    <ExternalLink className="h-4 w-4 text-[var(--color-muted)] ml-auto" />
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
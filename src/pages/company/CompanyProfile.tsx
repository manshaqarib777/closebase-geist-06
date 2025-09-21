import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Building, MapPin, Globe, Users, Star, Upload, Save, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CompanyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "Closebase GmbH",
    description: "Wir sind ein innovatives Sales-Tech Unternehmen, das Unternehmen dabei hilft, ihre Vertriebsprozesse zu optimieren und bessere Ergebnisse zu erzielen.",
    industry: "Software & Technology",
    size: "11-50",
    location: "Berlin, Deutschland",
    website: "https://closebase.com",
    email: "contact@closebase.com",
    phone: "+49 30 12345678",
    foundedYear: "2020",
    benefits: [
      "Remote Work möglich",
      "Flexible Arbeitszeiten",
      "Weiterbildungsbudget",
      "Moderne Arbeitsplätze",
      "Team Events"
    ],
    culture: "Bei Closebase arbeiten wir in einem dynamischen und kollaborativen Umfeld. Wir fördern Innovation und persönliches Wachstum unserer Mitarbeiter.",
    logo: null
  });

  const handleSave = () => {
    toast.success("Unternehmensprofil wurde erfolgreich aktualisiert");
    setIsEditing(false);
    // TODO: Implement API call to save company data
  };

  const handleLogoUpload = () => {
    // TODO: Implement logo upload functionality
    toast.success("Logo Upload wird implementiert");
  };

  return (
    <AppLayout 
      breadcrumbs={[
        { label: "Unternehmensprofil" }
      ]}
    >
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Unternehmensprofil
            </h1>
            <p className="text-muted-foreground">
              Verwalte die Informationen deines Unternehmens
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Speichern
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Bearbeiten
              </Button>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Grundinformationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="w-24 h-24 border-2 border-border">
                  <AvatarImage src={companyData.logo || ""} />
                  <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                    {companyData.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm" onClick={handleLogoUpload}>
                    <Upload className="w-3 h-3 mr-2" />
                    Logo ändern
                  </Button>
                )}
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Unternehmensname</Label>
                  {isEditing ? (
                    <Input 
                      value={companyData.name}
                      onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                    />
                  ) : (
                    <p className="text-foreground font-medium">{companyData.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Branche</Label>
                  {isEditing ? (
                    <Select value={companyData.industry} onValueChange={(value) => setCompanyData({...companyData, industry: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Software & Technology">Software & Technology</SelectItem>
                        <SelectItem value="E-Commerce">E-Commerce</SelectItem>
                        <SelectItem value="Fintech">Fintech</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-foreground">{companyData.industry}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Unternehmensgröße</Label>
                  {isEditing ? (
                    <Select value={companyData.size} onValueChange={(value) => setCompanyData({...companyData, size: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 Mitarbeiter</SelectItem>
                        <SelectItem value="11-50">11-50 Mitarbeiter</SelectItem>
                        <SelectItem value="51-200">51-200 Mitarbeiter</SelectItem>
                        <SelectItem value="201-500">201-500 Mitarbeiter</SelectItem>
                        <SelectItem value="500+">500+ Mitarbeiter</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-foreground">{companyData.size} Mitarbeiter</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Gründungsjahr</Label>
                  {isEditing ? (
                    <Input 
                      value={companyData.foundedYear}
                      onChange={(e) => setCompanyData({...companyData, foundedYear: e.target.value})}
                    />
                  ) : (
                    <p className="text-foreground">{companyData.foundedYear}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Unternehmensbeschreibung</Label>
              {isEditing ? (
                <Textarea 
                  value={companyData.description}
                  onChange={(e) => setCompanyData({...companyData, description: e.target.value})}
                  rows={4}
                  placeholder="Beschreibe dein Unternehmen..."
                />
              ) : (
                <p className="text-foreground leading-relaxed">{companyData.description}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Kontaktinformationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Standort</Label>
                {isEditing ? (
                  <Input 
                    value={companyData.location}
                    onChange={(e) => setCompanyData({...companyData, location: e.target.value})}
                    placeholder="Stadt, Land"
                  />
                ) : (
                  <p className="text-foreground">{companyData.location}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Website</Label>
                {isEditing ? (
                  <Input 
                    value={companyData.website}
                    onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
                    placeholder="https://..."
                  />
                ) : (
                  <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {companyData.website}
                  </a>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>E-Mail</Label>
                {isEditing ? (
                  <Input 
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                    placeholder="contact@company.com"
                  />
                ) : (
                  <p className="text-foreground">{companyData.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Telefon</Label>
                {isEditing ? (
                  <Input 
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                    placeholder="+49 ..."
                  />
                ) : (
                  <p className="text-foreground">{companyData.phone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Culture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Unternehmenskultur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Kultur & Werte</Label>
              {isEditing ? (
                <Textarea 
                  value={companyData.culture}
                  onChange={(e) => setCompanyData({...companyData, culture: e.target.value})}
                  rows={3}
                  placeholder="Beschreibe die Unternehmenskultur..."
                />
              ) : (
                <p className="text-foreground leading-relaxed">{companyData.culture}</p>
              )}
            </div>
            
            <div className="space-y-3">
              <Label>Benefits & Vorteile</Label>
              {isEditing ? (
                <div className="space-y-2">
                  {companyData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={benefit}
                        onChange={(e) => {
                          const newBenefits = [...companyData.benefits];
                          newBenefits[index] = e.target.value;
                          setCompanyData({...companyData, benefits: newBenefits});
                        }}
                        placeholder="Benefit eingeben..."
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const newBenefits = companyData.benefits.filter((_, i) => i !== index);
                          setCompanyData({...companyData, benefits: newBenefits});
                        }}
                      >
                        Entfernen
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCompanyData({...companyData, benefits: [...companyData.benefits, ""]})}
                  >
                    Benefit hinzufügen
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {companyData.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Einstellungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Profil öffentlich anzeigen</Label>
                <p className="text-sm text-muted-foreground">
                  Erlaube Kandidaten dein Unternehmensprofil zu sehen
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Automatische Antworten</Label>
                <p className="text-sm text-muted-foreground">
                  Sende automatische Bestätigungen für neue Bewerbungen
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Newsletter abonniert</Label>
                <p className="text-sm text-muted-foreground">
                  Erhalte Updates über neue Features und Tipps
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
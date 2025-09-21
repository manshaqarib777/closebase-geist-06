import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Plus, X } from "lucide-react";

interface ProfileFieldManagerProps {
  currentDealSize?: number;
  onDealSizeChange: (size: number) => void;
}

export function ProfileFieldManager({ currentDealSize, onDealSizeChange }: ProfileFieldManagerProps) {
  const [dealSize, setDealSize] = useState(currentDealSize?.toString() || "");
  const [isEditing, setIsEditing] = useState(!currentDealSize);

  const dealSizeBands = [
    { value: "500_5000", label: "€500 - €5k", weight: 0.8 },
    { value: "5001_10000", label: "€5k - €10k", weight: 1.0 },
    { value: "10001_25000", label: "€10k - €25k", weight: 1.2 },
    { value: "25001_50000", label: "€25k - €50k", weight: 1.4 },
    { value: "gt_50001", label: ">€50k", weight: 1.6 }
  ];

  const handleSave = () => {
    const size = parseInt(dealSize);
    if (size && size > 0) {
      onDealSizeChange(size);
      setIsEditing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMatchingWeight = (dealSize: number) => {
    if (dealSize <= 5000) return dealSizeBands[0];
    if (dealSize <= 10000) return dealSizeBands[1];
    if (dealSize <= 25000) return dealSizeBands[2];
    if (dealSize <= 50000) return dealSizeBands[3];
    return dealSizeBands[4];
  };

  const currentBand = currentDealSize ? getMatchingWeight(currentDealSize) : null;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Ø Dealgröße</h3>
          </div>
          
          {!isEditing && currentDealSize && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Bearbeiten
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <Label htmlFor="dealSize">Durchschnittliche Dealgröße (€)</Label>
              <Input
                id="dealSize"
                type="number"
                placeholder="z.B. 15000"
                value={dealSize}
                onChange={(e) => setDealSize(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                Speichern
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setDealSize(currentDealSize?.toString() || "");
                }}
              >
                Abbrechen
              </Button>
            </div>
          </div>
        ) : currentDealSize ? (
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(currentDealSize)}
            </div>
            
            {currentBand && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{currentBand.label}</Badge>
                <span className="text-sm text-muted-foreground">
                  Matching-Gewicht: {currentBand.weight}x
                </span>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              Diese Information verbessert die Qualität des Job-Matchings.
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-3">
              Fügen Sie Ihre durchschnittliche Dealgröße hinzu, um bessere Job-Matches zu erhalten.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Dealgröße hinzufügen
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
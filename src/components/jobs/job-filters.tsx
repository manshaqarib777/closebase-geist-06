import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Filter, X } from "lucide-react";

export interface JobFilters {
  roles: string[];
  industries: string[];
  avg_product_cost_band: string[];
  leads_type: string[];
  sales_cycle_band: string[];
  employment_type: string[];
  hours_min?: number;
  hours_max?: number;
  one_time_payment_min?: number;
  only_new: boolean;
  sort: string;
}

interface JobFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  activeFiltersCount: number;
}

const roleOptions = [
  { value: 'setter', label: 'Setter' },
  { value: 'closer', label: 'Closer' },
  { value: 'consultant', label: 'Berater' },
  { value: 'full_cycle', label: 'Full Cycle' }
];

const industryOptions = [
  { value: 'insurance', label: 'Versicherung' },
  { value: 'finance', label: 'Finanz' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'digital_services', label: 'Digital Services' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'photovoltaik', label: 'Photovoltaik' },
  { value: 'consulting', label: 'Beratung' },
  { value: 'energy', label: 'Energie' },
  { value: 'real_estate', label: 'Immobilien' },
  { value: 'other', label: 'Sonstige' }
];

const costBandOptions = [
  { value: '500_5000', label: '€500-5k' },
  { value: '5001_10000', label: '€5k-10k' },
  { value: '10001_25000', label: '€10k-25k' },
  { value: '25001_50000', label: '€25k-50k' },
  { value: 'gt_50001', label: '>€50k' }
];

const leadsOptions = [
  { value: 'warm', label: 'Warm Leads' },
  { value: 'cold', label: 'Cold Leads' }
];

const cycleOptions = [
  { value: 'd_1_7', label: '1-7 Tage' },
  { value: 'w_1_4', label: '1-4 Wochen' },
  { value: 'm_1_2', label: '1-2 Monate' },
  { value: 'm_2_6', label: '2-6 Monate' },
  { value: 'm_6_12', label: '6-12 Monate' }
];

const employmentOptions = [
  { value: 'freelance', label: 'Freelance' },
  { value: 'employee', label: 'Angestellt' }
];

const sortOptions = [
  { value: 'top', label: 'Empfohlen' },
  { value: 'newest', label: 'Neueste' },
  { value: 'commission_pct', label: 'Provision %' },
  { value: 'commission_eur', label: 'Provision €' },
  { value: 'fit', label: 'Fit Score' }
];

export function JobFilters({ filters, onFiltersChange, activeFiltersCount }: JobFiltersProps) {
  const [localFilters, setLocalFilters] = useState<JobFilters>(filters);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleMultiSelectChange = (key: keyof JobFilters, value: string, checked: boolean) => {
    setLocalFilters(prev => {
      const currentArray = prev[key] as string[];
      if (checked) {
        return { ...prev, [key]: [...currentArray, value] };
      } else {
        return { ...prev, [key]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const emptyFilters: JobFilters = {
      roles: [],
      industries: [],
      avg_product_cost_band: [],
      leads_type: [],
      sales_cycle_band: [],
      employment_type: [],
      only_new: false,
      sort: 'top'
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    setIsOpen(false);
  };

  const getActiveFilterLabels = () => {
    const labels: string[] = [];
    
    localFilters.roles.forEach(role => {
      const option = roleOptions.find(o => o.value === role);
      if (option) labels.push(option.label);
    });
    
    localFilters.industries.forEach(industry => {
      const option = industryOptions.find(o => o.value === industry);
      if (option) labels.push(option.label);
    });
    
    if (localFilters.only_new) labels.push('Nur neue');
    
    return labels;
  };

  return (
    <>
      {/* Active filter chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {getActiveFilterLabels().map((label, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {label}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  // Handle individual filter removal
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-6 px-2 text-xs"
          >
            Alle zurücksetzen
          </Button>
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            {/* Sort */}
            <div className="space-y-2">
              <Label>Sortierung</Label>
              <Select
                value={localFilters.sort}
                onValueChange={(value) => handleFilterChange('sort', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Roles */}
            <div className="space-y-3">
              <Label>Rollen</Label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${option.value}`}
                      checked={localFilters.roles.includes(option.value)}
                      onCheckedChange={(checked) =>
                        handleMultiSelectChange('roles', option.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={`role-${option.value}`} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Industries */}
            <div className="space-y-3">
              <Label>Branchen</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {industryOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`industry-${option.value}`}
                      checked={localFilters.industries.includes(option.value)}
                      onCheckedChange={(checked) =>
                        handleMultiSelectChange('industries', option.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={`industry-${option.value}`} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Hours */}
            <div className="space-y-3">
              <Label>Stunden pro Woche</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours-min" className="text-xs text-muted-foreground">Min.</Label>
                  <Input
                    id="hours-min"
                    type="number"
                    min="0"
                    max="60"
                    value={localFilters.hours_min || ''}
                    onChange={(e) => handleFilterChange('hours_min', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
                <div>
                  <Label htmlFor="hours-max" className="text-xs text-muted-foreground">Max.</Label>
                  <Input
                    id="hours-max"
                    type="number"
                    min="0"
                    max="60"
                    value={localFilters.hours_max || ''}
                    onChange={(e) => handleFilterChange('hours_max', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Only new */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="only-new"
                checked={localFilters.only_new}
                onCheckedChange={(checked) => handleFilterChange('only_new', checked)}
              />
              <Label htmlFor="only-new">Nur neue Jobs (letzte 14 Tage)</Label>
            </div>
          </div>

          <SheetFooter className="flex gap-2">
            <Button variant="outline" onClick={resetFilters}>
              Zurücksetzen
            </Button>
            <Button onClick={applyFilters}>
              Anwenden
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
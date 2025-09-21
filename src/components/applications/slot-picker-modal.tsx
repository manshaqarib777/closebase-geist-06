import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface SlotPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  onSubmit: (applicationId: string, slots: string[]) => void;
}

interface TimeSlot {
  date: string;
  time: string;
  display: string;
}

export function SlotPickerModal({ isOpen, onClose, applicationId, onSubmit }: SlotPickerModalProps) {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  // Generate 3 day suggestions with 3 time slots each
  const generateSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const today = new Date();
    const times = ["10:00", "14:00", "16:00"];
    
    for (let dayOffset = 1; dayOffset <= 3; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      
      const dayName = date.toLocaleDateString('de-DE', { weekday: 'long' });
      const dateStr = date.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      
      times.forEach(time => {
        const slotId = `${date.toISOString().split('T')[0]}_${time}`;
        slots.push({
          date: slotId,
          time,
          display: `${dayName}, ${dateStr} um ${time} Uhr`
        });
      });
    }
    
    return slots;
  };

  const slots = generateSlots();

  const toggleSlot = (slotId: string) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      } else if (prev.length < 3) {
        return [...prev, slotId];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (selectedSlots.length > 0) {
      onSubmit(applicationId, selectedSlots);
      setSelectedSlots([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="tw-max-w-md">
        <DialogHeader>
          <DialogTitle className="tw-flex tw-items-center tw-gap-2">
            <Calendar className="tw-h-5 tw-w-5 tw-text-primary" />
            Interview vorschlagen
          </DialogTitle>
        </DialogHeader>
        
        <div className="tw-space-y-4">
          <p className="tw-text-sm tw-text-muted-foreground">
            Wählen Sie bis zu 3 Zeitslots für das Interview aus:
          </p>
          
          <div className="tw-space-y-2">
            {slots.map((slot) => (
              <button
                key={slot.date}
                onClick={() => toggleSlot(slot.date)}
                className={`tw-w-full tw-text-left tw-p-3 tw-rounded-lg tw-border tw-transition-all ${
                  selectedSlots.includes(slot.date)
                    ? 'tw-border-primary tw-bg-primary/5 tw-text-primary'
                    : 'tw-border-black/10 tw-bg-white hover:tw-border-black/20'
                }`}
              >
                <div className="tw-flex tw-items-center tw-justify-between">
                  <span className="tw-text-sm tw-font-medium">{slot.display}</span>
                  {selectedSlots.includes(slot.date) && (
                    <Badge variant="default" className="tw-text-xs tw-bg-primary">
                      {selectedSlots.indexOf(slot.date) + 1}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          <div className="tw-flex tw-items-center tw-gap-2 tw-text-xs tw-text-muted-foreground">
            <Clock className="tw-h-3 tw-w-3" />
            Alle Zeiten in Ihrer lokalen Zeitzone
          </div>
          
          <div className="tw-flex tw-gap-2 tw-pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="tw-flex-1"
            >
              Abbrechen
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={selectedSlots.length === 0}
              className="tw-flex-1"
            >
              Vorschlag senden ({selectedSlots.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
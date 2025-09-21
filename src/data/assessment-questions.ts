export interface MCQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    points: number;
  }[];
}

export interface Scenario {
  id: string;
  title: string;
  prompt: string;
  keyWords: string[];
  minWords: number;
  maxWords: number;
}

export const MC_QUESTIONS: MCQuestion[] = [
  {
    id: "q1",
    question: "Entscheider gereizt: 'Nur 10 Sekunden!' Einstieg?",
    options: [
      { id: "a", text: "Später Gespräch?", points: 1 },
      { id: "b", text: "Infos per Mail?", points: 2 },
      { id: "c", text: "Verstehe, wie unterstützen?", points: 5 },
      { id: "d", text: "Schnell helfen?", points: 4 },
      { id: "e", text: "Was ist Ihr Ziel?", points: 3 }
    ]
  },
  {
    id: "q2", 
    question: "Kunde: 'Bestens versorgt.' Antwort?",
    options: [
      { id: "a", text: "Optimieren?", points: 3 },
      { id: "b", text: "Lösung zeigen?", points: 2 },
      { id: "c", text: "Was macht Anbieter stark?", points: 5 },
      { id: "d", text: "Besser laufen?", points: 4 },
      { id: "e", text: "Prozesse verbessern?", points: 2 }
    ]
  },
  {
    id: "q3",
    question: "Kunde: 'Kollege blockiert.' Reaktion?",
    options: [
      { id: "a", text: "Ohne ihn starten?", points: 2 },
      { id: "b", text: "Bedenken Kollegen?", points: 5 },
      { id: "c", text: "Testlauf?", points: 2 },
      { id: "d", text: "Ihn einbinden?", points: 4 },
      { id: "e", text: "Kollegen überzeugen?", points: 3 }
    ]
  },
  {
    id: "q4",
    question: "15 Absagen, Zweifel. Ansatz?",
    options: [
      { id: "a", text: "Pausieren.", points: 1 },
      { id: "b", text: "Weiter.", points: 2 },
      { id: "c", text: "Skript neu.", points: 2 },
      { id: "d", text: "Feedback und anpassen.", points: 5 },
      { id: "e", text: "Analysieren, ändern.", points: 4 }
    ]
  },
  {
    id: "q5",
    question: "Kunde duzt: 'Hey, was geht ab?' Antwort?",
    options: [
      { id: "a", text: "Vorschlagen.", points: 2 },
      { id: "b", text: "Lösungen reden.", points: 3 },
      { id: "c", text: "Lösung.", points: 2 },
      { id: "d", text: "Hey, ich helf dir!", points: 5 },
      { id: "e", text: "Idee passt.", points: 4 }
    ]
  },
  {
    id: "q6",
    question: "Kunde: 'Werbeanrufe mag ich nicht.' Reaktion?",
    options: [
      { id: "a", text: "Mehr erfahren?", points: 3 },
      { id: "b", text: "Anders helfen?", points: 4 },
      { id: "c", text: "Typischer Anrufer?", points: 2 },
      { id: "d", text: "Was stört?", points: 5 },
      { id: "e", text: "Überzeugen?", points: 2 }
    ]
  },
  {
    id: "q7",
    question: "Kunde leise, zögerlich. Ansatz?",
    options: [
      { id: "a", text: "Prioritäten.", points: 2 },
      { id: "b", text: "Lösungen bieten.", points: 3 },
      { id: "c", text: "Ziele fragen.", points: 5 },
      { id: "d", text: "Offene Fragen.", points: 4 },
      { id: "e", text: "Vorteile nennen.", points: 2 }
    ]
  },
  {
    id: "q8",
    question: "Kunde: 'Werbeanrufe mag ich nicht.' Antwort?",
    options: [
      { id: "a", text: "Offen sein?", points: 2 },
      { id: "b", text: "Stattdessen nützen?", points: 4 },
      { id: "c", text: "Was gestört?", points: 5 },
      { id: "d", text: "Etwas zeigen?", points: 3 },
      { id: "e", text: "Ich bin anders.", points: 2 }
    ]
  },
  {
    id: "q9",
    question: "Kunde murmelt abgelenkt. Ansatz?",
    options: [
      { id: "a", text: "Später sprechen.", points: 3 },
      { id: "b", text: "Ziele fragen.", points: 4 },
      { id: "c", text: "Klar sprechen.", points: 2 },
      { id: "d", text: "Fokus fragen.", points: 5 },
      { id: "e", text: "Vorteile nennen.", points: 2 }
    ]
  },
  {
    id: "q10",
    question: "Kunde: 'Vorsichtig mit neuen Anbietern.' Antwort?",
    options: [
      { id: "a", text: "Vertrauen gewinnen?", points: 4 },
      { id: "b", text: "Was vorsichtig?", points: 5 },
      { id: "c", text: "Überzeugen?", points: 2 },
      { id: "d", text: "Erfolge nennen?", points: 3 },
      { id: "e", text: "Stärken zeigen.", points: 2 }
    ]
  },
  // Additional questions 11-60 would be added here for the full pool
  {
    id: "q11",
    question: "Kunde: 'Zu teuer für uns.' Erste Reaktion?",
    options: [
      { id: "a", text: "Rabatt anbieten?", points: 1 },
      { id: "b", text: "Was kostet Nichtstun?", points: 4 },
      { id: "c", text: "Teuer im Vergleich zu was?", points: 5 },
      { id: "d", text: "ROI erklären?", points: 3 },
      { id: "e", text: "Günstigere Option?", points: 2 }
    ]
  },
  {
    id: "q12",
    question: "Gatekeeperin: 'Chef nicht da.' Was tun?",
    options: [
      { id: "a", text: "Wann zurück?", points: 2 },
      { id: "b", text: "Nachricht hinterlassen?", points: 1 },
      { id: "c", text: "Sie entscheiden mit?", points: 5 },
      { id: "d", text: "Ihre Meinung?", points: 4 },
      { id: "e", text: "Termin vereinbaren?", points: 3 }
    ]
  },
  {
    id: "q13",
    question: "Kunde unterbricht ständig. Verhalten?",
    options: [
      { id: "a", text: "Höflich weitersprechen.", points: 2 },
      { id: "b", text: "Pause machen.", points: 3 },
      { id: "c", text: "Thema wechseln.", points: 1 },
      { id: "d", text: "Verstehe, und...?", points: 5 },
      { id: "e", text: "Fragen stellen.", points: 4 }
    ]
  },
  {
    id: "q14",
    question: "Kunde: 'Brauche Bedenkzeit.' Antwort?",
    options: [
      { id: "a", text: "Kein Problem.", points: 1 },
      { id: "b", text: "Wie lange?", points: 3 },
      { id: "c", text: "Was spricht dagegen?", points: 5 },
      { id: "d", text: "Welche Punkte unklar?", points: 4 },
      { id: "e", text: "Termin für Entscheidung?", points: 2 }
    ]
  },
  {
    id: "q15",
    question: "Kunde schweigt nach Angebot. Reaktion?",
    options: [
      { id: "a", text: "Nachfragen.", points: 3 },
      { id: "b", text: "Schweigen aushalten.", points: 5 },
      { id: "c", text: "Vorteile wiederholen.", points: 2 },
      { id: "d", text: "Alternativen anbieten.", points: 1 },
      { id: "e", text: "Bedenken erfragen.", points: 4 }
    ]
  },
  {
    id: "q16",
    question: "Kunde: 'Muss Team fragen.' Was jetzt?",
    options: [
      { id: "a", text: "Wann Antwort?", points: 2 },
      { id: "b", text: "Wer entscheidet wirklich?", points: 5 },
      { id: "c", text: "Gemeinsam vorstellen?", points: 4 },
      { id: "d", text: "Unterlagen mitgeben?", points: 3 },
      { id: "e", text: "OK, warten.", points: 1 }
    ]
  },
  {
    id: "q17",
    question: "Konkurrent wird erwähnt. Verhalten?",
    options: [
      { id: "a", text: "Vorteile betonen.", points: 3 },
      { id: "b", text: "Was gefällt dort?", points: 5 },
      { id: "c", text: "Nachteile aufzeigen.", points: 1 },
      { id: "d", text: "Unsere Stärken.", points: 2 },
      { id: "e", text: "Direkter Vergleich.", points: 4 }
    ]
  },
  {
    id: "q18",
    question: "Kunde wirkt gestresst. Ansatz?",
    options: [
      { id: "a", text: "Schnell zum Punkt.", points: 4 },
      { id: "b", text: "Besser später?", points: 2 },
      { id: "c", text: "Was belastet Sie?", points: 5 },
      { id: "d", text: "Kurz halten.", points: 3 },
      { id: "e", text: "Ignorieren.", points: 1 }
    ]
  },
  {
    id: "q19",
    question: "Termin wird verschoben. Reaktion?",
    options: [
      { id: "a", text: "Verständnis zeigen.", points: 3 },
      { id: "b", text: "Warum verschoben?", points: 5 },
      { id: "c", text: "Neuen Termin sofort.", points: 4 },
      { id: "d", text: "Ist es noch wichtig?", points: 2 },
      { id: "e", text: "OK, melden Sie sich.", points: 1 }
    ]
  },
  {
    id: "q20",
    question: "Kunde: 'Läuft schon gut.' Einwand behandeln?",
    options: [
      { id: "a", text: "Was läuft gut?", points: 5 },
      { id: "b", text: "Noch besser geht?", points: 4 },
      { id: "c", text: "Verbesserungen zeigen.", points: 3 },
      { id: "d", text: "Zufrieden ist gut.", points: 1 },
      { id: "e", text: "Trotzdem schauen?", points: 2 }
    ]
  }
];

export const SCENARIOS: Scenario[] = [
  {
    id: "scenario1",
    title: "Ablehnender Entscheider",
    prompt: "Entscheider gereizt: 'Ich mag Werbeanrufe nicht, Anbieter top!' Wie überzeugen Sie in 2 Min. für ein Gespräch?",
    keyWords: ["Bedarf", "Nutzen", "Termin", "Verständnis"],
    minWords: 100,
    maxWords: 150
  },
  {
    id: "scenario2", 
    title: "Skeptischer Einkäufer",
    prompt: "Einkäufer: 'Haben schon 3 Anbieter, brauchen keinen vierten.' Wie schaffen Sie es trotzdem zu einem Gespräch?",
    keyWords: ["Differenzierung", "Mehrwert", "Konkurrenz", "Chance"],
    minWords: 100,
    maxWords: 150
  },
  {
    id: "scenario3",
    title: "Zeitdruck-Situation", 
    prompt: "Geschäftsführer: 'Nur 2 Minuten Zeit, dann Meeting.' Wie präsentieren Sie Ihren Wert und sichern einen Folgetermin?",
    keyWords: ["Prägnanz", "Wert", "Folgetermin", "Relevanz"],
    minWords: 100,
    maxWords: 150
  },
  {
    id: "scenario4",
    title: "Budget-Einwand",
    prompt: "Kunde: 'Klingt interessant, aber Budget ist dieses Jahr ausgeschöpft.' Wie reagieren Sie strategisch?",
    keyWords: ["Budget", "ROI", "Investition", "Planung"],
    minWords: 100,
    maxWords: 150
  },
  {
    id: "scenario5",
    title: "Entscheidungsträger finden",
    prompt: "Mitarbeiter: 'Müsste Chef fragen, der ist bis nächste Woche weg.' Wie kommen Sie trotzdem voran?",
    keyWords: ["Entscheider", "Information", "Vorbereitung", "Prozess"],
    minWords: 100,
    maxWords: 150
  },
  {
    id: "scenario6",
    title: "Konkurrenz-Vergleich",
    prompt: "Kunde: 'Unser jetziger Anbieter ist günstig und zuverlässig.' Wie positionieren Sie sich ohne Preiskampf?",
    keyWords: ["Wert", "Unterschied", "Qualität", "Nutzen"],
    minWords: 100,
    maxWords: 150
  }
];
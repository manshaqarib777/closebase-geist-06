import { StatCard } from "@/components/ui/stat-card";

const kpis = [
  {
    title: "Bewerbungen gesamt",
    value: 23,
    subtitle: "Diese Woche",
    trend: { value: 12, isPositive: true }
  },
  {
    title: "Interviews geplant", 
    value: 4,
    subtitle: "Nächste 7 Tage",
    trend: { value: 25, isPositive: true }
  },
  {
    title: "Antwortrate",
    value: "68%",
    subtitle: "Letzte 14 Tage",
    trend: { value: 8, isPositive: true }
  },
  {
    title: "Letzte Aktivität",
    value: "vor 2 Std.",
    subtitle: "Nachricht erhalten"
  }
];

export function KpiSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <StatCard
          key={index}
          title={kpi.title}
          value={kpi.value}
          subtitle={kpi.subtitle}
          trend={kpi.trend}
        />
      ))}
    </div>
  );
}
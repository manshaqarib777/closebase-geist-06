interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: number | null;
}

function KpiCard({ label, value = "—", delta = null }: KpiCardProps) {
  return (
    <div className="tw-kpi">
      <div>
        <div className="text-foreground/60 text-sm font-ui">{label}</div>
        <div className="text-[22px] font-heading font-semibold text-foreground">{value}</div>
      </div>
      {delta && (
        <span className={delta > 0 ? "tw-chip-good" : "tw-chip-warn"}>
          {delta > 0 ? "+" : ""}{delta}%
        </span>
      )}
    </div>
  );
}

export function DashboardKpis() {
  const kpis = [
    {
      label: "Bewerbungen gesamt",
      value: "1.234",
      delta: 12
    },
    {
      label: "Interviews (7 Tage)",
      value: 4,
      delta: -8
    },
    {
      label: "Antwortquote (14 Tage)",
      value: "68%",
      delta: 5
    },
    {
      label: "Letzte Aktivität",
      value: "vor 2 Std.",
      delta: null
    }
  ];

  return (
    <section className="grid md:grid-cols-4 gap-3">
      {kpis.map((kpi, index) => (
        <KpiCard
          key={index}
          label={kpi.label}
          value={kpi.value}
          delta={kpi.delta}
        />
      ))}
    </section>
  );
}
import { AppLayout } from "@/components/layout/app-layout";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardKpis } from "@/components/dashboard/dashboard-kpis";
import { DashboardMain } from "@/components/dashboard/dashboard-main";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const Index = () => {
  return (
    <AppLayout breadcrumbs={[{ label: "Sales Dashboard" }]}>
      <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-5">
        <DashboardHero 
          firstName="Max" 
          profileCompletion={85}
          unreadMessages={3}
          assessmentAttemptsLeft={2}
          assessmentScore={null}
        />
        
        <DashboardKpis />
        
        <section className="grid lg:grid-cols-12 gap-5">
          <DashboardMain />
          <DashboardSidebar 
            assessmentScore={78}
            assessmentLevel="Gold"
            assessmentAttemptsLeft={2}
          />
        </section>
      </div>
    </AppLayout>
  );
};

export default Index;

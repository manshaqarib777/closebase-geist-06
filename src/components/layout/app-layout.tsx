import { Topbar } from "./topbar";
import { Sidebar } from "./sidebar";
import { Breadcrumbs } from "./breadcrumbs";

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function AppLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background font-ui">
      <Topbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 max-w-7xl mx-auto">
          <div className="p-6">
            {breadcrumbs.length > 0 && (
              <div className="mb-6">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
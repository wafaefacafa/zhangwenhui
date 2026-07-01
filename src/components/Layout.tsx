import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import PlayerBar from "@/components/PlayerBar";

export const Layout = () => {
  const location = useLocation();
  const isFullscreenPage = location.pathname === "/splash" || location.pathname === "/login" || location.pathname === "/lyrics";

  if (isFullscreenPage) {
    return (
      <div className="h-screen w-full bg-background overflow-hidden">
        <Outlet />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 w-full overflow-y-auto">
            <Outlet />
          </main>
          <PlayerBar />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

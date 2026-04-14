import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/layout/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />
        {children}
      </TooltipProvider>
    </SidebarProvider>
  )
}

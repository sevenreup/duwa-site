import { DocsSidebarNav } from "@/components/sidebar-nav";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { docsConfig } from "@/config/docs";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <SidebarProvider>
      <DocsSidebarNav config={docsConfig} />
      <SidebarInset>
        <SiteHeader hasSideNav />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

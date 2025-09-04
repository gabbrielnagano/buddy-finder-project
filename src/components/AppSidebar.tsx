import { Search, Settings, HelpCircle, Home } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import buddyfinderLogo from "@/assets/buddyfinder-logo.png";

export function AppSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar className={state === "collapsed" ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img 
            src={buddyfinderLogo} 
            alt="BuddyFinder" 
            className="w-10 h-10 rounded-full object-cover"
          />
          {state !== "collapsed" && (
            <div>
              <h1 className="text-xl font-bold text-primary">BuddyFinder</h1>
              <p className="text-sm text-muted-foreground">Adoção de Pets</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg">
                  <NavLink to="/" className="flex items-center gap-3 hover:bg-accent/50 transition-colors">
                    <Home className="h-5 w-5 text-primary" />
                    {state !== "collapsed" && <span className="font-medium">Início</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg">
                  <NavLink to="/buscar" className="flex items-center gap-3 hover:bg-accent/50 transition-colors">
                    <Search className="h-5 w-5 text-primary" />
                    {state !== "collapsed" && <span className="font-medium">Buscar Pets</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/configuracoes" className="flex items-center gap-3 hover:bg-accent/50 transition-colors">
                <Settings className="h-4 w-4 text-muted-foreground" />
                {state !== "collapsed" && <span className="text-sm">Configurações</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/ajuda" className="flex items-center gap-3 hover:bg-accent/50 transition-colors">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                {state !== "collapsed" && <span className="text-sm">Ajuda</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
import * as React from "react"
import { Outlet, NavLink, useLocation } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  FolderTree,
  BookOpen,
  CheckSquare,
  CalendarClock,
  BarChart3,
  UploadCloud,
  ShieldCheck,
  Palette,
  Scale,
  Sun,
  Moon,
  Building2,
  ChevronDown,
  Check,
  LogOut
} from "lucide-react"

export function AppShell() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  const location = useLocation()

  // Mock Active Entity & User State
  const [activeEntity, setActiveEntity] = React.useState("PT Maju Jaya Sejahtera")
  const [currentUser, setCurrentUser] = React.useState({
    name: "Dina Putri",
    role: "Accountant (Maker)",
    email: "dina@kredo.dev",
    initials: "DP",
  })

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        {/* Accounting Sidebar */}
        <Sidebar collapsible="icon" className="border-r border-border/40 bg-sidebar">
          {/* Sidebar Header: Brand Logo */}
          <SidebarHeader className="border-b border-border/30 p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                <Scale className="size-4" />
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sm tracking-tight text-foreground">
                  Kredo Accounting
                </span>
                <span className="text-[11px] text-muted-foreground">
                  General Ledger Core
                </span>
              </div>
            </div>
          </SidebarHeader>

          {/* Navigation Groups */}
          <SidebarContent className="px-2 py-3 space-y-4">
            {/* Group 1: Inti Buku Besar */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2">
                Buku Besar
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                      <NavLink to="/" className="flex items-center gap-2.5">
                        <LayoutDashboard className="size-4" />
                        <span>Dashboard</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/accounts"}>
                      <NavLink to="/accounts" className="flex items-center gap-2.5">
                        <FolderTree className="size-4" />
                        <span>Chart of Accounts</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/journals"}>
                      <NavLink to="/journals" className="flex items-center gap-2.5">
                        <BookOpen className="size-4" />
                        <span>Jurnal Umum</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/approvals"}>
                      <NavLink to="/approvals" className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <CheckSquare className="size-4" />
                          <span>Persetujuan</span>
                        </div>
                        <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 group-data-[collapsible=icon]:hidden">
                          2
                        </Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Group 2: Periode & Pelaporan */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2">
                Periode & Laporan
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/periods"}>
                      <NavLink to="/periods" className="flex items-center gap-2.5">
                        <CalendarClock className="size-4" />
                        <span>Periode & Tutup Buku</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/reports"}>
                      <NavLink to="/reports" className="flex items-center gap-2.5">
                        <BarChart3 className="size-4" />
                        <span>Laporan Keuangan</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/imports"}>
                      <NavLink to="/imports" className="flex items-center gap-2.5">
                        <UploadCloud className="size-4" />
                        <span>Impor Massal (Batch)</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/audit"}>
                      <NavLink to="/audit" className="flex items-center gap-2.5">
                        <ShieldCheck className="size-4" />
                        <span>Jejak Audit</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Group 3: Design System & Dokumentasi */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2">
                Design & Referensi
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/design-system"}>
                      <NavLink to="/design-system" className="flex items-center gap-2.5">
                        <Palette className="size-4" />
                        <span>Design System UI</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Sidebar Footer: User Session Switcher */}
          <SidebarFooter className="border-t border-border/30 p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2.5 px-2 h-12 hover:bg-muted/50">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                      {currentUser.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left overflow-hidden group-data-[collapsible=icon]:hidden">
                    <span className="text-xs font-semibold text-foreground truncate">{currentUser.name}</span>
                    <span className="text-[10px] text-muted-foreground truncate">{currentUser.role}</span>
                  </div>
                  <ChevronDown className="size-3.5 text-muted-foreground ml-auto group-data-[collapsible=icon]:hidden" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 text-xs">
                <DropdownMenuLabel>Simulasikan Peran (RBAC)</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    setCurrentUser({
                      name: "Dina Putri",
                      role: "Accountant (Maker)",
                      email: "dina@kredo.dev",
                      initials: "DP",
                    })
                  }
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Dina Putri</span>
                    <span className="text-[10px] text-muted-foreground">Staf Akuntansi (Maker)</span>
                  </div>
                  {currentUser.name.includes("Dina") && <Check className="size-3.5 text-primary" />}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    setCurrentUser({
                      name: "Raka Pratama",
                      role: "Senior Accountant (Approver)",
                      email: "raka@kredo.dev",
                      initials: "RP",
                    })
                  }
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Raka Pratama</span>
                    <span className="text-[10px] text-muted-foreground">Akuntan Senior (Checker)</span>
                  </div>
                  {currentUser.name.includes("Raka") && <Check className="size-3.5 text-primary" />}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    setCurrentUser({
                      name: "Maya Siregar",
                      role: "Financial Controller",
                      email: "maya@kredo.dev",
                      initials: "MS",
                    })
                  }
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Maya Siregar</span>
                    <span className="text-[10px] text-muted-foreground">Financial Controller</span>
                  </div>
                  {currentUser.name.includes("Maya") && <Check className="size-3.5 text-primary" />}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="size-3.5 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex flex-col flex-1 overflow-x-hidden">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/40 bg-background/90 px-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4" />

              {/* Entity Selector (PRD 6.2 & 14.4) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-2 text-xs font-semibold border-border/60">
                    <Building2 className="size-3.5 text-primary" />
                    <span>{activeEntity}</span>
                    <ChevronDown className="size-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 text-xs">
                  <DropdownMenuLabel>Pilih Entitas Aktif</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => setActiveEntity("PT Maju Jaya Sejahtera")}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-foreground">PT Maju Jaya Sejahtera</div>
                      <div className="text-[10px] text-muted-foreground">Mata Uang: IDR (Rupiah) • Jan–Des</div>
                    </div>
                    {activeEntity.includes("Jaya") && <Check className="size-3.5 text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setActiveEntity("PT Maju Logistik Pratama")}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-foreground">PT Maju Logistik Pratama</div>
                      <div className="text-[10px] text-muted-foreground">Mata Uang: IDR (Rupiah) • Jan–Des</div>
                    </div>
                    {activeEntity.includes("Logistik") && <Check className="size-3.5 text-primary" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Active Accounting Period Chip (PRD 14.8) */}
              <Badge variant="outline" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-normal border-teal-500/30 bg-teal-500/5">
                <CalendarClock className="size-3 text-teal-700 dark:text-teal-400" />
                <span>Nov 2026</span>
                <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400">OPEN</span>
              </Badge>
            </div>

            {/* Right Topbar Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-medium h-8"
                onClick={() => setTheme(isDark ? "light" : "dark")}
              >
                {isDark ? <Sun className="size-3.5 text-amber-500" /> : <Moon className="size-3.5 text-slate-700" />}
                <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
              </Button>
            </div>
          </header>

          {/* Page Outlet */}
          <main className="flex-1 p-6 md:p-8 bg-background">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

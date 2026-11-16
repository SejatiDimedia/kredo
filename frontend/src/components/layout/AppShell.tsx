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
  SidebarRail,
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
  FileSpreadsheet,
  Sun,
  Moon,
  Building2,
  ChevronDown,
  Check,
  LogOut,
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
        <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
          {/* Sidebar Header: Brand Logo */}
          <SidebarHeader className="border-b border-sidebar-border h-14 p-0 flex items-center justify-center">
            <div className="flex items-center gap-2.5 w-full px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-sidebar font-bold shadow-xs">
                <Scale className="size-4.5 text-[#0a5c6e]" />
              </div>
              <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sm tracking-tight text-sidebar-foreground truncate">
                  Kredo Accounting
                </span>
                <span className="text-[10px] text-sidebar-foreground/75 truncate">
                  General Ledger Core
                </span>
              </div>
            </div>
          </SidebarHeader>

          {/* Navigation Groups */}
          <SidebarContent className="px-2 py-3 space-y-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:space-y-2">
            {/* Group 1: Inti Buku Besar */}
            <SidebarGroup className="p-0 group-data-[collapsible=icon]:p-0">
              <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/70 px-2 h-7 group-data-[collapsible=icon]:hidden">
                Buku Besar
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1 group-data-[collapsible=icon]:gap-1.5 group-data-[collapsible=icon]:items-center">
                  <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/"}
                      tooltip="Dashboard Ringkasan"
                      className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <NavLink to="/" className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-full">
                        <LayoutDashboard className="size-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/accounts"}
                      tooltip="Chart of Accounts (COA)"
                      className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <NavLink to="/accounts" className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-full">
                        <FolderTree className="size-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">Chart of Accounts</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/journals" || location.pathname.startsWith("/journals/")}
                      tooltip="Jurnal Umum (Double-Entry)"
                      className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <NavLink to="/journals" className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-full">
                        <BookOpen className="size-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">Jurnal Umum</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith("/reports/general-ledger")}
                      tooltip="Buku Besar (Mutasi Kartu Akun)"
                      className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <NavLink to="/reports/general-ledger" className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-full">
                        <FileSpreadsheet className="size-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">Buku Besar</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/approvals"}
                      tooltip="Antrean Persetujuan Jurnal"
                      className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <NavLink to="/approvals" className="flex items-center justify-between w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-full">
                        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                          <CheckSquare className="size-4 shrink-0" />
                          <span className="group-data-[collapsible=icon]:hidden">Persetujuan</span>
                        </div>
                        <Badge variant="outline" className="ml-auto text-[10px] h-4 px-1.5 border-white/30 text-white bg-white/10 group-data-[collapsible=icon]:hidden">
                          2
                        </Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="flex justify-center w-full px-2 py-0.5">
              <Separator className="bg-sidebar-border/60 w-full group-data-[collapsible=icon]:w-5" />
            </div>

            {/* Group 2: Periode & Pelaporan */}
            <SidebarGroup className="p-0 group-data-[collapsible=icon]:p-0">
              <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/70 px-2 h-7 group-data-[collapsible=icon]:hidden">
                Periode & Laporan
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1 group-data-[collapsible=icon]:gap-1.5 group-data-[collapsible=icon]:items-center">
                  <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/periods"}
                      tooltip="Periode Akuntansi & Tutup Buku"
                      className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <NavLink to="/periods" className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-full">
                        <CalendarClock className="size-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">Periode & Tutup Buku</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/reports"}
                      tooltip="Laporan Keuangan Resmi"
                      className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <NavLink to="/reports" className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-full">
                        <BarChart3 className="size-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">Laporan Keuangan</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/imports"}
                      tooltip="Impor Massal Batch"
                      className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <NavLink to="/imports" className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-full">
                        <UploadCloud className="size-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">Impor Massal (Batch)</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/audit"}
                      tooltip="Jejak Audit Append-Only"
                      className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <NavLink to="/audit" className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-full">
                        <ShieldCheck className="size-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">Jejak Audit</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="flex justify-center w-full px-2 py-0.5">
              <Separator className="bg-sidebar-border/60 w-full group-data-[collapsible=icon]:w-5" />
            </div>

            {/* Group 3: Design System & Dokumentasi */}
            <SidebarGroup className="p-0 group-data-[collapsible=icon]:p-0">
              <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/70 px-2 h-7 group-data-[collapsible=icon]:hidden">
                Design & Referensi
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1 group-data-[collapsible=icon]:gap-1.5 group-data-[collapsible=icon]:items-center">
                  <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/design-system"}
                      tooltip="Design System & Komponen"
                      className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <NavLink to="/design-system" className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-full">
                        <Palette className="size-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">Design System UI</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Sidebar Footer: User Session Switcher */}
          <SidebarFooter className="border-t border-sidebar-border h-14 p-0 flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2.5 px-3 h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-lg"
                >
                  <Avatar size="sm" className="size-8 shrink-0">
                    <AvatarFallback className="bg-white/20 text-white font-bold text-xs border border-white/20">
                      {currentUser.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left overflow-hidden group-data-[collapsible=icon]:hidden">
                    <span className="text-xs font-semibold text-sidebar-foreground truncate">{currentUser.name}</span>
                    <span className="text-[10px] text-sidebar-foreground/75 truncate">{currentUser.role}</span>
                  </div>
                  <ChevronDown className="size-3.5 text-sidebar-foreground/70 ml-auto group-data-[collapsible=icon]:hidden" />
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

          {/* Interactive Resize Rail */}
          <SidebarRail />
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex flex-col flex-1 overflow-x-hidden">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/40 bg-background/90 px-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4" />

              {/* Entity Selector */}
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

              {/* Active Accounting Period Chip */}
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

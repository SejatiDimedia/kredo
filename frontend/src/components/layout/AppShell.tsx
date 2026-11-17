import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/features/auth/context/AuthContext"
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
  User as UserIcon,
} from "lucide-react"
import { toast } from "sonner"

export function AppShell() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  const location = useLocation()
  const navigate = useNavigate()

  const { user, logout, switchEntity, hasPermission } = useAuth()

  const activeEntityName = user?.activeEntityName || "PT Maju Jaya Sejahtera"
  const initials = user?.fullName
    ? user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "KD"

  const handleLogout = async () => {
    await logout()
    toast.success("Anda telah keluar", {
      description: "Sesi otentikasi telah dicabut dengan aman.",
    })
    navigate("/login", { replace: true })
  }

  const handleSwitchEntity = async (entityId: number, entityName: string) => {
    try {
      await switchEntity(entityId)
      toast.success("Entitas berhasil dialihkan", {
        description: `Beralih ke entitas ${entityName}.`,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengalihkan entitas"
      toast.error("Gagal Beralih Entitas", { description: msg })
    }
  }

  // Breadcrumb mapping untuk orientasi hirarki modul akuntansi
  const getBreadcrumb = (pathname: string): { group: string; page: string } => {
    if (pathname === "/") return { group: "Ringkasan", page: "Dashboard" }
    if (pathname === "/accounts") return { group: "Buku Besar", page: "Chart of Accounts" }
    if (pathname === "/journals") return { group: "Buku Besar", page: "Jurnal Umum" }
    if (pathname === "/journals/new") return { group: "Buku Besar", page: "Entri Jurnal Baru" }
    if (pathname.startsWith("/journals/")) return { group: "Buku Besar", page: "Detail Jurnal" }
    if (pathname === "/approvals") return { group: "Buku Besar", page: "Antrean Persetujuan" }
    if (pathname === "/reports/general-ledger") return { group: "Buku Besar", page: "Buku Besar (Kartu Akun)" }
    if (pathname.startsWith("/reports")) return { group: "Pelaporan", page: "Laporan Keuangan" }
    if (pathname === "/periods") return { group: "Operasional", page: "Periode & Tutup Buku" }
    if (pathname === "/imports") return { group: "Operasional", page: "Impor Massal Batch" }
    if (pathname === "/audit") return { group: "Kepatuhan", page: "Jejak Audit" }
    if (pathname === "/design-system") return { group: "Sistem", page: "Design System UI" }
    return { group: "Akuntansi", page: "Kredo" }
  }

  const breadcrumb = getBreadcrumb(location.pathname)

  // Helper untuk warna badge role RBAC sesuai DESIGN.md (High Contrast, Calm Fintech Tones)
  const getRoleBadgeVariant = (role?: string): "purple" | "blue" | "info" | "secondary" | "success" => {
    switch (role) {
      case "CONTROLLER":
        return "purple"
      case "APPROVER":
        return "blue"
      case "ACCOUNTANT":
        return "info"
      case "ADMIN":
        return "secondary"
      case "AUDITOR":
        return "success"
      default:
        return "secondary"
    }
  }

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

                  {/* COA: Akses untuk semua peran */}
                  {hasPermission("coa:view") && (
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
                  )}

                  {/* Jurnal Umum: Accountant, Approver, Controller, Auditor */}
                  {hasPermission("journal:view") && (
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
                  )}

                  {/* Buku Besar (Kartu Akun): Accountant, Approver, Controller, Auditor */}
                  {hasPermission("journal:view") && (
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
                  )}

                  {/* Antrean Persetujuan Jurnal: Khusus Approver & Controller */}
                  {hasPermission("journal:approve") && (
                    <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === "/approvals"}
                        tooltip="Antrean Persetujuan Jurnal (Checker)"
                        className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                      >
                        <NavLink to="/approvals" className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-full">
                          <CheckSquare className="size-4 shrink-0" />
                          <span className="group-data-[collapsible=icon]:hidden">Persetujuan</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Group 2: Periode, Pelaporan, & Impor */}
            <SidebarGroup className="p-0 group-data-[collapsible=icon]:p-0">
              <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/70 px-2 h-7 group-data-[collapsible=icon]:hidden">
                Periode & Laporan
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1 group-data-[collapsible=icon]:gap-1.5 group-data-[collapsible=icon]:items-center">
                  {/* Periode Akuntansi: Accountant, Approver, Controller, Auditor */}
                  {hasPermission("period:view") && (
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
                  )}

                  {/* Laporan Keuangan: Accountant, Approver, Controller, Auditor */}
                  {hasPermission("report:view") && (
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
                  )}

                  {/* Impor Massal: Accountant, Approver, Controller */}
                  {hasPermission("import:run") && (
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
                  )}

                  {/* Jejak Audit: Admin, Controller, Auditor */}
                  {hasPermission("audit:view") && (
                    <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === "/audit"}
                        tooltip="Jejak Audit & Verifikasi Kriptografi"
                        className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                      >
                        <NavLink to="/audit" className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-full">
                          <ShieldCheck className="size-4 shrink-0" />
                          <span className="group-data-[collapsible=icon]:hidden">Jejak Audit</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {/* Design System UI Specs */}
                  <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/design-system"}
                      tooltip="Design System & UI Specs"
                      className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <NavLink to="/design-system" className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-full">
                        <Palette className="size-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">Design System</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Sidebar Footer: Pengguna Aktif & Menu Logout */}
          <SidebarFooter className="border-t border-sidebar-border h-16 p-2 flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-start gap-2.5 px-2.5 h-11 rounded-lg bg-transparent border-0 text-sidebar-foreground hover:bg-white/10 active:bg-white/15 data-[state=open]:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center cursor-pointer"
                >
                  <Avatar size="sm" className="size-8 shrink-0 ring-1 ring-white/20">
                    <AvatarFallback className="bg-[#094754] text-white font-semibold text-xs border-0">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left overflow-hidden group-data-[collapsible=icon]:hidden min-w-0">
                    <span className="text-xs font-medium text-white truncate leading-tight">
                      {user?.fullName || "Pengguna"}
                    </span>
                    <span className="text-[10px] text-white/70 truncate leading-tight mt-0.5">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronDown className="size-3.5 text-white/70 ml-auto shrink-0 group-data-[collapsible=icon]:hidden" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" sideOffset={8} className="w-64 text-xs p-1.5 shadow-lg border-border">
                <div className="px-2.5 py-2">
                  <p className="text-xs font-semibold text-foreground leading-none">{user?.fullName}</p>
                  <p className="text-[11px] text-muted-foreground leading-none mt-1 truncate">{user?.email}</p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <Badge variant={getRoleBadgeVariant(user?.role)} size="sm">
                      {user?.role}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {activeEntityName}
                    </span>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer rounded-md text-xs"
                >
                  <UserIcon className="size-3.5 text-muted-foreground" />
                  <span>Ganti Profil Persona (Login)</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive flex items-center gap-2 px-2.5 py-1.5 cursor-pointer rounded-md text-xs focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="size-3.5" />
                  <span>Keluar dari Sesi</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>

          {/* Interactive Resize Rail */}
          <SidebarRail />
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex flex-col flex-1 overflow-x-hidden">
          {/* Topbar / Application Header */}
          <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-card px-4 md:px-6">
            {/* Left: Sidebar Toggle & Contextual Breadcrumb */}
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground" />
              <Separator orientation="vertical" className="h-4 bg-border" />

              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground font-medium hidden sm:inline">
                  {breadcrumb.group}
                </span>
                <span className="text-muted-foreground/50 hidden sm:inline">/</span>
                <span className="text-foreground font-semibold">
                  {breadcrumb.page}
                </span>
              </nav>
            </div>

            {/* Right: Operational Status & Utilities */}
            <div className="flex items-center gap-2.5">
              {/* Active Accounting Period */}
              <NavLink
                to="/periods"
                className="hidden md:inline-flex items-center gap-1.5 h-8 rounded-md border border-border/80 bg-muted/40 px-2.5 text-xs text-foreground hover:bg-muted transition-colors"
                title="Status periode akuntansi buku besar"
              >
                <CalendarClock className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground font-normal">Periode:</span>
                <span className="font-mono font-medium text-foreground">Nov 2026</span>
                <span className="text-[10px] font-mono font-semibold px-1 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                  OPEN
                </span>
              </NavLink>

              <Separator orientation="vertical" className="h-4 bg-border hidden md:block" />

              {/* Entity Selector (Multi-Entity RBAC) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 px-2.5 text-xs font-medium text-foreground hover:bg-muted border-border/80"
                  >
                    <Building2 className="size-3.5 text-primary" />
                    <span className="max-w-[130px] sm:max-w-[180px] truncate">{activeEntityName}</span>
                    <ChevronDown className="size-3 text-muted-foreground opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-68 text-xs p-1 shadow-md">
                  <DropdownMenuLabel className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                    <Building2 className="size-3.5 text-primary" />
                    <span>Pilih Entitas Aktif</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  {user?.availableEntities && user.availableEntities.length > 0 ? (
                    user.availableEntities.map((ent) => (
                      <DropdownMenuItem
                        key={ent.entityId}
                        onClick={() => handleSwitchEntity(ent.entityId, ent.entityName)}
                        className="flex items-center justify-between cursor-pointer px-2 py-2 rounded-md"
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="font-semibold text-foreground">{ent.entityName}</div>
                          <div className="text-[10px] text-muted-foreground">
                            Kode: {ent.entityCode} • Peran: {ent.role}
                          </div>
                        </div>
                        {user.activeEntityId === ent.entityId && <Check className="size-3.5 text-primary ml-2 shrink-0" />}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem className="text-muted-foreground text-xs py-2">
                      Tidak ada entitas lain yang ditugaskan
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Switcher Button */}
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label={isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
                title={isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
              >
                {isDark ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4 text-slate-700 dark:text-slate-300" />}
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

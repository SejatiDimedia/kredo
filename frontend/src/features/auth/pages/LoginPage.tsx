import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Scale, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, ShieldCheck, UserCheck, FileCheck, Landmark, Search } from "lucide-react"
import { toast } from "sonner"

interface PersonaProfile {
  name: string
  role: string
  email: string
  roleBadge: string
  badgeVariant: "default" | "secondary" | "outline"
  badgeClass: string
  icon: React.ElementType
  responsibility: string
}

const PERSONA_PROFILES: PersonaProfile[] = [
  {
    name: "Dina Putri",
    role: "Staf Akuntansi (Maker)",
    email: "accountant@kredo.com",
    roleBadge: "ACCOUNTANT",
    badgeVariant: "default",
    badgeClass: "bg-teal-600/15 text-teal-800 dark:bg-teal-400/20 dark:text-teal-200 border-teal-500/30",
    icon: UserCheck,
    responsibility: "Input draf jurnal baru, impor massal CSV transaksi, dan pantau status pengajuan.",
  },
  {
    name: "Raka Pratama",
    role: "Akuntan Senior (Checker / Approver)",
    email: "approver@kredo.com",
    roleBadge: "APPROVER",
    badgeVariant: "secondary",
    badgeClass: "bg-amber-500/15 text-amber-800 dark:bg-amber-400/20 dark:text-amber-200 border-amber-500/30",
    icon: FileCheck,
    responsibility: "Tinjau antrean persetujuan, validasi kepatuhan, setujui/tolak jurnal, dan posting ke buku besar.",
  },
  {
    name: "Maya Kusuma",
    role: "Financial Controller",
    email: "controller@kredo.com",
    roleBadge: "CONTROLLER",
    badgeVariant: "default",
    badgeClass: "bg-indigo-500/15 text-indigo-800 dark:bg-indigo-400/20 dark:text-indigo-200 border-indigo-500/30",
    icon: Landmark,
    responsibility: "Kelola bagan akun (COA), eksekusi tutup periode bulanan, dan verifikasi rekonsiliasi buku besar.",
  },
  {
    name: "Arief Setiawan",
    role: "Auditor Internal",
    email: "auditor@kredo.com",
    roleBadge: "AUDITOR",
    badgeVariant: "outline",
    badgeClass: "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-200 border-emerald-500/30",
    icon: Search,
    responsibility: "Akses read-only seluruh laporan keuangan dan verifikasi integritas hash chaining audit trail.",
  },
  {
    name: "Sari Administrator",
    role: "System Administrator",
    email: "admin@kredo.com",
    roleBadge: "ADMIN",
    badgeVariant: "outline",
    badgeClass: "bg-slate-500/15 text-slate-800 dark:bg-slate-400/20 dark:text-slate-200 border-slate-500/30",
    icon: ShieldCheck,
    responsibility: "Kelola akun pengguna, penugasan hak akses per entitas, dan konfigurasi master sistem.",
  },
]

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = React.useState("accountant@kredo.com")
  const [password, setPassword] = React.useState("Kredo2026!")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Redirect jika sudah terautentikasi
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/"
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await login({ email: email.trim(), password })
      toast.success("Login berhasil", {
        description: `Selamat datang di Kredo Accounting Platform.`,
      })
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/"
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal masuk. Periksa kembali email dan password Anda."
      setErrorMessage(msg)
      toast.error("Otentikasi Gagal", { description: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectPersona = async (personaEmail: string) => {
    setEmail(personaEmail)
    setPassword("Kredo2026!")
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await login({ email: personaEmail, password: "Kredo2026!" })
      toast.success("Masuk sebagai persona resmi", {
        description: `Masuk sebagai ${personaEmail}.`,
      })
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/"
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal masuk."
      setErrorMessage(msg)
      toast.error("Otentikasi Gagal", { description: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex size-12 items-center justify-center rounded-xl bg-[#0D6276] text-white shadow-md mb-3">
          <Scale className="size-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Kredo Accounting
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Platform Akuntansi Enterprise — General Ledger Core
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl px-4 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Kolom Kiri: Form Login */}
          <div className="lg:col-span-6">
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Masuk ke Akun Anda
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Gunakan email dan password terdaftar untuk mengakses buku besar dan laporan keuangan entitas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200">
                    <AlertCircle className="size-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Email Pengguna
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@perusahaan.com"
                      required
                      autoComplete="email"
                      className="h-9 text-sm"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Kata Sandi
                      </Label>
                      <span className="text-[11px] text-slate-400">Default dev: Kredo2026!</span>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="h-9 pr-9 text-sm"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-9 bg-[#0D6276] hover:bg-[#0A4D5D] text-white font-medium text-sm transition-colors mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Memverifikasi...
                      </>
                    ) : (
                      "Masuk ke Aplikasi"
                    )}
                  </Button>
                </form>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Enkripsi Token: JWT 15m + HttpOnly Cookie</span>
                  <span className="font-mono text-[10px] text-slate-400">RBAC Per-Entity</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Quick Persona Selector (Sesuai Persona PRD Bab 3.1) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="px-1 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Demo Cepat Persona PRD
                </h2>
                <p className="text-[11px] text-slate-400">
                  Pilih salah satu profil untuk langsung masuk dan menguji batasan hak akses (RBAC).
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {PERSONA_PROFILES.map((persona) => {
                const IconComponent = persona.icon
                const isCurrent = email === persona.email

                return (
                  <button
                    key={persona.email}
                    type="button"
                    onClick={() => handleSelectPersona(persona.email)}
                    disabled={isSubmitting}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 bg-white dark:bg-slate-900 group hover:border-[#0D6276] hover:shadow-xs ${
                      isCurrent
                        ? "border-[#0D6276] ring-1 ring-[#0D6276]/30 bg-teal-50/20 dark:bg-teal-950/20"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="size-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-[#0D6276] group-hover:text-white transition-colors shrink-0 mt-0.5">
                      <IconComponent className="size-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {persona.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-mono px-1.5 py-0 h-4 uppercase ${persona.badgeClass}`}
                        >
                          {persona.roleBadge}
                        </Badge>
                      </div>
                      <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {persona.role}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {persona.responsibility}
                      </p>
                    </div>

                    <ArrowRight className="size-3.5 text-slate-300 group-hover:text-[#0D6276] group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

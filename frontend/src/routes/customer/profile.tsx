import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '#/hooks/useAuth'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { Separator } from '#/components/ui/separator'
import { User, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/customer/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Identity profile synchronized')
    setIsEditing(false)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-4 border-[var(--expressive-secondary)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--expressive-secondary)] text-white text-[10px] font-black uppercase tracking-widest mb-3 shadow-[2px_2px_0_0_#ce0031]">
            <User className="h-3 w-3" />
            Identity Management
          </div>
          <h1 className="text-5xl font-black text-[var(--expressive-text)] tracking-tighter uppercase leading-none">
            User <span className="text-[var(--expressive-primary)]">Profile</span>
          </h1>
          <p className="text-[var(--expressive-text-muted)] font-bold mt-2 text-lg">
            Manage your authenticated credentials and personal manifest.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column: Avatar & Summary */}
        <div className="w-full lg:w-80 shrink-0 space-y-8">
          <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[6px_6px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden text-center p-8">
            <div className="relative inline-block mb-6">
              <div className="h-24 w-24 rounded-3xl bg-[var(--expressive-primary)] flex items-center justify-center text-white border-4 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] mx-auto rotate-3 group-hover:rotate-0 transition-transform">
                <User className="h-12 w-12" />
              </div>
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-green-500 border-2 border-white flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-[var(--expressive-text)] tracking-tighter uppercase">{user?.name || 'Guest User'}</h2>
            <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mt-1 mb-6">
              {user?.role === 'admin' ? 'Strategic Administrator' : 'Premium Beneficiary'}
            </p>

            <div className="space-y-3 pt-6 border-t-2 border-[var(--expressive-secondary)]/5 text-left">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-[var(--expressive-text-muted)]">Membership ID</span>
                <span className="text-[var(--expressive-primary)]">#882910</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-[var(--expressive-text-muted)]">Status</span>
                <span className="text-green-600">Active</span>
              </div>
            </div>
          </Card>

          <Card className="bg-[var(--expressive-secondary)] text-white border-2 border-[var(--expressive-secondary)] shadow-[6px_6px_0_0_#ce0031] rounded-2xl p-6">
            <h3 className="text-sm font-black uppercase tracking-widest mb-4">Account Metadata</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Activation Cycle</p>
                <p className="font-bold text-sm">MAY 2026</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Data Synchronization</p>
                <p className="font-bold text-sm">REAL-TIME</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Edit Form */}
        <div className="flex-1">
          <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[8px_8px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
            <CardHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)] p-6 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xl font-black text-[var(--expressive-text)] tracking-tighter uppercase">Identity Configuration</CardTitle>
                <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mt-1">Authorized Profile Modification</p>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="h-10 px-4 border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:-translate-y-1 transition-all text-[10px] font-black uppercase"
                >
                  Modify Profile
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Full Nomenclature</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--expressive-text-muted)] group-focus-within:text-[var(--expressive-primary)] transition-colors" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-12 pl-12 border-2 border-[var(--expressive-secondary)] rounded-xl font-bold focus:ring-0 focus:border-[var(--expressive-primary)] disabled:bg-[var(--expressive-background)]/50"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Comm Channel (Email)</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--expressive-text-muted)] group-focus-within:text-[var(--expressive-primary)] transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-12 pl-12 border-2 border-[var(--expressive-secondary)] rounded-xl font-bold focus:ring-0 focus:border-[var(--expressive-primary)] disabled:bg-[var(--expressive-background)]/50"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Telephonic Link</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--expressive-text-muted)] group-focus-within:text-[var(--expressive-primary)] transition-colors" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-12 pl-12 border-2 border-[var(--expressive-secondary)] rounded-xl font-bold focus:ring-0 focus:border-[var(--expressive-primary)] disabled:bg-[var(--expressive-background)]/50"
                        placeholder="+1 234 567 8900"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Geographic Base</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--expressive-text-muted)] group-focus-within:text-[var(--expressive-primary)] transition-colors" />
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="h-12 pl-12 border-2 border-[var(--expressive-secondary)] rounded-xl font-bold focus:ring-0 focus:border-[var(--expressive-primary)] disabled:bg-[var(--expressive-background)]/50"
                        placeholder="123 Main St, City, Country"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 h-14 bg-[var(--expressive-secondary)] text-white font-black uppercase tracking-widest border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#ce0031] hover:-translate-y-1 transition-all"
                    >
                      Commit Synchronize
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 h-14 border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 transition-all font-black uppercase tracking-widest bg-white"
                    >
                      Abort Modification
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <section className="mt-10 p-8 bg-[var(--expressive-primary)] text-white border-2 border-[var(--expressive-secondary)] shadow-[6px_6px_0_0_var(--expressive-secondary)] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-white/20">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter leading-none">Account Security Directorate</h3>
                <p className="text-xs font-bold text-white/70 mt-2">Enhanced protection is active. Your data manifest is encrypted under Protocol Alpha-7.</p>
              </div>
            </div>
            <Button variant="outline" className="h-12 px-6 border-2 border-white text-white bg-transparent hover:bg-white/10 font-black uppercase tracking-widest text-[10px]">
              Review Security
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}

import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { getComplaintById, updateComplaint } from '#/services/complaints.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Label } from '#/components/ui/label'
import { Separator } from '#/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/complaints/$id')({
  component: AdminComplaintDetailsPage,
  loader: async ({ params }) => {
    try {
      const complaint = await getComplaintById(params.id)
      if (!complaint) {
        throw new Error('Complaint not found')
      }
      return { complaint }
    } catch (error) {
      // Throw error to be caught by error boundary
      throw error
    }
  },
  errorComponent: ({ error }) => (
    <div className="page-wrap px-4 py-16 text-center">
      <h1 className="display-title mb-4 text-3xl font-bold text-red-500">
        Error Loading Complaint
      </h1>
      <p className="mb-6 text-[var(--sea-ink-soft)]">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <Button asChild>
        <Link to="/admin/complaints">Back to Complaints</Link>
      </Button>
    </div>
  ),
})

import { User, FileText, Settings2, ShieldCheck, AlertCircle, Clock, CheckCircle } from 'lucide-react'

function AdminComplaintDetailsPage() {
  const { complaint: initialComplaint } = Route.useLoaderData()
  const [complaint, setComplaint] = useState(initialComplaint)
  const [status, setStatus] = useState(complaint?.status || 'open')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--expressive-background)]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-6 rounded-full bg-white border-2 border-[var(--expressive-secondary)] mb-6 shadow-[4px_4px_0_0_var(--expressive-secondary)]">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-[var(--expressive-primary)] mb-4 uppercase tracking-tighter">
            Manifest Not Found
          </h1>
          <Button asChild className="h-12 px-8 bg-[var(--expressive-secondary)] text-white font-black uppercase tracking-widest border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#000000] hover:-translate-y-1 transition-all">
            <Link to="/admin/complaints">Return to Queue</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 border-2 border-red-200 shadow-[2px_2px_0_0_#fecaca]">
            <AlertCircle className="h-3.5 w-3.5 mr-2" />
            Urgent Dispatch
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-[2px_2px_0_0_#bfdbfe]">
            <Clock className="h-3.5 w-3.5 mr-2" />
            Active Investigation
          </span>
        )
      case 'resolved':
      case 'closed':
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 border-2 border-green-200 shadow-[2px_2px_0_0_#bbf7d0]">
            <CheckCircle className="h-3.5 w-3.5 mr-2" />
            Settled Case
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-600 border-2 border-gray-200 shadow-[2px_2px_0_0_#e5e7eb]">
            {status}
          </span>
        )
    }
  }

  const handleUpdateStatus = async () => {
    setIsSubmitting(true)
    try {
      const updated = await updateComplaint(complaint.id, { status })
      if (updated) {
        setComplaint(updated)
        toast.success('Status synchronized with central database')
      }
    } catch (error) {
      toast.error('Synchronization failure')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild className="h-10 px-4 border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all bg-white text-[var(--expressive-text)] font-black text-[10px] uppercase tracking-widest">
          <Link to="/admin/complaints" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Queue
          </Link>
        </Button>
        <div className="text-right">
          <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1 leading-none">Record Reference</p>
          <p className="text-xl font-black text-[var(--expressive-primary)] tracking-tighter leading-none">#{complaint.id.substring(0, 12)}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Complaint Intelligence */}
        <div className="flex-1 space-y-8 w-full">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-[var(--expressive-secondary)] flex items-center justify-center text-white shadow-[3px_3px_0_0_var(--expressive-primary)]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[var(--expressive-text)] tracking-tighter uppercase leading-none">
                  Complaint <span className="text-[var(--expressive-primary)]">Intelligence</span>
                </h1>
                <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mt-1">Primary Incident Report</p>
              </div>
            </div>

            <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[6px_6px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 border-b-2 border-[var(--expressive-secondary)]/10">
                  <div className="p-6 border-r-2 border-[var(--expressive-secondary)]/10">
                    <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-2">Category Classification</p>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[var(--expressive-primary)]" />
                      <span className="text-lg font-black text-[var(--expressive-text)]">{complaint.type}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-2">Current Disposition</p>
                    {getStatusBadge(complaint.status || 'open')}
                  </div>
                </div>

                <div className="p-8 bg-[var(--expressive-background)]/30">
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-4">Subjective Briefing</p>
                  <h2 className="text-xl font-bold text-[var(--expressive-text)] mb-4 leading-tight border-l-4 border-[var(--expressive-primary)] pl-4">
                    {complaint.subject}
                  </h2>
                  <div className="p-6 bg-white border-2 border-[var(--expressive-secondary)]/10 rounded-xl shadow-inner italic text-[var(--expressive-text)] leading-relaxed">
                    "{complaint.description}"
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-white border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-[var(--expressive-secondary)] shadow-[3px_3px_0_0_var(--expressive-secondary)]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[var(--expressive-text)] tracking-tighter uppercase leading-none">Beneficiary Info</h2>
                <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mt-1">Origin of Communication</p>
              </div>
            </div>

            <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-[var(--expressive-primary)]/10 flex items-center justify-center border-2 border-[var(--expressive-primary)]/20">
                  <User className="h-8 w-8 text-[var(--expressive-primary)]" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">Authenticated Identity</p>
                  <p className="text-lg font-black text-[var(--expressive-text)]">{complaint.customerName || 'Anonymous Guest'}</p>
                  <p className="text-xs font-bold text-[var(--expressive-text-muted)]">ID: {complaint.visitorId || complaint.customerId}</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Right Column: Command Center */}
        <aside className="w-full lg:w-80 shrink-0 space-y-8">
          <div className="sticky top-8 space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-[3px_3px_0_0_#000000]">
                  <Settings2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[var(--expressive-text)] tracking-tighter uppercase leading-none">Dispatch</h2>
                  <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mt-1">Resolution Command</p>
                </div>
              </div>

              <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[6px_6px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="status" className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Update Operational Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                      <SelectTrigger id="status" className="h-12 border-2 border-[var(--expressive-secondary)] rounded-xl font-bold shadow-sm focus:ring-0 focus:ring-offset-0 focus:border-[var(--expressive-primary)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-[var(--expressive-secondary)] rounded-xl shadow-[4px_4px_0_0_#000000]">
                        <SelectItem value="open" className="font-bold py-3 text-red-600">URGENT DISPATCH</SelectItem>
                        <SelectItem value="in_progress" className="font-bold py-3 text-blue-600">ACTIVE INVESTIGATION</SelectItem>
                        <SelectItem value="resolved" className="font-bold py-3 text-green-600">SETTLE CASE</SelectItem>
                        <SelectItem value="closed" className="font-bold py-3 text-gray-600">ARCHIVE RECORD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full h-14 bg-[var(--expressive-secondary)] text-white font-black uppercase tracking-widest text-xs border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#ce0031] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#ce0031] active:translate-y-0.5 transition-all disabled:opacity-50"
                    onClick={handleUpdateStatus}
                    disabled={isSubmitting || status === complaint.status}
                  >
                    {isSubmitting ? 'Syncing...' : 'Commit Change'}
                  </Button>

                  {status === complaint.status && (
                    <p className="text-[9px] font-black text-center text-[var(--expressive-text-muted)] uppercase tracking-widest italic animate-pulse">
                      Status is current
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>

            <section className="p-6 bg-[var(--expressive-primary)]/5 border-2 border-dashed border-[var(--expressive-primary)]/30 rounded-2xl">
              <p className="text-[10px] font-black text-[var(--expressive-primary)] uppercase tracking-widest mb-2">Internal Note</p>
              <p className="text-xs font-bold text-[var(--expressive-text-muted)] italic leading-relaxed">
                "All resolutions are logged and periodically audited by the security directorate. Ensure high-fidelity response protocols are followed."
              </p>
            </section>
          </div>
        </aside>
      </div>
    </div>
  )
}


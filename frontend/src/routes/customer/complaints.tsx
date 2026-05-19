import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '#/hooks/useAuth'
import { getComplaints, createComplaint } from '#/services/complaints.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { MessageSquare, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export const Route = createFileRoute('/customer/complaints')({
  component: ComplaintsPage,
})

function ComplaintsPage() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState<any[]>([])

  useEffect(() => {
    loadComplaints()
  }, [user])

  const loadComplaints = async () => {
    if (!user) return
    const data = await getComplaints(user.id)
    setComplaints(data)
  }

  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const newComplaint = await createComplaint({
        type: formData.subject,
        description: formData.message
      })
      setComplaints((prev) => [newComplaint, ...prev])
      setFormData({ subject: '', message: '' })
      toast.success('Incident report successfully dispatched')
    } catch (error) {
      toast.error('Dispatch failure')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-50 text-green-600 border-2 border-green-200 shadow-[2px_2px_0_0_#bbf7d0]">
            <CheckCircle className="h-3 w-3 mr-1.5" />
            Settled
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-[2px_2px_0_0_#bfdbfe]">
            <Clock className="h-3 w-3 mr-1.5" />
            Active
          </span>
        )
      case 'open':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-50 text-red-600 border-2 border-red-200 shadow-[2px_2px_0_0_#fecaca]">
            <AlertCircle className="h-3 w-3 mr-1.5" />
            Pending
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-600 border-2 border-gray-200 shadow-[2px_2px_0_0_#e5e7eb]">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="pb-6 border-b-4 border-[var(--expressive-secondary)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--expressive-secondary)] text-white text-[10px] font-black uppercase tracking-widest mb-3 shadow-[2px_2px_0_0_#ce0031]">
          <MessageSquare className="h-3 w-3" />
          Operational Support
        </div>
        <h1 className="text-5xl font-black text-[var(--expressive-text)] tracking-tighter uppercase leading-none">
          Incident <span className="text-[var(--expressive-primary)]">Reporting</span>
        </h1>
        <p className="text-[var(--expressive-text-muted)] font-bold mt-2 text-lg">
          Dispatched concerns are prioritized by the central command terminal.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: New Report Form */}
        <div className="flex-1 max-w-2xl">
          <Card className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[8px_8px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden">
            <CardHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)] p-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[var(--expressive-primary)] flex items-center justify-center text-white border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)]">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-[var(--expressive-text)] tracking-tighter uppercase">Initialize Dispatch</CardTitle>
                <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mt-1">Primary Incident Documentation</p>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Subject Classification</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of the issue"
                    required
                    className="h-12 border-2 border-[var(--expressive-secondary)] rounded-xl font-bold focus:ring-0 focus:border-[var(--expressive-primary)]"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Detailed Manifest</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide full technical context about the incident..."
                    rows={6}
                    required
                    className="border-2 border-[var(--expressive-secondary)] rounded-xl font-bold focus:ring-0 focus:border-[var(--expressive-primary)] resize-none"
                  />
                </div>

                <Button type="submit" className="w-full h-14 bg-[var(--expressive-secondary)] text-white font-black uppercase tracking-widest border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_#ce0031] hover:-translate-y-1 transition-all">
                  <Send className="mr-2 h-4 w-4" />
                  Dispatch Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: History Feed */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-[var(--expressive-text)] uppercase tracking-widest">Dispatch History</h2>
            <span className="text-[10px] font-black text-[var(--expressive-primary)] uppercase tracking-widest">{complaints.length} Records</span>
          </div>

          <div className="space-y-4">
            {complaints.length === 0 ? (
              <div className="p-8 text-center bg-[var(--expressive-background)] border-2 border-dashed border-[var(--expressive-secondary)]/20 rounded-2xl">
                <MessageSquare className="h-10 w-10 mx-auto text-[var(--expressive-text-muted)] opacity-30 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">No active records found</p>
              </div>
            ) : (
              complaints.map((complaint) => (
                <Card key={complaint.id} className="bg-white border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-xl overflow-hidden hover:-translate-y-1 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-black text-[var(--expressive-text)] uppercase tracking-tight text-sm">
                          {complaint.subject}
                        </h4>
                        <p className="text-[9px] font-black text-[var(--expressive-text-muted)] uppercase tracking-tighter mt-1">
                          {format(new Date(complaint.createdAt), 'MMM d, p')}
                        </p>
                      </div>
                      {getStatusBadge(complaint.status)}
                    </div>

                    <p className="text-xs font-bold text-[var(--expressive-text-muted)] line-clamp-2 mb-4">
                      {complaint.message}
                    </p>

                    {complaint.response && (
                      <div className="p-4 bg-[var(--expressive-background)]/50 rounded-lg border-l-4 border-[var(--expressive-primary)]">
                        <p className="text-[9px] font-black text-[var(--expressive-primary)] uppercase tracking-widest mb-1">Command Response</p>
                        <p className="text-xs font-bold text-[var(--expressive-text)] italic">
                          "{complaint.response}"
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ComplaintCard({
  complaint,
  getStatusIcon,
}: {
  complaint: {
    id: string
    subject: string
    message: string
    status: 'open' | 'in_progress' | 'resolved'
    response?: string
    createdAt: string
  }
  getStatusIcon: (status: typeof complaint.status) => React.ReactNode
}) {
  return (
    <Card className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)]">
      <CardContent className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-[var(--expressive-primary)]">
              {complaint.subject}
            </h4>
            <p className="text-sm text-[var(--expressive-text)]">
              {format(new Date(complaint.createdAt), 'MMM d, yyyy • h:mm a')}
            </p>
          </div>
          <Badge variant="secondary" className="capitalize">
            {complaint.status.replace('_', ' ')}
          </Badge>
        </div>

        <p className="mb-4 text-[var(--expressive-text)]">{complaint.message}</p>

        {complaint.response && (
          <div className="rounded-xl bg-[var(--expressive-background)] p-4">
            <div className="mb-2 flex items-center gap-2">
              {getStatusIcon(complaint.status)}
              <p className="text-sm font-semibold text-[var(--expressive-primary)]">
                Response
              </p>
            </div>
            <p className="text-sm text-[var(--expressive-text)]">
              {complaint.response}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

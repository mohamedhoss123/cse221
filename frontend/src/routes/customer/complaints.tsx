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
  const [complaints, setComplaints] = useState<
    Array<{
      id: string
      subject: string
      message: string
      status: 'open' | 'in_progress' | 'resolved'
      response?: string
      createdAt: string
    }>
  >([])

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
        type: formData.subject,      // map subject → type
        description: formData.message // map message → description
      })
      setComplaints((prev) => [newComplaint, ...prev])
      setFormData({ subject: '', message: '' })
      toast.success('Complaint submitted successfully')
    } catch (error) {
      toast.error('Failed to submit complaint')
    }
  }

  const getStatusIcon = (status: typeof complaints[number]['status']) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-amber-500" />
      case 'open':
        return <AlertCircle className="h-5 w-5 text-red-500" />
    }
  }

  const openComplaints = complaints.filter((c) => c.status === 'open')
  const inProgressComplaints = complaints.filter((c) => c.status === 'in_progress')
  const resolvedComplaints = complaints.filter((c) => c.status === 'resolved')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-light mb-2 text-3xl font-bold text-[var(--expressive-primary)]">
          Complaints & Support
        </h1>
        <p className="text-[var(--expressive-text)]">
          Submit issues and track their resolution status
        </p>
      </div>

      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">New Complaint</TabsTrigger>
          <TabsTrigger value="history">Complaint History</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6">
          <div className="mx-auto max-w-2xl">
            <Card className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Submit a Complaint
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Please provide details about your complaint..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Complaint
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            {complaints.length === 0 ? (
              <Card className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)]">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="mx-auto mb-4 h-12 w-12 text-[var(--expressive-text)]" />
                  <p className="text-lg text-[var(--expressive-text)]">
                    No complaints submitted yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {openComplaints.length > 0 && (
                  <div>
                    <h3 className="mb-3 font-semibold text-[var(--expressive-primary)]">
                      Open ({openComplaints.length})
                    </h3>
                    <div className="space-y-3">
                      {openComplaints.map((complaint) => (
                        <ComplaintCard
                          key={complaint.id}
                          complaint={complaint}
                          getStatusIcon={getStatusIcon}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {inProgressComplaints.length > 0 && (
                  <>
                    <Separator />
                    <h3 className="mb-3 mt-6 font-semibold text-[var(--expressive-primary)]">
                      In Progress ({inProgressComplaints.length})
                    </h3>
                    <div className="space-y-3">
                      {inProgressComplaints.map((complaint) => (
                        <ComplaintCard
                          key={complaint.id}
                          complaint={complaint}
                          getStatusIcon={getStatusIcon}
                        />
                      ))}
                    </div>
                  </>
                )}

                {resolvedComplaints.length > 0 && (
                  <>
                    <Separator />
                    <h3 className="mb-3 mt-6 font-semibold text-[var(--expressive-primary)]">
                      Resolved ({resolvedComplaints.length})
                    </h3>
                    <div className="space-y-3">
                      {resolvedComplaints.map((complaint) => (
                        <ComplaintCard
                          key={complaint.id}
                          complaint={complaint}
                          getStatusIcon={getStatusIcon}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
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

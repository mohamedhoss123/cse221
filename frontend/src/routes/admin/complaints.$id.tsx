import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { getComplaintById, updateComplaint } from '#/services/complaints.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { Separator } from '#/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { ArrowLeft, MessageSquare, Send } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/complaints/$id')({
  component: AdminComplaintDetailsPage,
  loader: async ({ params }) => {
    const complaint = await getComplaintById(params.id)
    return { complaint }
  },
})

function AdminComplaintDetailsPage() {
  const { complaint: initialComplaint } = Route.useLoaderData()
  const [complaint, setComplaint] = useState(initialComplaint)
  const [response, setResponse] = useState(complaint?.response || '')
  const [status, setStatus] = useState(complaint?.status || 'open')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!complaint) {
    return (
      <div className="page-wrap px-4 py-16 text-center">
        <h1 className="display-title mb-4 text-3xl font-bold text-[var(--sea-ink)]">
          Complaint Not Found
        </h1>
        <Button asChild>
          <Link to="/admin/complaints">Back to Complaints</Link>
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: typeof complaint['status']) => {
    switch (status) {
      case 'resolved':
        return 'bg-[var(--palm)] text-white'
      case 'in_progress':
        return 'bg-blue-500 text-white'
      case 'open':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const handleSubmitResponse = async () => {
    setIsSubmitting(true)
    try {
      const updated = await updateComplaint(complaint.id, {
        response,
        status,
      })
      if (updated) {
        setComplaint(updated)
        toast.success('Response submitted successfully')
      }
    } catch (error) {
      toast.error('Failed to submit response')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-wrap px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/admin/complaints" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Complaints
          </Link>
        </Button>
      </div>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
            Complaint Details
          </h1>
          <p className="text-[var(--sea-ink-soft)]">Complaint ID: {complaint.id}</p>
        </div>
        <Badge className={getStatusColor(complaint.status)} variant="secondary">
          {complaint.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="gap-6 lg:grid lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="island-shell">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Complaint Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Subject</p>
                <h3 className="text-lg font-semibold text-[var(--sea-ink)]">
                  {complaint.subject}
                </h3>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Message</p>
                <p className="text-[var(--sea-ink)]">{complaint.message}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Customer ID</p>
                <p className="text-[var(--sea-ink)]">{complaint.customerId}</p>
              </div>

              {complaint.bookingId && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-[var(--sea-ink-soft)]">Related Booking</p>
                    <p className="text-[var(--sea-ink)]">{complaint.bookingId}</p>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Submitted</p>
                <p className="text-[var(--sea-ink)]">
                  {format(new Date(complaint.createdAt), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>

              {complaint.response && (
                <>
                  <Separator />
                  <div className="rounded-lg bg-[var(--foam)] p-4">
                    <p className="mb-2 text-sm font-semibold text-[var(--sea-ink)]">
                      Previous Response
                    </p>
                    <p className="text-sm text-[var(--sea-ink-soft)]">
                      {complaint.response}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Response Form */}
        <div className="lg:col-span-1">
          <Card className="island-shell sticky top-24">
            <CardHeader>
              <CardTitle>Respond to Complaint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="response">Response</Label>
                <Textarea
                  id="response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response..."
                  rows={6}
                />
              </div>

              <Separator />

              <Button
                className="w-full"
                onClick={handleSubmitResponse}
                disabled={isSubmitting || !response.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Response'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

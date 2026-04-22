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

function AdminComplaintDetailsPage() {
  const { complaint: initialComplaint } = Route.useLoaderData()
  const [complaint, setComplaint] = useState(initialComplaint)
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
      case 'closed':
        return 'bg-gray-600 text-white'
      case 'in_progress':
        return 'bg-blue-500 text-white'
      case 'open':
        return 'bg-red-500 text-white'
      case 'resolved':
        return 'bg-[var(--palm)] text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const handleUpdateStatus = async () => {
    setIsSubmitting(true)
    try {
      const updated = await updateComplaint(complaint.id, { status })
      if (updated) {
        setComplaint(updated)
        toast.success('Status updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update status')
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
        <Badge className={getStatusColor(complaint.status || 'open')} variant="secondary">
          {(complaint.status || 'open').replace('_', ' ')}
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
                <p className="text-sm text-[var(--sea-ink-soft)]">Type</p>
                <h3 className="text-lg font-semibold text-[var(--sea-ink)]">
                  {complaint.type}
                </h3>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Description</p>
                <p className="text-[var(--sea-ink)]">{complaint.description}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Customer ID</p>
                <p className="text-[var(--sea-ink)]">{complaint.visitorId}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Update Form */}
        <div className="lg:col-span-1">
          <Card className="island-shell sticky top-24">
            <CardHeader>
              <CardTitle>Update Complaint Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <Button
                className="w-full"
                onClick={handleUpdateStatus}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Status'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

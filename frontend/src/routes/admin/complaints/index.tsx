import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { getComplaintsSync } from '#/services/bookings.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table'
import { MessageSquare } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/admin/complaints/')({
  component: AdminComplaintsPage,
})

function AdminComplaintsPage() {
  const [complaints] = useState(getComplaintsSync())

  const getStatusColor = (status: typeof complaints[number]['status']) => {
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

  const openCount = complaints.filter((c) => c.status === 'open').length
  const inProgressCount = complaints.filter((c) => c.status === 'in_progress').length
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length

  return (
    <div className="page-wrap px-4 py-8">
      <div className="mb-8">
        <h1 className="display-title mb-2 text-3xl font-bold text-[var(--sea-ink)]">
          Complaint Management
        </h1>
        <p className="text-[var(--sea-ink-soft)]">
          View and respond to customer complaints
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Open</p>
                <p className="text-2xl font-bold text-red-500">{openCount}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">In Progress</p>
                <p className="text-2xl font-bold text-blue-500">{inProgressCount}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Resolved</p>
                <p className="text-2xl font-bold text-[var(--palm)]">{resolvedCount}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-[var(--palm)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="island-shell">
        <CardContent className="p-0">
          {complaints.length === 0 ? (
            <div className="py-12 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-[var(--sea-ink-soft)]" />
              <p className="text-lg text-[var(--sea-ink-soft)]">
                No complaints found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.id}</TableCell>
                      <TableCell>{complaint.customerId}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {complaint.subject}
                      </TableCell>
                      <TableCell>
                        {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(complaint.status)}
                          variant="secondary"
                        >
                          {complaint.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/complaints/${complaint.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

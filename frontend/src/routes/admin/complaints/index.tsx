import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getComplaints } from '#/services/complaints.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table'
import { MessageSquare } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/admin/complaints/')({
  component: AdminComplaintsPage,
})

import { AlertCircle, CheckCircle, Clock, Search, MoreHorizontal } from 'lucide-react'

function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = async () => {
    setIsLoading(true)
    try {
      const data = await getComplaints()
      setComplaints(data)
    } catch (error) {
      console.error('Failed to load complaints:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 border-2 border-red-200 shadow-[2px_2px_0_0_#fecaca]">
            <AlertCircle className="h-3 w-3 mr-1.5" />
            Urgent
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-[2px_2px_0_0_#bfdbfe]">
            <Clock className="h-3 w-3 mr-1.5" />
            Active
          </span>
        )
      case 'resolved':
      case 'closed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 border-2 border-green-200 shadow-[2px_2px_0_0_#bbf7d0]">
            <CheckCircle className="h-3 w-3 mr-1.5" />
            Settled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-600 border-2 border-gray-200 shadow-[2px_2px_0_0_#e5e7eb]">
            {status}
          </span>
        )
    }
  }

  const filteredComplaints = complaints.filter((c) =>
    statusFilter === 'all' || c.status === statusFilter
  )

  const openCount = complaints.filter((c) => c.status === 'open').length
  const inProgressCount = complaints.filter((c) => c.status === 'in_progress').length
  const resolvedCount = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-light text-[var(--expressive-primary)] mb-2">
          Issue <span className="font-semibold text-[var(--expressive-primary)]">Tracking</span>
        </h1>
        <p className="text-[var(--expressive-text-muted)] text-lg">
          Monitor guest concerns and manage operational resolutions in real-time.
        </p>
      </div>

      <div className="mb-10 grid gap-6 sm:grid-cols-3">
        <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">Critical Queue</p>
                <p className="text-3xl font-black text-red-600 tracking-tighter">{openCount} Pending</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-red-50 border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">Operational Flow</p>
                <p className="text-3xl font-black text-blue-600 tracking-tighter">{inProgressCount} Active</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-blue-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">History Terminal</p>
                <p className="text-3xl font-black text-green-600 tracking-tighter">{resolvedCount} Settled</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-50 border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] rounded-2xl shadow-[4px_4px_0_0_var(--expressive-secondary)]">
        <div className="flex items-center gap-4">
          <span className="text-xs font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Dispatch Filter:</span>
          <div className="flex flex-wrap gap-2">
            {(['all', 'open', 'in_progress', 'resolved'] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={`h-9 px-4 font-black text-[10px] uppercase tracking-widest border-2 transition-all ${statusFilter === status
                    ? 'bg-[var(--expressive-secondary)] text-white border-[var(--expressive-secondary)]'
                    : 'bg-white border-[var(--expressive-secondary)]/10 hover:border-[var(--expressive-secondary)] hover:translate-y-[-1px]'
                  }`}
              >
                {status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Card className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] mb-4">
                <Search className="h-10 w-10 text-[var(--expressive-primary)] animate-pulse" />
              </div>
              <p className="text-[var(--expressive-text-muted)] font-black uppercase tracking-widest">Scanning Dispatch Logs...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center p-6 rounded-full bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] mb-6">
                <MessageSquare className="h-16 w-16 text-[var(--expressive-text-muted)] opacity-30" />
              </div>
              <p className="text-2xl font-black text-[var(--expressive-primary)] mb-2 uppercase tracking-tighter">
                No active issues
              </p>
              <p className="text-[var(--expressive-text-muted)] font-bold">
                The communication queue is currently clear.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)]">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-[10px] py-5 px-6">Dispatch ID</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-[10px] py-5 px-6">Beneficiary</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-[10px] py-5 px-6">Briefing</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-[10px] py-5 px-6">Timestamp</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-[10px] py-5 px-6">Operational Status</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-[10px] py-5 px-6 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint) => (
                    <TableRow key={complaint.id} className="border-b border-[var(--expressive-secondary)]/5 hover:bg-[var(--expressive-background)]/60 transition-colors">
                      <TableCell className="py-6 px-6 font-black text-[var(--expressive-primary)] text-xs">
                        #{complaint.id.substring(0, 8)}
                      </TableCell>
                      <TableCell className="px-6 font-bold text-[var(--expressive-text)]">
                        {complaint.customerName || complaint.customerId}
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="max-w-xs truncate font-bold text-[var(--expressive-text)]">
                          {complaint.subject}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-tighter">
                        {format(new Date(complaint.createdAt), 'MMM d, p')}
                      </TableCell>
                      <TableCell className="px-6">
                        {getStatusBadge(complaint.status)}
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        <Button variant="outline" size="sm" asChild className="h-9 px-4 border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all bg-white text-[var(--expressive-text)] hover:text-[var(--expressive-primary)] font-black text-[10px] uppercase tracking-widest">
                          <Link to={`/admin/complaints/${complaint.id}`}>Investigate</Link>
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

import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getInvoices } from '#/services/invoices.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table'
import { FileText, DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import type { Invoice } from '#/types/booking.types'

export const Route = createFileRoute('/admin/invoices')({
  component: AdminInvoicesPage,
})

function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      const data = await getInvoices()
      setInvoices(data)
    } catch (error) {
      console.error('Failed to load invoices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500 text-white'
      case 'partial':
        return 'bg-blue-500 text-white'
      case 'pending':
        return 'bg-yellow-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getInvoiceStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return CheckCircle
      case 'partial':
        return Clock
      case 'pending':
        return DollarSign
      default:
        return FileText
    }
  }

  const filteredInvoices = invoices.filter((invoice) =>
    statusFilter === 'all' || invoice.status === statusFilter
  )

  // Calculate metrics
  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0)
  const totalPending = invoices.reduce((sum, inv) => sum + (inv.remainingAmount || 0), 0)
  const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length

  return (
    <div className="page-wrap px-4 py-8">
      <div className="mb-8">
        <h1 className="display-title mb-2 text-3xl font-bold text-[var(--expressive-primary)]">
          Invoice Management
        </h1>
        <p className="text-[var(--expressive-text)]">
          View and manage all invoices
        </p>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--expressive-text-muted)]">Total Billed</p>
                <p className="text-2xl font-bold text-[var(--expressive-text)]">
                  ${totalBilled.toLocaleString()}
                </p>
              </div>
              <FileText className="h-8 w-8 text-[var(--expressive-primary)]" />
            </div>
          </CardContent>
        </Card>

        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--expressive-text-muted)]">Amount Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalPaid.toLocaleString()}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--expressive-text-muted)]">Amount Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${totalPending.toLocaleString()}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--expressive-text-muted)]">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {overdueCount}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium text-[var(--expressive-text)]">Filter by status:</label>
        <div className="flex gap-2">
          {(['all', 'pending', 'partial', 'paid'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status ? 'bg-[var(--expressive-primary)] text-black' : ''}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <Card className="island-shell">
        <CardContent className="p-0">
          {filteredInvoices.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-[var(--expressive-text-muted)]" />
              <p className="text-lg text-[var(--expressive-text-muted)]">
                {statusFilter === 'all' ? 'No invoices found' : `No ${statusFilter} invoices found`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => {
                    const StatusIcon = getInvoiceStatusIcon(invoice.status)
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.customerName || invoice.customerId}</TableCell>
                        <TableCell>
                          {invoice.createdAt ? format(new Date(invoice.createdAt), 'MMM d, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${invoice.totalAmount ? invoice.totalAmount.toFixed(2) : '0.00'}
                        </TableCell>
                        <TableCell className="text-green-600">
                          ${invoice.paidAmount ? invoice.paidAmount.toFixed(2) : '0.00'}
                        </TableCell>
                        <TableCell className={invoice.remainingAmount > 0 ? 'text-red-600' : ''}>
                          ${(invoice.remainingAmount || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getInvoiceStatusColor(invoice.status)}
                            variant="secondary"
                          >
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/admin/invoices/${invoice.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[var(--expressive-primary)] text-[var(--expressive-primary)] hover:bg-[var(--expressive-primary)] hover:text-black"
                            >
                              <FileText className="mr-1 h-4 w-4" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

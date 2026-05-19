import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getInvoices } from '#/services/invoices.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table'
import { FileText, DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import type { Invoice } from '#/types/booking.types'

export const Route = createFileRoute('/admin/invoices/')({
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
    setIsLoading(true)
    try {
      const data = await getInvoices()
      setInvoices(data)
    } catch (error) {
      console.error('Failed to load invoices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 border-2 border-green-200 shadow-[2px_2px_0_0_#bbf7d0]">
            <CheckCircle className="h-3 w-3 mr-1.5" />
            {status}
          </span>
        )
      case 'partial':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-[2px_2px_0_0_#bfdbfe]">
            <Clock className="h-3 w-3 mr-1.5" />
            {status}
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border-2 border-amber-200 shadow-[2px_2px_0_0_#fcd34d]">
            <DollarSign className="h-3 w-3 mr-1.5" />
            {status}
          </span>
        )
      case 'overdue':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 border-2 border-red-200 shadow-[2px_2px_0_0_#fecaca]">
            <AlertCircle className="h-3 w-3 mr-1.5" />
            {status}
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

  const filteredInvoices = invoices.filter((invoice) =>
    statusFilter === 'all' || invoice.status === statusFilter
  )

  // Calculate metrics
  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0)
  const totalPending = invoices.reduce((sum, inv) => sum + (inv.remainingAmount || 0), 0)
  const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-light text-[var(--expressive-primary)] mb-2">
          Financial <span className="font-semibold text-[var(--expressive-primary)]">Ledger</span>
        </h1>
        <p className="text-[var(--expressive-text-muted)] text-lg">
          Comprehensive audit of all property transactions and settlement statuses.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">Gross Billing</p>
                <p className="text-3xl font-black text-[var(--expressive-text)] tracking-tighter">
                  ${totalBilled.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">Settled Assets</p>
                <p className="text-3xl font-black text-green-600 tracking-tighter">
                  ${totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-50 border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">Active Receivables</p>
                <p className="text-3xl font-black text-amber-600 tracking-tighter">
                  ${totalPending.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black text-[var(--expressive-text-muted)] uppercase tracking-widest mb-1">Default Risk</p>
                <p className="text-3xl font-black text-red-600 tracking-tighter">
                  {overdueCount} <span className="text-xs font-bold uppercase">Files</span>
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-red-50 border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] rounded-2xl shadow-[4px_4px_0_0_var(--expressive-secondary)]">
        <div className="flex items-center gap-4">
          <span className="text-xs font-black uppercase tracking-widest text-[var(--expressive-text-muted)]">Audit Filter:</span>
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'partial', 'paid', 'overdue'] as const).map((status) => (
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
                {status}
              </Button>
            ))}
          </div>
        </div>
        <Button className="bg-[var(--expressive-primary)] hover:bg-[var(--expressive-primary-hover)] text-white border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] transition-all font-black uppercase tracking-widest text-[10px] h-10 px-6">
          Export Ledger
        </Button>
      </div>

      <Card className="bg-[var(--expressive-surface)] rounded-2xl border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] mb-4">
                <Clock className="h-10 w-10 text-[var(--expressive-primary)] animate-pulse" />
              </div>
              <p className="text-[var(--expressive-text-muted)] font-black uppercase tracking-widest">Reconstructing Ledger...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center p-6 rounded-full bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] mb-6">
                <FileText className="h-16 w-16 text-[var(--expressive-text-muted)] opacity-30" />
              </div>
              <p className="text-2xl font-black text-[var(--expressive-primary)] mb-2 uppercase tracking-tighter">
                No Transactional Records
              </p>
              <p className="text-[var(--expressive-text-muted)] font-bold">
                No logs match your current filter criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[var(--expressive-background)] border-b-2 border-[var(--expressive-secondary)]">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-[10px] py-5 px-6">Log ID</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-[10px] py-5 px-6">Beneficiary</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-[10px] py-5 px-6">Gross</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-[10px] py-5 px-6">Settled</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-[10px] py-5 px-6">Outstanding</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-[10px] py-5 px-6">Condition</TableHead>
                    <TableHead className="text-[var(--expressive-primary)] font-black uppercase tracking-wider text-[10px] py-5 px-6 text-right">Operation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => {
                    return (
                      <TableRow key={invoice.id} className="border-b border-[var(--expressive-secondary)]/5 hover:bg-[var(--expressive-background)]/60 transition-colors">
                        <TableCell className="py-6 px-6 font-black text-[var(--expressive-primary)] text-xs">
                          #{invoice.id.substring(0, 8)}
                        </TableCell>
                        <TableCell className="px-6 font-bold text-[var(--expressive-text)]">
                          {invoice.customerName || invoice.customerId}
                        </TableCell>
                        <TableCell className="px-6 font-black text-[var(--expressive-text)] text-lg tracking-tighter">
                          ${invoice.totalAmount?.toLocaleString()}
                        </TableCell>
                        <TableCell className="px-6">
                          <span className="font-bold text-green-600 text-sm">
                            ${invoice.paidAmount?.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="px-6">
                          <span className={`font-bold text-sm ${invoice.remainingAmount > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                            ${(invoice.remainingAmount || 0).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="px-6">
                          {getInvoiceStatusBadge(invoice.status)}
                        </TableCell>
                        <TableCell className="px-6 text-right">
                          <Link to={`/admin/invoices/${invoice.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 px-4 border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all bg-white text-[var(--expressive-text)] hover:text-[var(--expressive-primary)] font-black text-[10px] uppercase tracking-widest"
                            >
                              Open File
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


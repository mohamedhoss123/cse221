import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '#/hooks/useAuth'
import { getInvoices } from '#/services/invoices.service'
import type { Invoice } from '#/types/booking.types'
import {
  DollarSign,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/customer/payments/')({
  component: PaymentsPage,
})

function PaymentsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid'>('all')
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    const data = await getInvoices()
    setInvoices(data)
  }

  const filteredInvoices = invoices.filter((invoice) => {
    if (activeTab === 'all') return true
    return invoice.status === activeTab
  })

  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
  const totalPending = invoices.filter((inv) => inv.status !== 'paid').length
  const totalRemaining = invoices.reduce((sum, inv) => sum + inv.remainingAmount, 0)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        icon: Clock,
        label: 'Pending',
        className: 'bg-amber-100 text-[#000] border-amber-200',
      },
      partial: {
        icon: AlertCircle,
        label: 'Partial',
        className: 'bg-amber-100 text-[#000] border-amber-200',
      },
      paid: {
        icon: CheckCircle2,
        label: 'Paid',
        className: 'bg-green-100 text-[#000] border-green-200',
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </div>
    )
  }

  const InvoiceCard = ({ invoice }: { invoice: Invoice }) => {
    const progressPercentage = (invoice.paidAmount / invoice.totalAmount) * 100

    return (
      <Link to="/customer/payments/$invoiceId" params={{ invoiceId: invoice.id }}>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-[var(--expressive-primary)]">
              {invoice.booking?.roomName || invoice.roomName || `Room #${invoice.roomId}`}
            </h3>
              {getStatusBadge(invoice.status)}
              </div>
              <p className="text-sm text-[#000]">
                Invoice #{invoice.id} • Booking #{invoice.booking?.id || invoice.reservationId}
              </p>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#000]">Payment Progress</span>
              <span className="text-xs font-semibold text-[var(--expressive-primary)]">{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[var(--expressive-primary)] to-[var(--expressive-accent)] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-[#000] mb-1">Total</p>
              <p className="text-sm font-semibold text-[var(--expressive-primary)]">${invoice.amount}</p>
            </div>
            <div>
              <p className="text-xs text-[#000] mb-1">Paid</p>
              <p className="text-sm font-semibold text-[#000]">${invoice.paidAmount}</p>
            </div>
            <div>
              <p className="text-xs text-[#000] mb-1">Remaining</p>
              <p className="text-sm font-semibold text-[var(--expressive-primary)]">${invoice.remainingAmount}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-[#000]">
              <Calendar className="w-4 h-4" />
              <span>Due {format(new Date(invoice.dueDate), 'MMM d, yyyy')}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 hover:bg-slate-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-[var(--expressive-primary)] mb-2">
          Payment <span className="font-semibold text-[var(--expressive-primary)]">Center</span>
        </h1>
        <p className="text-[#000]">
          Manage your invoices and payments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#000]">${totalPaid}</p>
              <p className="text-sm text-[#000]">Total Paid</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--expressive-accent)]/20 to-[var(--expressive-accent)]/10 rounded-2xl p-6 border border-[var(--expressive-accent)]/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--expressive-primary)] flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--expressive-primary)]">${totalRemaining}</p>
              <p className="text-sm text-[var(--expressive-primary)]">Remaining</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#000]">{totalPending}</p>
              <p className="text-sm text-[#000]">Pending Invoices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-[var(--expressive-primary)] to-[var(--expressive-accent)] text-white shadow-md'
              : 'bg-white text-[#000] hover:bg-[var(--expressive-background)] border border-slate-200'
          }`}
        >
          All ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'pending'
              ? 'bg-gradient-to-r from-[var(--expressive-primary)] to-[var(--expressive-accent)] text-white shadow-md'
              : 'bg-white text-[#000] hover:bg-[var(--expressive-background)] border border-slate-200'
          }`}
        >
          Pending ({invoices.filter((i) => i.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('paid')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'paid'
              ? 'bg-gradient-to-r from-[var(--expressive-primary)] to-[var(--expressive-accent)] text-white shadow-md'
              : 'bg-white text-[#000] hover:bg-[var(--expressive-background)] border border-slate-200'
          }`}
        >
          Paid ({invoices.filter((i) => i.status === 'paid').length})
        </button>
      </div>

      {/* Invoices Grid */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <FileText className="w-16 h-16 text-[#000] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[var(--expressive-primary)] mb-2">No invoices found</h3>
          <p className="text-[#000]">
            {activeTab === 'paid'
              ? "You haven't paid any invoices yet"
              : activeTab === 'pending'
              ? "You don't have any pending invoices"
              : "No invoices available"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  )
}

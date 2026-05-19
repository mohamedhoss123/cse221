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
        label: 'PENDING',
        className: 'bg-amber-100 text-[#000] border-amber-400 shadow-[2px_2px_0_0_#fbbf24]',
      },
      partial: {
        icon: AlertCircle,
        label: 'PARTIAL',
        className: 'bg-blue-100 text-[#000] border-blue-400 shadow-[2px_2px_0_0_#60a5fa]',
      },
      paid: {
        icon: CheckCircle2,
        label: 'SETTLED',
        className: 'bg-green-100 text-[#000] border-green-400 shadow-[2px_2px_0_0_#4ade80]',
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-[10px] font-black border-2 uppercase tracking-tighter ${config.className}`}>
        <Icon className="w-3.5 h-3.5" strokeWidth={3} />
        {config.label}
      </div>
    )
  }

  const InvoiceCard = ({ invoice }: { invoice: Invoice }) => {
    const progressPercentage = (invoice.paidAmount / invoice.totalAmount) * 100

    return (
      <Link to="/customer/payments/$invoiceId" params={{ invoiceId: invoice.id }}>
        <div className="bg-white rounded-none p-6 border-4 border-black hover:shadow-[8px_8px_0_0_#000] transition-all duration-200 cursor-pointer h-full group">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h3 className="text-xl font-black text-black uppercase tracking-tighter group-hover:text-[#ce0031] transition-colors">
                  {invoice.booking?.roomName || invoice.roomName || `UNIT_ASSET_${invoice.roomId}`}
                </h3>
                {getStatusBadge(invoice.status)}
              </div>
              <p className="text-xs font-bold text-black/60 uppercase tracking-widest">
                MFST_REF: {invoice.id} // BKG_ID: {invoice.booking?.id || invoice.reservationId}
              </p>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Fiscal Saturation</span>
              <span className="text-xs font-black text-[#ce0031]">{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-black/10 rounded-none h-4 border-2 border-black overflow-hidden p-0.5">
              <div
                className="bg-[#ce0031] h-full transition-all duration-700 ease-out border-r-2 border-black"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-black/5 p-3 border-2 border-black/10">
              <p className="text-[10px] font-black text-black/40 uppercase mb-1">Gross Yield</p>
              <p className="text-lg font-black text-black">${invoice.amount}</p>
            </div>
            <div className="bg-black/5 p-3 border-2 border-black/10">
              <p className="text-[10px] font-black text-black/40 uppercase mb-1">Liquidated</p>
              <p className="text-lg font-black text-black">${invoice.paidAmount}</p>
            </div>
            <div className="bg-[#ce0031]/10 p-3 border-2 border-[#ce0031]/20">
              <p className="text-[10px] font-black text-[#ce0031]/60 uppercase mb-1">Outstanding</p>
              <p className="text-lg font-black text-[#ce0031]">${invoice.remainingAmount}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t-2 border-black border-dashed">
            <div className="flex items-center gap-2 text-[10px] font-black text-black uppercase tracking-widest">
              <Calendar className="w-4 h-4 text-[#ce0031]" />
              <span>Horizon: {format(new Date(invoice.dueDate), 'yyyy.MM.dd')}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-none border-2 border-black font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              <FileText className="w-4 h-4 mr-2" />
              Manifest Intelligence
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 border-l-8 border-black pl-8">
        <h1 className="text-6xl font-black text-black mb-4 uppercase tracking-tighter leading-none">
          FISCAL <span className="text-[#ce0031]">LEDGER</span>
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-sm font-bold text-black/60 uppercase tracking-[0.2em]">
            Operational Liquidity Management Terminal
          </p>
          <div className="h-0.5 flex-1 bg-black/10" />
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-2 h-2 bg-[#ce0031]" />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-black text-white">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">Type: Liquid</span>
          </div>
          <p className="text-4xl font-black text-black mb-1">${totalPaid}</p>
          <p className="text-xs font-bold text-black/60 uppercase tracking-widest">Total Liquidated Assets</p>
        </div>

        <div className="bg-[#ce0031] border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-black text-white">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Type: Liability</span>
          </div>
          <p className="text-4xl font-black text-white mb-1">${totalRemaining}</p>
          <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Outstanding Fiscal Debt</p>
        </div>

        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-black text-white">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">Type: Operational</span>
          </div>
          <p className="text-4xl font-black text-black mb-1">{totalPending}</p>
          <p className="text-xs font-bold text-black/60 uppercase tracking-widest">Pending Manifests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { id: 'all', label: 'GLOBAL_LEDGER', count: invoices.length },
          { id: 'pending', label: 'OUTSTANDING', count: invoices.filter((i) => i.status === 'pending').length },
          { id: 'paid', label: 'SETTLED', count: invoices.filter((i) => i.status === 'paid').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 border-4 border-black font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-black text-white shadow-[4px_4px_0_0_#ce0031] -translate-x-1 -translate-y-1'
                : 'bg-white text-black hover:bg-black/5'
            }`}
          >
            {tab.label} [{tab.count}]
          </button>
        ))}
      </div>

      {/* Invoices Grid */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white border-4 border-black border-dashed p-20 text-center">
          <div className="w-24 h-24 border-4 border-black flex items-center justify-center mx-auto mb-6 bg-black/5">
            <FileText className="w-12 h-12 text-black/20" />
          </div>
          <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tighter">No Ledger Entries Detected</h3>
          <p className="text-sm font-bold text-black/60 uppercase tracking-widest">
            {activeTab === 'paid'
              ? "Zero settled transactions in current terminal cycle"
              : activeTab === 'pending'
              ? "All fiscal liabilities have been neutralized"
              : "System memory empty"}
          </p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  )
}

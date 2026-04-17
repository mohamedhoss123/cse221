import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { getPaymentsSync } from '#/services/payments.service'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table'
import { DollarSign, RefreshCw, Undo } from 'lucide-react'
import { format } from 'date-fns'
import RefundDialog from '#/components/admin/RefundDialog'

export const Route = createFileRoute('/admin/payments')({
  component: AdminPaymentsPage,
})

function AdminPaymentsPage() {
  const [payments] = useState(getPaymentsSync())
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)

  const getPaymentStatusColor = (status: typeof payments[number]['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-[var(--palm)] text-white'
      case 'pending':
        return 'bg-yellow-500 text-white'
      case 'refunded':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const handleRefund = (payment: typeof payments[0]) => {
    setSelectedPayment(payment)
    setRefundDialogOpen(true)
  }

  const totalRevenue = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const refundedAmount = payments
    .filter((p) => p.status === 'refunded')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="page-wrap px-4 py-8">
      <div className="mb-8">
        <h1 className="display-title mb-2 text-3xl font-bold text-[var(--sea-ink)]">
          Payment Management
        </h1>
        <p className="text-[var(--sea-ink-soft)]">
          View and manage all payments
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Total Revenue</p>
                <p className="text-2xl font-bold text-[var(--sea-ink)]">
                  ${totalRevenue}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-[var(--lagoon-deep)]" />
            </div>
          </CardContent>
        </Card>

        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Refunded</p>
                <p className="text-2xl font-bold text-red-500">
                  ${refundedAmount}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="island-shell">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Transactions</p>
                <p className="text-2xl font-bold text-[var(--sea-ink)]">
                  {payments.length}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-[var(--sea-ink)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="island-shell">
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="py-12 text-center">
              <DollarSign className="mx-auto mb-4 h-12 w-12 text-[var(--sea-ink-soft)]" />
              <p className="text-lg text-[var(--sea-ink-soft)]">
                No payments found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.bookingId}</TableCell>
                      <TableCell>{payment.customerId}</TableCell>
                      <TableCell>
                        {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${payment.amount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getPaymentStatusColor(payment.status)}
                          variant="secondary"
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.status === 'paid' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#ce0031] text-[#ce0031] hover:bg-[#ce0031] hover:text-white"
                            onClick={() => handleRefund(payment)}
                          >
                            <Undo className="mr-2 h-4 w-4" />
                            Refund
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPayment && (
        <RefundDialog
          paymentId={selectedPayment.id}
          amount={selectedPayment.amount}
          open={refundDialogOpen}
          onOpenChange={setRefundDialogOpen}
        />
      )}
    </div>
  )
}

import { Link } from '@tanstack/react-router'
import { DropdownMenuItem } from '#/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  Bed,
  Calendar,
  CreditCard,
  MessageSquare,
  BarChart3,
} from 'lucide-react'

export default function AdminNav() {
  return (
    <>
      <DropdownMenuItem asChild>
        <Link to="/admin/dashboard" className="cursor-pointer flex gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/admin/rooms" className="cursor-pointer flex gap-2">
          <Bed className="h-4 w-4" />
          Rooms
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/admin/bookings" className="cursor-pointer flex gap-2">
          <Calendar className="h-4 w-4" />
          Bookings
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/admin/payments" className="cursor-pointer flex gap-2">
          <CreditCard className="h-4 w-4" />
          Payments
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/admin/complaints" className="cursor-pointer flex gap-2">
          <MessageSquare className="h-4 w-4" />
          Complaints
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/admin/analytics" className="cursor-pointer flex gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </Link>
      </DropdownMenuItem>
    </>
  )
}

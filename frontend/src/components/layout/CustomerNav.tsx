import { Link } from '@tanstack/react-router'
import { DropdownMenuItem } from '#/components/ui/dropdown-menu'
import { Home, Bed, Calendar, User, CreditCard, MessageSquare } from 'lucide-react'

export default function CustomerNav() {
  return (
    <>
      <DropdownMenuItem asChild>
        <Link to="/customer/rooms" className="cursor-pointer flex gap-2">
          <Bed className="h-4 w-4" />
          Rooms
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/customer/bookings" className="cursor-pointer flex gap-2">
          <Calendar className="h-4 w-4" />
          My Bookings
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/customer/profile" className="cursor-pointer flex gap-2">
          <User className="h-4 w-4" />
          Profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/customer/payments" className="cursor-pointer flex gap-2">
          <CreditCard className="h-4 w-4" />
          Payments
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/customer/complaints" className="cursor-pointer flex gap-2">
          <MessageSquare className="h-4 w-4" />
          Complaints
        </Link>
      </DropdownMenuItem>
    </>
  )
}

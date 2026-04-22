import { useMemo } from 'react'
import { calculateNights, toISODate } from '#/lib/utils/formatters'

export interface BookingCalculationResult {
  numberOfNights: number
  totalAmount: number
  isValidDates: boolean
  isPastCheckIn: boolean
  isInvalidDateRange: boolean
}

export interface BookingDates {
  checkIn: string
  checkOut: string
}

/**
 * Shared hook for booking calculations
 * Calculates nights, total amount, and validates dates
 *
 * @param dates - Booking dates (checkIn and checkOut)
 * @param pricePerNight - Room price per night
 * @returns Booking calculation results
 */
export function useBookingCalculation(
  dates: BookingDates,
  pricePerNight: number
): BookingCalculationResult {
  const result = useMemo(() => {
    // Default result when dates are not provided
    if (!dates.checkIn || !dates.checkOut) {
      return {
        numberOfNights: 0,
        totalAmount: 0,
        isValidDates: false,
        isPastCheckIn: false,
        isInvalidDateRange: false,
      }
    }

    const checkInDate = new Date(dates.checkIn)
    const checkOutDate = new Date(dates.checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if check-in is in the past
    const isPastCheckIn = checkInDate < today

    // Check if check-out is before or same as check-in
    const isInvalidDateRange = checkOutDate <= checkInDate

    // If dates are invalid, return zero values
    if (isPastCheckIn || isInvalidDateRange) {
      return {
        numberOfNights: 0,
        totalAmount: 0,
        isValidDates: false,
        isPastCheckIn,
        isInvalidDateRange,
      }
    }

    // Calculate nights and total amount
    const numberOfNights = calculateNights(dates.checkIn, dates.checkOut)
    const totalAmount = numberOfNights * pricePerNight

    return {
      numberOfNights,
      totalAmount,
      isValidDates: true,
      isPastCheckIn: false,
      isInvalidDateRange: false,
    }
  }, [dates.checkIn, dates.checkOut, pricePerNight])

  return result
}

/**
 * Get minimum check-out date based on check-in date
 *
 * @param checkIn - Check-in date string
 * @returns Minimum check-out date as ISO string
 */
export function getMinCheckOutDate(checkIn: string): string {
  if (!checkIn) return ''
  const checkInDate = new Date(checkIn)
  checkInDate.setDate(checkInDate.getDate() + 1)
  return toISODate(checkInDate)
}

/**
 * Get today's date as ISO string (for min check-in date)
 *
 * @returns Today's date as ISO string
 */
export function getTodayDate(): string {
  return toISODate(new Date())
}

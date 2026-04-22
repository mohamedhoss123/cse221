import BaseService from './base.service'
import { buildEndpoint } from './base.service'
import type { Complaint } from '../types/booking.types'

export async function getComplaints(customerId?: string): Promise<Complaint[]> {
  const endpoint = buildEndpoint('/complaints', { customerId })
  const response = await BaseService.get<any[]>(endpoint)

  // Transform backend response to match frontend types
  return response.map((complaint: any) => ({
    ...complaint,
    // Map for backward compatibility
    customerId: complaint.visitorId,
    subject: complaint.type,
    message: complaint.description,
    // Add default values for missing fields
    status: complaint.status || 'open',
    response: complaint.response || '',
    createdAt: complaint.createdAt || new Date().toISOString()
  }))
}

export async function getComplaintById(id: string): Promise<Complaint> {
  return BaseService.get<Complaint>(`/complaints/${id}`)
}

export async function createComplaint(
  complaint: {
    description: string  // was 'message'
    type: string         // was 'subject'
  }
): Promise<Complaint> {
  // Map frontend fields to backend API contract
  const payload = {
    description: complaint.description,
    type: complaint.type
  }
  return BaseService.post<Complaint>('/complaints', payload)
}

export async function updateComplaint(
  id: string,
  updates: Partial<Complaint>
): Promise<Complaint> {
  return BaseService.put<Complaint>(`/complaints/${id}`, updates)
}

import BaseService from './base.service'
import { buildEndpoint } from './base.service'
import type { Complaint } from '../types/booking.types'

export async function getComplaints(customerId?: string): Promise<Complaint[]> {
  const endpoint = buildEndpoint('/complaints', { customerId })
  return BaseService.get<Complaint[]>(endpoint)
}

export async function getComplaintById(id: string): Promise<Complaint> {
  return BaseService.get<Complaint>(`/complaints/${id}`)
}

export async function createComplaint(
  complaint: Omit<Complaint, 'id' | 'createdAt'>
): Promise<Complaint> {
  return BaseService.post<Complaint>('/complaints', complaint)
}

export async function updateComplaint(
  id: string,
  updates: Partial<Complaint>
): Promise<Complaint> {
  return BaseService.put<Complaint>(`/complaints/${id}`, updates)
}

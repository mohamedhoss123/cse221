import { apiClient } from '../lib/api-client'
import type { Complaint } from '../types/booking.types'

export async function getComplaints(customerId?: string): Promise<Complaint[]> {
  try {
    const params = customerId ? { customerId } : {}
    const response = await apiClient.get<Complaint[]>('/complaints', { params })

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get complaints')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get complaints')
  }
}

export async function getComplaintById(id: string): Promise<Complaint> {
  try {
    const response = await apiClient.get<Complaint>(`/complaints/${id}`)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get complaint')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get complaint')
  }
}

export async function createComplaint(
  complaint: Omit<Complaint, 'id' | 'createdAt'>
): Promise<Complaint> {
  try {
    const response = await apiClient.post<Complaint>('/complaints', complaint)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create complaint')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create complaint')
  }
}

export async function updateComplaint(
  id: string,
  updates: Partial<Complaint>
): Promise<Complaint> {
  try {
    const response = await apiClient.put<Complaint>(`/complaints/${id}`, updates)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update complaint')
    }

    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update complaint')
  }
}

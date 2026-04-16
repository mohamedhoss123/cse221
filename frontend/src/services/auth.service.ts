import type { User, LoginCredentials, RegisterData } from '../types/auth.types'

interface AuthResponse {
  user: User
  token: string
}

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hotel.com',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'customer@hotel.com',
    name: 'John Customer',
    role: 'customer',
  },
]

const mockPasswords: Record<string, string> = {
  'admin@hotel.com': 'admin123',
  'customer@hotel.com': 'customer123',
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  await delay(500)

  const user = mockUsers.find(u => u.email === credentials.email)

  if (!user || mockPasswords[credentials.email] !== credentials.password) {
    throw new Error('Invalid email or password')
  }

  const token = `mock_token_${user.id}_${Date.now()}`

  return {
    user,
    token,
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  await delay(500)

  const existingUser = mockUsers.find(u => u.email === data.email)
  if (existingUser) {
    throw new Error('Email already registered')
  }

  const newUser: User = {
    id: `${mockUsers.length + 1}`,
    email: data.email,
    name: data.name,
    role: 'customer',
  }

  mockUsers.push(newUser)
  mockPasswords[data.email] = data.password

  const token = `mock_token_${newUser.id}_${Date.now()}`

  return {
    user: newUser,
    token,
  }
}

export async function logout(): Promise<void> {
  await delay(200)
  // In a real app, this would invalidate the token on the server
}

export async function getCurrentUser(): Promise<User> {
  await delay(300)
  // In a real app, this would validate the token and return the current user
  throw new Error('Not implemented')
}

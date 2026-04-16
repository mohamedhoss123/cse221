// This file is for reference - users are managed in auth.service.ts
// The mock users are:
// Admin: admin@hotel.com / admin123
// Customer: customer@hotel.com / customer123

export const mockUserCredentials = {
  admin: {
    email: 'admin@hotel.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
  },
  customer: {
    email: 'customer@hotel.com',
    password: 'customer123',
    name: 'John Customer',
    role: 'customer' as const,
  },
}

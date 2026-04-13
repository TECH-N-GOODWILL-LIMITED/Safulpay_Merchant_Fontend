import type { User } from '../types'

export const mockUser: User = {
  id: 1,
  name: 'techengood',
  phone_number: '23278057664',
  email: 'info@techengood.com',
  profile_photo: '',
  is_verified: true,
}

export const mockLoginResponse = {
  status: true,
  data: {
    token: 'mock-jwt-token-safulpay-merchant-dev',
    user: mockUser,
  },
}

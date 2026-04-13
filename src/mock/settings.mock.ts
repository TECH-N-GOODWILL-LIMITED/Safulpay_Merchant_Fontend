import type { ApiKeyData, ProfileData, TwoFactorStatus } from '../types'

export const mockProfile: ProfileData = {
  business_name: "TECH'N GOODWIL LTD",
  username: 'techengood',
  email: 'info@techengood.com',
  mobile: '23278057664',
  country: 'Sierra Leone',
  first_name: 'Tech',
  last_name: 'Goodwil',
  address: 'Freetown',
  state: 'Western Area',
  zip: '000',
  city: 'Freetown',
  profile_image_url: '',
}

export const mockProfileResponse = {
  status: true,
  data: mockProfile,
}

export const mock2FAStatus: TwoFactorStatus = {
  enabled: false,
  secret: '6MMP2ZKXKSQXPVEU',
}

export const mock2FAResponse = {
  status: true,
  data: mock2FAStatus,
}

export const mockQRCode = {
  status: true,
  data: {
    qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=SafulPayMerchant',
  },
}

export const mockApiKeys: ApiKeyData = {
  bearer_token: 'sk_live_mock_bearer_token_' + 'x'.repeat(32),
  refresh_token: 'rt_mock_refresh_' + 'y'.repeat(24),
}

export const mockApiKeysResponse = {
  status: true,
  data: mockApiKeys,
}

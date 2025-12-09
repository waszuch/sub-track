export const testUser = {
  email: 'test@example.com',
  password: 'Test123!@#',
  name: 'Test User',
};

export const newUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'NewUser123!@#',
  name: 'New Test User',
};

export const testSubscriptions = {
  netflix: {
    name: 'Netflix',
    price: '49.99',
    currency: 'PLN',
    category: 'Entertainment',
    billingCycle: 'monthly',
    startDate: '2024-01-01',
    notes: 'Premium plan',
  },
  spotify: {
    name: 'Spotify',
    price: '19.99',
    currency: 'PLN',
    category: 'Music',
    billingCycle: 'monthly',
    startDate: '2024-01-01',
    notes: 'Individual plan',
  },
  github: {
    name: 'GitHub Pro',
    price: '4',
    currency: 'USD',
    category: 'Software',
    billingCycle: 'monthly',
    startDate: '2024-01-01',
  },
};

export const invalidCredentials = {
  email: 'invalid@example.com',
  password: 'wrongpassword',
};


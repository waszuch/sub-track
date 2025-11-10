export type Subscription = {
  id: string;
  userId: string;
  name: string;
  priceMonthly: string;
  currency: string;
  category?: string | null;
  nextPaymentDate?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionInput = {
  name: string;
  priceMonthly: string;
  currency: string;
  category?: string;
  nextPaymentDate?: Date;
  active: boolean;
};


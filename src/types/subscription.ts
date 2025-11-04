export type Subscription = {
  id: string;
  name: string;
  priceMonthly: number;
  currency: string;
  category?: string;
  nextPaymentDate?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
};


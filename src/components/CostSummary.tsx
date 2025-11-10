'use client';

import { Subscription } from '@/types/subscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface CostSummaryProps {
  subscriptions: Subscription[];
}

export function CostSummary({ subscriptions }: CostSummaryProps) {
  const totalCost = subscriptions
    .filter((sub) => sub.active)
    .reduce((sum, sub) => {
      const price = parseFloat(sub.priceMonthly);
      if (sub.currency === 'USD') return sum + price;
      if (sub.currency === 'EUR') return sum + price * 1.1;
      if (sub.currency === 'GBP') return sum + price * 1.27;
      if (sub.currency === 'PLN') return sum + price * 0.25;
      return sum + price;
    }, 0);

  const currencies = subscriptions.reduce((acc, sub) => {
    if (!acc[sub.currency]) {
      acc[sub.currency] = 0;
    }
    acc[sub.currency] += parseFloat(sub.priceMonthly);
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm md:text-base font-medium">
          Total Monthly Cost
        </CardTitle>
        <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl font-bold">
          ${totalCost.toFixed(2)}
        </div>
        <div className="mt-3 space-y-1">
          {Object.entries(currencies).map(([currency, amount]) => (
            <p key={currency} className="text-xs text-muted-foreground">
              {amount.toFixed(2)} {currency}
            </p>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {subscriptions.length} active subscription{subscriptions.length !== 1 ? 's' : ''}
        </p>
      </CardContent>
    </Card>
  );
}


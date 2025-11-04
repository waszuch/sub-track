'use client';

import { Subscription } from '@/types/subscription';
import { CreditCard } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SettingsDialog } from '@/components/SettingsDialog';

interface HeaderProps {
  subscriptions: Subscription[];
}

export function Header({ subscriptions }: HeaderProps) {
  const totalCost = subscriptions
    .filter((sub) => sub.active)
    .reduce((sum, sub) => {
      if (sub.currency === 'USD') return sum + sub.priceMonthly;
      if (sub.currency === 'EUR') return sum + sub.priceMonthly * 1.1;
      if (sub.currency === 'GBP') return sum + sub.priceMonthly * 1.27;
      if (sub.currency === 'PLN') return sum + sub.priceMonthly * 0.25;
      return sum + sub.priceMonthly;
    }, 0);

  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">SubTrack</h1>
              <p className="text-sm text-muted-foreground">
                Track your subscriptions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Monthly</p>
              <p className="text-3xl font-bold">${totalCost.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <SettingsDialog />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


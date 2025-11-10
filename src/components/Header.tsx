'use client';

import { Subscription } from '@/types/subscription';
import { CreditCard, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SettingsDialog } from '@/components/SettingsDialog';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  subscriptions: Subscription[];
}

export function Header({ subscriptions }: HeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();

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

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

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
            {session?.user && (
              <div className="text-right">
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">{session.user.email}</p>
              </div>
            )}
            <div className="flex gap-2">
              <ThemeToggle />
              <SettingsDialog />
              {session?.user && (
                <Button variant="outline" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import { Subscription } from '@/types/subscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface SubscriptionCardProps {
  subscription: Subscription;
  onDelete: (id: string) => void;
}

export function SubscriptionCard({ subscription, onDelete }: SubscriptionCardProps) {
  return (
    <Card className="relative transition-all hover:shadow-lg hover:scale-[1.02] duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base md:text-lg truncate">{subscription.name}</CardTitle>
            {subscription.category && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {subscription.category}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(subscription.id)}
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end gap-3">
          <div>
            <p className="text-xl md:text-2xl font-bold">
              {subscription.priceMonthly} {subscription.currency}
            </p>
            <p className="text-xs text-muted-foreground">per month</p>
          </div>
          {subscription.nextPaymentDate && (
            <div className="text-right">
              <p className="text-xs md:text-sm text-muted-foreground">Next payment</p>
              <p className="text-xs md:text-sm font-medium">
                {format(new Date(subscription.nextPaymentDate), 'MMM dd, yyyy')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


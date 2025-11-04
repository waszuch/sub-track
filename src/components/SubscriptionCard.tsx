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
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{subscription.name}</CardTitle>
            {subscription.category && (
              <Badge variant="secondary" className="mt-2">
                {subscription.category}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(subscription.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold">
              {subscription.priceMonthly} {subscription.currency}
            </p>
            <p className="text-xs text-muted-foreground">per month</p>
          </div>
          {subscription.nextPaymentDate && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next payment</p>
              <p className="text-sm font-medium">
                {format(new Date(subscription.nextPaymentDate), 'MMM dd, yyyy')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


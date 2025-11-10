'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { SubscriptionInput } from '@/types/subscription';

interface AddSubscriptionDialogProps {
  onAdd: (subscription: SubscriptionInput) => void;
}

const CATEGORIES = [
  'Entertainment',
  'Software',
  'Music',
  'Cloud Storage',
  'Gaming',
  'News',
  'Fitness',
  'Education',
  'Other',
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'PLN'];

export function AddSubscriptionDialog({ onAdd }: AddSubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    priceMonthly: '',
    currency: 'USD',
    category: '',
    nextPaymentDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.priceMonthly) {
      return;
    }

    onAdd({
      name: formData.name,
      priceMonthly: formData.priceMonthly,
      currency: formData.currency,
      category: formData.category || undefined,
      nextPaymentDate: formData.nextPaymentDate ? new Date(formData.nextPaymentDate + 'T00:00:00') : undefined,
      active: true,
    });

    setFormData({
      name: '',
      priceMonthly: '',
      currency: 'USD',
      category: '',
      nextPaymentDate: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Add Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Enter the details of your new subscription.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Netflix, Spotify..."
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Monthly Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="9.99"
                value={formData.priceMonthly}
                onChange={(e) =>
                  setFormData({ ...formData, priceMonthly: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  setFormData({ ...formData, currency: value })
                }
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextPayment">Next Payment Date</Label>
            <Input
              id="nextPayment"
              type="date"
              value={formData.nextPaymentDate}
              onChange={(e) =>
                setFormData({ ...formData, nextPaymentDate: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Subscription</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


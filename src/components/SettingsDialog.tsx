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
import { Settings, Download, Upload } from 'lucide-react';
import { Subscription } from '@/types/subscription';
import { useSubscriptions } from '@/hooks/useSubscriptions';

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const { subscriptions, addSubscription } = useSubscriptions();

  const handleExport = () => {
    const dataStr = JSON.stringify(subscriptions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subtrack-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string) as Subscription[];
        if (Array.isArray(importedData)) {
          importedData.forEach((sub) => {
            addSubscription({
              name: sub.name,
              priceMonthly: typeof sub.priceMonthly === 'string' 
                ? sub.priceMonthly 
                : String(sub.priceMonthly),
              currency: sub.currency,
              category: sub.category || undefined,
              nextPaymentDate: sub.nextPaymentDate 
                ? new Date(sub.nextPaymentDate) 
                : undefined,
              active: sub.active,
            });
          });
          setOpen(false);
        }
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Export or import your subscription data
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <h3 className="font-medium">Export Data</h3>
            <p className="text-sm text-muted-foreground">
              Download your subscriptions as a JSON file
            </p>
            <Button onClick={handleExport} className="w-full gap-2">
              <Download className="h-4 w-4" />
              Export Subscriptions
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Import Data</h3>
            <p className="text-sm text-muted-foreground">
              Upload a JSON file to import subscriptions
            </p>
            <Button
              onClick={() => document.getElementById('file-import')?.click()}
              variant="outline"
              className="w-full gap-2"
            >
              <Upload className="h-4 w-4" />
              Import Subscriptions
            </Button>
            <input
              id="file-import"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


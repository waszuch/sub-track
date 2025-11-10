'use client';

import { Subscription } from '@/types/subscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface CostByCategoryProps {
  subscriptions: Subscription[];
}

const COLORS = [
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#f43f5e',
  '#14b8a6',
  '#f97316',
  '#6366f1',
];

export function CostByCategory({ subscriptions }: CostByCategoryProps) {
  const categoryData = subscriptions
    .filter((sub) => sub.active && sub.category)
    .reduce((acc, sub) => {
      const category = sub.category || 'Other';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(sub.priceMonthly);
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm md:text-base">Cost by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] md:h-[300px] text-sm text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm md:text-base">Cost by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250} className="md:!h-[300px]">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => {
                const total = chartData.reduce((sum, item) => sum + item.value, 0);
                const percent = ((value / total) * 100).toFixed(1);
                return [`$${value.toFixed(2)} (${percent}%)`, name];
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


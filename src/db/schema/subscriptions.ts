import { AnyPgColumn, pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { users } from './users';

export const subscriptions = table('subscriptions', {
  id: t.uuid().primaryKey().defaultRandom(),
  userId: t.text('user_id').notNull().references((): AnyPgColumn => users.id, { onDelete: 'cascade' }),
  name: t.text().notNull(),
  priceMonthly: t.numeric('price_monthly', { precision: 10, scale: 2 }).notNull(),
  currency: t.text().notNull().default('USD'),
  category: t.text(),
  nextPaymentDate: t.timestamp('next_payment_date'),
  active: t.boolean().notNull().default(true),
  createdAt: t.timestamp('created_at').notNull().defaultNow(),
  updatedAt: t.timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  t.index('subscriptions_user_id_idx').on(table.userId),
]);


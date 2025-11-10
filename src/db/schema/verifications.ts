import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const verifications = table('verification', {
  id: t.text().primaryKey(),
  identifier: t.text().notNull(),
  value: t.text().notNull(),
  expiresAt: t.timestamp().notNull(),
  createdAt: t.timestamp().defaultNow(),
  updatedAt: t.timestamp().defaultNow(),
});


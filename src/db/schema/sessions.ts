import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { timestamps } from './helpers';
import { users } from './users';

export const sessions = table('session', {
  id: t.text().primaryKey(),
  expiresAt: t.timestamp().notNull(),
  token: t.text().notNull(),
  ipAddress: t.text(),
  userAgent: t.text(),
  userId: t.text().notNull().references(() => users.id, { onDelete: 'cascade' }),
  ...timestamps,
}, (table) => [
  t.uniqueIndex('session_token_idx').on(table.token),
  t.index('session_user_id_idx').on(table.userId),
]);


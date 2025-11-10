import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { timestamps } from './helpers';
import { users } from './users';

export const accounts = table('account', {
  id: t.text().primaryKey(),
  accountId: t.text().notNull(),
  providerId: t.text().notNull(),
  userId: t.text().notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: t.text(),
  refreshToken: t.text(),
  idToken: t.text(),
  accessTokenExpiresAt: t.timestamp(),
  refreshTokenExpiresAt: t.timestamp(),
  scope: t.text(),
  password: t.text(),
  ...timestamps,
}, (table) => [
  t.index('account_user_id_idx').on(table.userId),
]);


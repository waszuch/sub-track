import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { timestamps } from './helpers';

export const users = table('user', {
  id: t.text().primaryKey(),
  name: t.text().notNull(),
  email: t.text().notNull(),
  emailVerified: t.boolean().notNull().default(false),
  image: t.text(),
  ...timestamps,
}, (table) => [
  t.uniqueIndex('user_email_idx').on(table.email),
]);


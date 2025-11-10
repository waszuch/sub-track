import * as t from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: t.timestamp('createdAt').notNull().defaultNow(),
  updatedAt: t.timestamp('updatedAt').notNull().defaultNow(),
};


import { describe, it, expect, vi } from 'vitest';
import { subscriptionsRouter } from '../subscriptions';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      subscriptions: {
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('subscriptionsRouter - Schema Validation', () => {
  it('should define getAll procedure', () => {
    expect(subscriptionsRouter._def.procedures.getAll).toBeDefined();
  });

  it('should define create procedure', () => {
    expect(subscriptionsRouter._def.procedures.create).toBeDefined();
  });

  it('should define update procedure', () => {
    expect(subscriptionsRouter._def.procedures.update).toBeDefined();
  });

  it('should define delete procedure', () => {
    expect(subscriptionsRouter._def.procedures.delete).toBeDefined();
  });
});


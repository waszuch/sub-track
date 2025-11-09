import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/lib/db';
import { subscriptions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const subscriptionInput = z.object({
  name: z.string().min(1),
  priceMonthly: z.string(),
  currency: z.string().default('USD'),
  category: z.string().optional(),
  nextPaymentDate: z.coerce.date().optional(),
  active: z.boolean().default(true),
});

export const subscriptionsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await db.query.subscriptions.findMany({
      where: eq(subscriptions.userId, userId),
      orderBy: (subscriptions, { desc }) => [desc(subscriptions.createdAt)],
    });
  }),

  create: protectedProcedure
    .input(subscriptionInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [subscription] = await db
        .insert(subscriptions)
        .values({
          name: input.name,
          priceMonthly: input.priceMonthly,
          currency: input.currency,
          category: input.category,
          nextPaymentDate: input.nextPaymentDate,
          active: input.active,
          userId,
        })
        .returning();
      return subscription;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: subscriptionInput.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const updateData: Record<string, any> = {
        updatedAt: new Date(),
      };
      
      if (input.data.name !== undefined) updateData.name = input.data.name;
      if (input.data.priceMonthly !== undefined) updateData.priceMonthly = input.data.priceMonthly;
      if (input.data.currency !== undefined) updateData.currency = input.data.currency;
      if (input.data.category !== undefined) updateData.category = input.data.category;
      if (input.data.nextPaymentDate !== undefined) updateData.nextPaymentDate = input.data.nextPaymentDate;
      if (input.data.active !== undefined) updateData.active = input.data.active;
      
      const [subscription] = await db
        .update(subscriptions)
        .set(updateData)
        .where(
          and(
            eq(subscriptions.id, input.id),
            eq(subscriptions.userId, userId)
          )
        )
        .returning();
      return subscription;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.id, input.id),
            eq(subscriptions.userId, userId)
          )
        );
      return { success: true };
    }),
});


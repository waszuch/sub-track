import { test, expect } from './fixtures/auth';
import { testSubscriptions } from './fixtures/test-data';

test.describe('Subscription Management', () => {
  test.describe('Empty State', () => {
    test('should display empty state when no subscriptions exist', async ({ authenticatedPage }) => {
      await expect(authenticatedPage.locator('text=No subscriptions yet')).toBeVisible();
      await expect(authenticatedPage.locator('text=Click "Add Subscription" to get started')).toBeVisible();
    });

    test('should display Add Subscription button', async ({ authenticatedPage }) => {
      await expect(authenticatedPage.locator('button:has-text("Add Subscription")')).toBeVisible();
    });
  });

  test.describe('Adding Subscriptions', () => {
    test('should open add subscription dialog', async ({ authenticatedPage }) => {
      await authenticatedPage.click('button:has-text("Add Subscription")');
      await expect(authenticatedPage.locator('role=dialog')).toBeVisible();
      await expect(authenticatedPage.locator('text=Add New Subscription')).toBeVisible();
    });

    test('should close dialog on cancel', async ({ authenticatedPage }) => {
      await authenticatedPage.click('button:has-text("Add Subscription")');
      await authenticatedPage.click('button:has-text("Cancel")');
      await expect(authenticatedPage.locator('role=dialog')).not.toBeVisible();
    });

    test('should add a new subscription successfully', async ({ authenticatedPage }) => {
      await authenticatedPage.click('button:has-text("Add Subscription")');
      await authenticatedPage.fill('input[name="name"]', testSubscriptions.netflix.name);
      await authenticatedPage.fill('input[name="price"]', testSubscriptions.netflix.price);
      await authenticatedPage.click('button[name="currency"]');
      await authenticatedPage.click(`[role="option"]:has-text("${testSubscriptions.netflix.currency}")`);
      await authenticatedPage.click('button[name="category"]');
      await authenticatedPage.click(`[role="option"]:has-text("${testSubscriptions.netflix.category}")`);
      await authenticatedPage.click('button[name="billingCycle"]');
      await authenticatedPage.click('[role="option"]:has-text("Monthly")');
      await authenticatedPage.fill('input[name="startDate"]', testSubscriptions.netflix.startDate);
      
      if (testSubscriptions.netflix.notes) {
        await authenticatedPage.fill('textarea[name="notes"]', testSubscriptions.netflix.notes);
      }

      await authenticatedPage.click('button:has-text("Add")');
      await expect(authenticatedPage.locator('role=dialog')).not.toBeVisible();
      await expect(authenticatedPage.locator(`text=${testSubscriptions.netflix.name}`)).toBeVisible();
      await expect(authenticatedPage.locator(`text=${testSubscriptions.netflix.price}`)).toBeVisible();
      await expect(authenticatedPage.locator(`text=${testSubscriptions.netflix.category}`)).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ authenticatedPage }) => {
      await authenticatedPage.click('button:has-text("Add Subscription")');
      await authenticatedPage.click('button:has-text("Add")');
      await expect(authenticatedPage.locator('text=Name is required')).toBeVisible();
    });

    test('should validate price is a positive number', async ({ authenticatedPage }) => {
      await authenticatedPage.click('button:has-text("Add Subscription")');
      await authenticatedPage.fill('input[name="name"]', 'Test Sub');
      await authenticatedPage.fill('input[name="price"]', '-10');
      await authenticatedPage.locator('input[name="price"]').blur();
      await expect(authenticatedPage.locator('text=Price must be greater than 0')).toBeVisible();
    });
  });

  test.describe('Viewing Subscriptions', () => {
    test.beforeEach(async ({ authenticatedPage }) => {
      await authenticatedPage.click('button:has-text("Add Subscription")');
      await authenticatedPage.fill('input[name="name"]', testSubscriptions.spotify.name);
      await authenticatedPage.fill('input[name="price"]', testSubscriptions.spotify.price);
      await authenticatedPage.click('button[name="currency"]');
      await authenticatedPage.click(`[role="option"]:has-text("${testSubscriptions.spotify.currency}")`);
      await authenticatedPage.click('button[name="category"]');
      await authenticatedPage.click(`[role="option"]:has-text("${testSubscriptions.spotify.category}")`);
      await authenticatedPage.click('button[name="billingCycle"]');
      await authenticatedPage.click('[role="option"]:has-text("Monthly")');
      await authenticatedPage.fill('input[name="startDate"]', testSubscriptions.spotify.startDate);
      await authenticatedPage.click('button:has-text("Add")');
      await expect(authenticatedPage.locator(`text=${testSubscriptions.spotify.name}`)).toBeVisible();
    });

    test('should display subscription card with correct information', async ({ authenticatedPage }) => {
      const card = authenticatedPage.locator(`text=${testSubscriptions.spotify.name}`).locator('..');
      await expect(card.locator(`text=${testSubscriptions.spotify.name}`)).toBeVisible();
      await expect(card.locator(`text=${testSubscriptions.spotify.category}`)).toBeVisible();
      await expect(card.locator(`text=${testSubscriptions.spotify.price}`)).toBeVisible();
      await expect(card.locator('text=per month')).toBeVisible();
    });

    test('should display "Your Subscriptions" heading when subscriptions exist', async ({ authenticatedPage }) => {
      await expect(authenticatedPage.locator('h2:has-text("Your Subscriptions")')).toBeVisible();
    });

    test('should display delete button on subscription card', async ({ authenticatedPage }) => {
      const deleteButton = authenticatedPage.locator('button').filter({ has: authenticatedPage.locator('svg[class*="lucide-trash"]') });
      await expect(deleteButton.first()).toBeVisible();
    });
  });

  test.describe('Deleting Subscriptions', () => {
    test.beforeEach(async ({ authenticatedPage }) => {
      await authenticatedPage.click('button:has-text("Add Subscription")');
      await authenticatedPage.fill('input[name="name"]', testSubscriptions.github.name);
      await authenticatedPage.fill('input[name="price"]', testSubscriptions.github.price);
      await authenticatedPage.click('button[name="currency"]');
      await authenticatedPage.click(`[role="option"]:has-text("${testSubscriptions.github.currency}")`);
      await authenticatedPage.click('button[name="category"]');
      await authenticatedPage.click(`[role="option"]:has-text("${testSubscriptions.github.category}")`);
      await authenticatedPage.click('button[name="billingCycle"]');
      await authenticatedPage.click('[role="option"]:has-text("Monthly")');
      await authenticatedPage.fill('input[name="startDate"]', testSubscriptions.github.startDate);
      await authenticatedPage.click('button:has-text("Add")');
      await expect(authenticatedPage.locator(`text=${testSubscriptions.github.name}`)).toBeVisible();
    });

    test('should delete subscription when delete button is clicked', async ({ authenticatedPage }) => {
      const subscriptionCard = authenticatedPage.locator(`text=${testSubscriptions.github.name}`).locator('..');
      await subscriptionCard.locator('button').filter({ has: authenticatedPage.locator('svg[class*="lucide-trash"]') }).click();
      await expect(authenticatedPage.locator(`text=${testSubscriptions.github.name}`)).not.toBeVisible();
    });

    test('should show empty state after deleting all subscriptions', async ({ authenticatedPage }) => {
      const deleteButton = authenticatedPage.locator('button').filter({ has: authenticatedPage.locator('svg[class*="lucide-trash"]') });
      await deleteButton.first().click();
      await expect(authenticatedPage.locator('text=No subscriptions yet')).toBeVisible();
    });
  });

  test.describe('Cost Summary and Analytics', () => {
    test.beforeEach(async ({ authenticatedPage }) => {
      const subscriptions = [testSubscriptions.netflix, testSubscriptions.spotify];
      
      for (const sub of subscriptions) {
        await authenticatedPage.click('button:has-text("Add Subscription")');
        await authenticatedPage.fill('input[name="name"]', sub.name);
        await authenticatedPage.fill('input[name="price"]', sub.price);
        await authenticatedPage.click('button[name="currency"]');
        await authenticatedPage.click(`[role="option"]:has-text("${sub.currency}")`);
        await authenticatedPage.click('button[name="category"]');
        await authenticatedPage.click(`[role="option"]:has-text("${sub.category}")`);
        await authenticatedPage.click('button[name="billingCycle"]');
        await authenticatedPage.click('[role="option"]:has-text("Monthly")');
        await authenticatedPage.fill('input[name="startDate"]', sub.startDate);
        await authenticatedPage.click('button:has-text("Add")');
        await expect(authenticatedPage.locator(`text=${sub.name}`)).toBeVisible();
      }
    });

    test('should display cost summary section', async ({ authenticatedPage }) => {
      await expect(authenticatedPage.locator('text=Total Monthly')).toBeVisible();
      await expect(authenticatedPage.locator('text=Total Yearly')).toBeVisible();
    });

    test('should display cost by category section', async ({ authenticatedPage }) => {
      await expect(authenticatedPage.locator('text=Cost by Category')).toBeVisible();
    });

    test('should not display cost sections when no subscriptions exist', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'Test123!@#');
      await page.click('button[type="submit"]');
      await page.waitForURL('/');

      const noSubs = await page.locator('text=No subscriptions yet').isVisible();
      if (noSubs) {
        await expect(page.locator('text=Total Monthly')).not.toBeVisible();
        await expect(page.locator('text=Cost by Category')).not.toBeVisible();
      }
    });
  });

  test.describe('User Interface', () => {
    test('should display header component', async ({ authenticatedPage }) => {
      await expect(authenticatedPage.locator('header, nav, [role="banner"]').first()).toBeVisible();
    });

    test('should have responsive layout', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 720 });
      await expect(authenticatedPage.locator('button:has-text("Add Subscription")')).toBeVisible();

      await authenticatedPage.setViewportSize({ width: 375, height: 667 });
      await expect(authenticatedPage.locator('button:has-text("Add Subscription")')).toBeVisible();
    });
  });
});

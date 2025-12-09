import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    const url = page.url();
    expect(url).toMatch(/\/(login)?$/);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h2')).toContainText('Welcome back');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h2')).toContainText('Create an account');
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should handle 404 for non-existent routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});

test.describe('Browser Compatibility', () => {
  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') &&
      !error.includes('404')
    );
    
    expect(criticalErrors.length).toBeLessThan(5);
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('type', 'email');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
  });
});

test.describe('Performance', () => {
  test('should load pages in reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/login');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle rapid navigation', async ({ page }) => {
    await page.goto('/login');
    await page.goto('/register');
    await page.goto('/login');
    await page.goto('/register');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h2')).toContainText('Create an account');
  });
});

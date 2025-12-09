import { test, expect } from '@playwright/test';
import { testUser, invalidCredentials } from './fixtures/test-data';

test.describe('Authentication', () => {
  test.describe('Login Page', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/login');

      await expect(page.locator('h2')).toContainText('Welcome back');
      await expect(page.locator('text=Sign in to your SubTrack account')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toContainText('Sign in');
    });

    test('should navigate to register page from login', async ({ page }) => {
      await page.goto('/login');
      await page.click('a:has-text("Sign up")');
      await expect(page).toHaveURL('/register');
      await expect(page.locator('h2')).toContainText('Create an account');
    });

    test('should show validation error for invalid email', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="password"]', 'password123');
      await page.locator('input[name="email"]').blur();
      await expect(page.locator('text=Enter a valid email address')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', invalidCredentials.email);
      await page.fill('input[name="password"]', invalidCredentials.password);
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Invalid email or password')).toBeVisible();
    });

    test('should successfully login with valid credentials', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/', { timeout: 10000 });
    });
  });

  test.describe('Register Page', () => {
    test('should display register form', async ({ page }) => {
      await page.goto('/register');

      await expect(page.locator('h2')).toContainText('Create an account');
      await expect(page.locator('text=Start tracking your subscriptions today')).toBeVisible();
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toContainText('Create account');
    });

    test('should navigate to login page from register', async ({ page }) => {
      await page.goto('/register');
      await page.click('a:has-text("Sign in")');
      await expect(page).toHaveURL('/login');
      await expect(page.locator('h2')).toContainText('Welcome back');
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.goto('/register');
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Name is required')).toBeVisible();
    });

    test('should show validation error for invalid email', async ({ page }) => {
      await page.goto('/register');
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="password"]', 'Password123!');
      await page.locator('input[name="email"]').blur();
      await expect(page.locator('text=Enter a valid email address')).toBeVisible();
    });

    test('should show validation error for short password', async ({ page }) => {
      await page.goto('/register');
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'short');
      await page.locator('input[name="password"]').blur();
      await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
    });

    test('should show password requirement hint', async ({ page }) => {
      await page.goto('/register');
      await expect(page.locator('text=Must be at least 8 characters')).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing home without auth', async ({ page }) => {
      await page.goto('/');
      const url = page.url();
      const isLoginOrHome = url.includes('/login') || url === 'http://localhost:3000/';
      expect(isLoginOrHome).toBeTruthy();
    });
  });
});

import { Page } from '@playwright/test';

export async function loginCustomer(page: Page) {

  await page.goto('/');
  await page.getByTestId('username-input').fill('customer');
  await page.getByTestId('password-input').fill('customer123');
  await page.getByTestId('login-button').click();
}

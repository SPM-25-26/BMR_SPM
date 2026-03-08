import { test, expect, type Page } from '@playwright/test';

async function seedAuth(
  page: Page,
  user: { name: string; userName: string; email: string; emailConfirmed: boolean } | null,
  userPreferences: { interests: string[]; travelStyle: string; dietaryNeeds: string[] } | null,
  token = 'demo-token'
): Promise<void> {
  await page.addInitScript(
    ({ userArg, preferencesArg, tokenArg }) => {
      localStorage.clear();

      if (userArg) {
        localStorage.setItem('authenticatedUser', JSON.stringify(userArg));
        localStorage.setItem('authToken', tokenArg);
      }

      if (preferencesArg) {
        localStorage.setItem('STORAGE_USERPREFERENCES_KEY', JSON.stringify(preferencesArg));
      }
    },
    { userArg: user, preferencesArg: userPreferences, tokenArg: token }
  );
}

test('user not authenticated: / -> /welcome', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/welcome$/);
});

test('authenticated user with unconfirmed email: / -> /needs-verification', async ({ page }) => {
  await seedAuth(
    page,
    {
      name: 'Mario Rossi',
      userName: 'mrossi',
      email: 'mario.rossi@example.com',
      emailConfirmed: false,
    },
    null
  );

  await page.goto('/');

  const storageState = await page.context().storageState();
  console.log('E2E storageState:', JSON.stringify(storageState.origins, null, 2));

  const lsDump = await page.evaluate(() => ({
    authenticatedUser: localStorage.getItem('authenticatedUser'),
    userPreferences: localStorage.getItem('userPreferences'),
    authToken: localStorage.getItem('authToken'),
  }));
  console.log('E2E localStorage dump:', lsDump);

  await expect(page).toHaveURL(/\/needs-verification$/);
});

test('confirmed user without preferences: / -> /onboarding', async ({ page }) => {
  await seedAuth(
    page,
    {
      name: 'Mario Rossi',
      userName: 'mrossi',
      email: 'mario.rossi@example.com',
      emailConfirmed: true,
    },
    {
      interests: [],
      travelStyle: '',
      dietaryNeeds: [],
    }
  );

  await page.goto('/');
  await expect(page).toHaveURL(/\/onboarding$/);
});
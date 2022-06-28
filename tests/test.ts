import { test } from '@playwright/test';

test('index page exists', async ({ page }) => {
	await page.goto('/');
});

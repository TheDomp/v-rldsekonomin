import { test, expect } from '@playwright/test';

test.describe('Economic Views', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the home page before each test
        await page.goto('/');
    });

    test('PowerhouseView renders correctly', async ({ page }) => {
        // Check for the "Ekonomiska Stormakter" header
        await expect(page.getByText('Ekonomiska Stormakter')).toBeVisible();

        // Check for the 4 powerhouse cards
        await expect(page.getByText('USA')).toBeVisible();
        await expect(page.getByText('Kina')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'EU', exact: true })).toBeVisible();
        await expect(page.getByText('Ryssland')).toBeVisible();

        // Check for metrics labels (Growth, Inflation, Debt)
        // We check if "Tillväxt" appears at least once
        await expect(page.getByText('Tillväxt').first()).toBeVisible();
        await expect(page.getByText('Inflation').first()).toBeVisible();
        await expect(page.getByText('Statsskuld').first()).toBeVisible();
    });

    test('PowerhouseView handles data loading', async ({ page }) => {
        // We might see "Hämtar..." initially, or data if it loads fast.
        // This test is a bit flaky if we don't mock, but let's check for eventual data or loading state.
        // We can check that at least one card eventually shows a health index or "Data Saknas"

        // Evaluate if we can find a status indicator (e.g. /100 or Data Saknas)
        // The status is in a span with class containing 'rounded-full'
        // Let's just wait for the "Tillväxt" value to be populated or "Saknas"

        // Ideally we would mock the API response here for deterministic testing.
        // For now, we just ensure the view validates existence of key elements.

        const usaCard = page.locator('div').filter({ hasText: 'USA' }).first();
        await expect(usaCard).toBeVisible();

        // Check that we eventually see some data or the "Saknas" text
        // The growth value is formatted as "X.X%" or "Saknas"
        const growthValue = usaCard.locator('.font-mono').first();
        await expect(growthValue).toBeVisible();
    });

    test('FiscalRunway renders correctly', async ({ page }) => {
        // Wait for data to load (spinner should disappear)
        // Wait for country cards to appear (handles loading state)
        // Check for specific text to ensure we are looking at the right thing
        const countryCards = page.locator('.group.relative.overflow-hidden');
        await expect(countryCards.first()).toBeVisible({ timeout: 30000 });

        // Now check for FiscalRunway text "Likviditetsreserv" within a card
        const liquidityText = countryCards.first().locator('text=Likviditetsreserv');
        await expect(liquidityText).toBeVisible();

        // Check if the progress bar exists
        const progressBar = countryCards.first().locator('.h-2.w-full.bg-slate-700');
        await expect(progressBar).toBeVisible();
    });

    test('DetailView opens on card click', async ({ page }) => {
        // Wait for cards
        const countryCards = page.locator('.group.relative.overflow-hidden');
        await expect(countryCards.first()).toBeVisible({ timeout: 30000 });

        // Get the name of the first country to verify later
        const firstCard = countryCards.first();
        const countryName = await firstCard.locator('h2').textContent();

        // Click the card
        await firstCard.click();

        // Check that DetailView overlay appears
        // It usually has a close button or specific modal class.
        // Looking at App.tsx, DetailView is rendered when selectedCountry is not null.
        // Let's look for the country name in a dialog/modal context.

        // We can assume the DetailView shows the country name prominently inside a fixed overlay
        const detailView = page.locator('.fixed.inset-0.z-50');
        await expect(detailView).toBeVisible();

        if (countryName) {
            await expect(detailView).toContainText(countryName);
        }

        // Close the view
        const closeButton = detailView.locator('button').first(); // Usually the first button is close or verify by icon
        await closeButton.click();

        await expect(detailView).not.toBeVisible();
    });
});

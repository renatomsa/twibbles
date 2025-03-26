import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/custom-world';

Given('I am logged in as {string}', async function (this: ICustomWorld, username: string) {
    await this.page!.goto('/login');
    await this.page!.fill('[data-testid="username-input"]', username);
    await this.page!.fill('[data-testid="password-input"]', 'password123');
    await this.page!.click('[data-testid="login-button"]');
    await this.page!.waitForURL('/profile');
});

Given('I am on my profile page', async function (this: ICustomWorld) {
    await this.page!.goto('/profile');
});

Given('my profile is private', async function (this: ICustomWorld) {
    const privacyButton = this.page!.getByTestId('privacy-toggle');
    const isPrivate = await privacyButton.getAttribute('data-private') === 'true';
    if (!isPrivate) {
        await privacyButton.click();
    }
});

Given('{string} has a private profile', async function (this: ICustomWorld, username: string) {
});

When('I click the privacy toggle button', async function (this: ICustomWorld) {
    await this.page!.getByTestId('privacy-toggle').click();
});

When('I visit {string}\'s profile', async function (this: ICustomWorld, username: string) {
    await this.page!.goto(`/profile/${username}`);
});

Then('my profile should be marked as private', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('privacy-toggle')).toHaveAttribute('data-private', 'true');
});

Then('my profile should be marked as public', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('privacy-toggle')).toHaveAttribute('data-private', 'false');
});

Then('other users should see {string} instead of {string}', async function (this: ICustomWorld, expectedText: string, notExpectedText: string) {
    await this.page!.goto('/profile');
    const followButton = this.page!.getByTestId('follow-button');
    await expect(followButton).toHaveText(expectedText);
    await expect(followButton).not.toHaveText(notExpectedText);
});

Then('I should not see their posts', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('user-posts')).not.toBeVisible();
});

Then('I should not see their followers list', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('followers-list')).not.toBeVisible();
});

Then('I should not see their following list', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('following-list')).not.toBeVisible();
});

Then('I should see their posts', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('user-posts')).toBeVisible();
});

Then('I should see their followers list', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('followers-list')).toBeVisible();
});

Then('I should see their following list', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('following-list')).toBeVisible();
}); 
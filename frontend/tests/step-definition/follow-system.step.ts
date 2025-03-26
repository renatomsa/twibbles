import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/custom-world';

Given('I am logged in as {string}', async function (this: ICustomWorld, username: string) {
    await this.page!.goto('/login');
    await this.page!.fill('[data-testid="username-input"]', username);
    await this.page!.fill('[data-testid="password-input"]', 'password123');
    await this.page!.click('[data-testid="login-button"]');
    await this.page!.waitForURL('/profile');
});

Given('I am on the profile page', async function (this: ICustomWorld) {
    await this.page!.goto('/profile');
});

// Follow a public user scenario
Given('I am viewing {string}\'s public profile', async function (this: ICustomWorld, username: string) {
    await this.page!.goto(`/profile/${username}`);
});

When('I click the {string} button', async function (this: ICustomWorld, buttonText: string) {
    const button = this.page!.getByTestId('follow-button');
    await expect(button).toHaveText(buttonText);
    await button.click();
});

Then('I should see the button change to {string}', async function (this: ICustomWorld, buttonText: string) {
    await expect(this.page!.getByTestId('follow-button')).toHaveText(buttonText);
});

Then('{string} should appear in my following list', async function (this: ICustomWorld, username: string) {
    await this.page!.goto('/profile');
    await this.page!.click('[data-testid="following-tab"]');
    await expect(this.page!.getByTestId(`following-item-${username}`)).toBeVisible();
});

Then('I should appear in {string}\'s followers list', async function (this: ICustomWorld, username: string) {
    await this.page!.goto(`/profile/${username}`);
    await this.page!.click('[data-testid="followers-tab"]');
    await expect(this.page!.getByTestId('follower-item-1')).toBeVisible();
});

// Request to follow a private user scenario
Given('I am viewing {string}\'s private profile', async function (this: ICustomWorld, username: string) {
    await this.page!.goto(`/profile/${username}`);
});

Then('the request should appear in {string}\'s follow requests list', async function (this: ICustomWorld, username: string) {
    await this.page!.goto(`/profile/${username}`);
    await this.page!.click('[data-testid="follow-requests-tab"]');
    await expect(this.page!.getByTestId('request-item-1')).toBeVisible();
});

// Accept follow request scenario
Given('I have a follow request from {string}', async function (this: ICustomWorld, username: string) {
    // This is a precondition that should be set up in the test database
    // The step is just for documentation purposes
});

When('I navigate to my follow requests', async function (this: ICustomWorld) {
    await this.page!.goto('/profile');
    await this.page!.click('[data-testid="follow-requests-tab"]');
});

When('I click {string} for {string}\'s request', async function (this: ICustomWorld, action: string, username: string) {
    const button = this.page!.getByTestId(`${action.toLowerCase()}-request-1`);
    await button.click();
});

// Reject follow request scenario
Then('{string} should not appear in my followers list', async function (this: ICustomWorld, username: string) {
    await this.page!.click('[data-testid="followers-tab"]');
    await expect(this.page!.getByTestId('follower-item-1')).not.toBeVisible();
});

Then('the request should be removed from the list', async function (this: ICustomWorld) {
    await this.page!.click('[data-testid="follow-requests-tab"]');
    await expect(this.page!.getByTestId('request-item-1')).not.toBeVisible();
});

// Unfollow user scenario
Given('I am following {string}', async function (this: ICustomWorld, username: string) {
    // This is a precondition that should be set up in the test database
    // The step is just for documentation purposes
});

When('I click the {string} button on {string}\'s profile', async function (this: ICustomWorld, buttonText: string, username: string) {
    await this.page!.goto(`/profile/${username}`);
    const button = this.page!.getByTestId('follow-button');
    await expect(button).toHaveText(buttonText);
    await button.click();
});

Then('{string} should not appear in my following list', async function (this: ICustomWorld, username: string) {
    await this.page!.goto('/profile');
    await this.page!.click('[data-testid="following-tab"]');
    await expect(this.page!.getByTestId(`following-item-${username}`)).not.toBeVisible();
});

Then('I should not appear in {string}\'s followers list', async function (this: ICustomWorld, username: string) {
    await this.page!.goto(`/profile/${username}`);
    await this.page!.click('[data-testid="followers-tab"]');
    await expect(this.page!.getByTestId('follower-item-1')).not.toBeVisible();
});

// Cancel follow request scenario
Given('I have sent a follow request to {string}', async function (this: ICustomWorld, username: string) {
    // This is a precondition that should be set up in the test database
    // The step is just for documentation purposes
});

// View followers/following lists scenarios
Given('I have followers {string} and {string}', async function (this: ICustomWorld, follower1: string, follower2: string) {
    // This is a precondition that should be set up in the test database
    // The step is just for documentation purposes
});

Given('I am following {string} and {string}', async function (this: ICustomWorld, following1: string, following2: string) {
    // This is a precondition that should be set up in the test database
    // The step is just for documentation purposes
});

When('I navigate to my {string} tab', async function (this: ICustomWorld, tabName: string) {
    await this.page!.click(`[data-testid="${tabName.toLowerCase()}-tab"]`);
});

Then('I should see {string} and {string} in the list', async function (this: ICustomWorld, user1: string, user2: string) {
    await expect(this.page!.getByTestId(`follower-item-${user1}`)).toBeVisible();
    await expect(this.page!.getByTestId(`follower-item-${user2}`)).toBeVisible();
});

Then('each user should have appropriate follow buttons', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('follow-button')).toHaveCount(2);
}); 
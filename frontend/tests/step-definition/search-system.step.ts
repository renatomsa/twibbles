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

Given('I am on the search page', async function (this: ICustomWorld) {
    await this.page!.goto('/search');
});

When('I select the {string} search type', async function (this: ICustomWorld, searchType: string) {
    await this.page!.click(`[data-testid="${searchType.toLowerCase()}-search-button"]`);
});

When('I enter {string} in the search box', async function (this: ICustomWorld, searchTerm: string) {
    await this.page!.fill('[data-testid="search-input"]', searchTerm);
    await this.page!.waitForTimeout(500);
});

Then('I should see users with {string} in their name', async function (this: ICustomWorld, searchTerm: string) {
    const userResults = this.page!.getByTestId('user-search-result');
    const count = await userResults.count();
    expect(count).toBeGreaterThan(0);
    for (const result of await userResults.all()) {
        const username = await result.getAttribute('data-username');
        expect(username?.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
});

Then('each user should have their profile picture', async function (this: ICustomWorld) {
    const profilePictures = this.page!.getByTestId('user-profile-picture');
    const count = await profilePictures.count();
    expect(count).toBeGreaterThan(0);
    for (const picture of await profilePictures.all()) {
        await expect(picture).toBeVisible();
    }
});

Then('each user should have their username displayed', async function (this: ICustomWorld) {
    const usernames = this.page!.getByTestId('user-username');
    const count = await usernames.count();
    expect(count).toBeGreaterThan(0);
    for (const username of await usernames.all()) {
        await expect(username).toBeVisible();
    }
});

Then('I should see posts tagged with {string}', async function (this: ICustomWorld, location: string) {
    const posts = this.page!.getByTestId('post-item');
    const count = await posts.count();
    expect(count).toBeGreaterThan(0);
    for (const post of await posts.all()) {
        const postLocation = await post.getAttribute('data-location');
        expect(postLocation).toContain(location);
    }
});

Then('each post should show its location', async function (this: ICustomWorld) {
    const locations = this.page!.getByTestId('post-location');
    const count = await locations.count();
    expect(count).toBeGreaterThan(0);
    for (const location of await locations.all()) {
        await expect(location).toBeVisible();
    }
});

Then('each post should show the author\'s name', async function (this: ICustomWorld) {
    const authors = this.page!.getByTestId('post-author');
    const count = await authors.count();
    expect(count).toBeGreaterThan(0);
    for (const author of await authors.all()) {
        await expect(author).toBeVisible();
    }
});

Then('I should see posts containing the hashtag {string}', async function (this: ICustomWorld, hashtag: string) {
    const posts = this.page!.getByTestId('post-item');
    const count = await posts.count();
    expect(count).toBeGreaterThan(0);
    for (const post of await posts.all()) {
        const postHashtags = await post.getAttribute('data-hashtags');
        expect(postHashtags).toContain(hashtag);
    }
});

Then('each post should show its hashtags', async function (this: ICustomWorld) {
    const hashtags = this.page!.getByTestId('post-hashtags');
    const count = await hashtags.count();
    expect(count).toBeGreaterThan(0);
    for (const hashtag of await hashtags.all()) {
        await expect(hashtag).toBeVisible();
    }
});

Then('I should see a {string} message', async function (this: ICustomWorld, message: string) {
    await expect(this.page!.getByTestId('no-results-message')).toHaveText(message);
});

Then('the search results should be empty', async function (this: ICustomWorld) {
    const userResults = await this.page!.getByTestId('user-search-result').count();
    const postResults = await this.page!.getByTestId('post-item').count();
    expect(userResults).toBe(0);
    expect(postResults).toBe(0);
});

Then('I should see the search type selector', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('search-type-selector')).toBeVisible();
}); 
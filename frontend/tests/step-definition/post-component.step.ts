import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/custom-world';

Given('I am viewing a post', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('post-container')).toBeVisible();
});

Given('the post has comments', async function (this: ICustomWorld) {
    // This is a precondition that should be set up in the test database
    // The step is just for documentation purposes
});

Given('I am the owner of the post', async function (this: ICustomWorld) {
    // This is a precondition that should be set up in the test database
    // The step is just for documentation purposes
});

Given('the post has location {string}', async function (this: ICustomWorld, location: string) {
    await expect(this.page!.getByTestId('post-location')).toContainText(location);
});

Given('the post has hashtags {string}', async function (this: ICustomWorld, hashtags: string) {
    await expect(this.page!.getByTestId('post-hashtags')).toContainText(hashtags);
});

When('I click the comments button', async function (this: ICustomWorld) {
    await this.page!.click('[data-testid="comments-button"]');
});

When('I click the delete post button', async function (this: ICustomWorld) {
    await this.page!.click('[data-testid="delete-post-button"]');
});

When('I confirm post deletion', async function (this: ICustomWorld) {
    await this.page!.click('[data-testid="confirm-delete-button"]');
});

When('I cancel post deletion', async function (this: ICustomWorld) {
    await this.page!.click('[data-testid="cancel-delete-button"]');
});

When('I add a comment {string}', async function (this: ICustomWorld, commentText: string) {
    await this.page!.fill('[data-testid="comment-input"]', commentText);
    await this.page!.click('[data-testid="submit-comment-button"]');
});

When('I delete a comment', async function (this: ICustomWorld) {
    await this.page!.click('[data-testid="delete-comment-button"]');
});

Then('I should see the post content', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('post-text')).toBeVisible();
    await expect(this.page!.getByTestId('post-username')).toBeVisible();
});

Then('I should see the post profile image', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('post-profile-image')).toBeVisible();
});

Then('I should see the post location', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('post-location')).toBeVisible();
});

Then('I should see the post hashtags', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('post-hashtags')).toBeVisible();
});

Then('I should see the delete post button', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('delete-post-button')).toBeVisible();
});

Then('I should not see the delete post button', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('delete-post-button')).not.toBeVisible();
});

Then('the delete confirmation modal should be visible', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('delete-modal')).toBeVisible();
});

Then('the delete confirmation modal should be hidden', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('delete-modal')).not.toBeVisible();
});

Then('the post should be deleted', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('post-container')).not.toBeVisible();
});

Then('I should see the comments section', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('comments-section')).toBeVisible();
});

Then('I should see the comment form', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('comment-form')).toBeVisible();
});

Then('I should see the list of comments', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('comments-list')).toBeVisible();
});

Then('I should see the comment count', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('comment-count')).toBeVisible();
});

Then('the new comment should appear in the list', async function (this: ICustomWorld) {
    const comments = await this.page!.getByTestId('comment-item').all();
    await expect(comments.length).toBeGreaterThan(0);
});

Then('the comment should be deleted', async function (this: ICustomWorld) {
    await expect(this.page!.getByTestId('comment-item')).not.toBeVisible();
});

Then('I should see an error message {string}', async function (this: ICustomWorld, message: string) {
    await expect(this.page!.getByTestId('error-message')).toContainText(message);
}); 
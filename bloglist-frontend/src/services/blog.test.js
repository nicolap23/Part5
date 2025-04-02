const { test, expect, beforeEach, describe } = require('@playwright/test');

const BASE_URL = 'http://localhost:5173';

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Vaciar la base de datos y crear un usuario antes de cada prueba
    await request.post('http://localhost:3001/api/testing/reset');
    await request.post('http://localhost:3001/api/users', {
      data: { username: 'testuser', name: 'Test User', password: 'password123' },
    });

    await page.goto(BASE_URL);
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.fill('#username', 'testuser');
      await page.fill('#password', 'password123');
      await page.click('#login-button');
      await expect(page.getByText('Test User logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.fill('#username', 'testuser');
      await page.fill('#password', 'wrongpassword');
      await page.click('#login-button');
      await expect(page.getByText('Invalid username or password')).toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Iniciar sesión antes de las pruebas
      await page.fill('#username', 'testuser');
      await page.fill('#password', 'password123');
      await page.click('#login-button');
      await expect(page.getByText('Test User logged in')).toBeVisible();
    });

    test('a new blog can be created', async ({ page }) => {
      await page.click('#new-blog-button');
      await page.fill('#title', 'New Blog Post');
      await page.fill('#author', 'John Doe');
      await page.fill('#url', 'https://example.com');
      await page.click('#create-blog-button');

      await expect(page.getByText('New Blog Post')).toBeVisible();
      await expect(page.getByText('John Doe')).toBeVisible();
    });

    test('a blog can be liked', async ({ page }) => {
      await page.click('#new-blog-button');
      await page.fill('#title', 'New Blog Post');
      await page.fill('#author', 'John Doe');
      await page.fill('#url', 'https://example.com');
      await page.click('#create-blog-button');

      await page.click('#show-details-button');
      await page.click('#like-button');
      await expect(page.getByText('1 likes')).toBeVisible();
    });

    test('the creator can delete a blog', async ({ page }) => {
      await page.click('#new-blog-button');
      await page.fill('#title', 'Blog to Delete');
      await page.fill('#author', 'John Doe');
      await page.fill('#url', 'https://example.com');
      await page.click('#create-blog-button');

      await page.click('#show-details-button');
      await page.click('#delete-button');

      await expect(page.getByText('Blog to Delete')).not.toBeVisible();
    });

    test('only the creator sees the delete button', async ({ page, browser }) => {
      await page.click('#new-blog-button');
      await page.fill('#title', 'Private Blog');
      await page.fill('#author', 'John Doe');
      await page.fill('#url', 'https://example.com');
      await page.click('#create-blog-button');

      // Cerrar sesión
      await page.click('#logout-button');

      // Iniciar sesión con otro usuario
      const newPage = await browser.newPage();
      await newPage.goto(BASE_URL);
      await newPage.fill('#username', 'otheruser');
      await newPage.fill('#password', 'password123');
      await newPage.click('#login-button');

      await newPage.click('#show-details-button');
      await expect(newPage.querySelector('#delete-button')).toBeNull();
    });

    test('blogs are sorted by likes', async ({ page }) => {
      await page.click('#new-blog-button');
      await page.fill('#title', 'Most Liked');
      await page.fill('#author', 'John Doe');
      await page.fill('#url', 'https://example.com');
      await page.click('#create-blog-button');

      await page.click('#new-blog-button');
      await page.fill('#title', 'Less Liked');
      await page.fill('#author', 'Jane Doe');
      await page.fill('#url', 'https://example.com');
      await page.click('#create-blog-button');

      await page.click('#show-details-button');
      await page.click('#like-button');
      await page.click('#like-button');

      await expect(page.locator('.blog:first-child')).toHaveText('Most Liked');
    });
  });
});

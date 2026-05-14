import { closeElectronApp, expect, Locator, test } from '../../playwright';
import { buildWebsocketCommonLocators } from '../utils/page/locators';
import { cp, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const BRU_REQ_NAME = /^base$/;
const FIXTURES_COLLECTION_PATH = join(__dirname, 'fixtures/collection');
const BASE_BRU_FILE_NAME = 'base.bru';

// TODO: reaper move to someplace common
const isRequestSaved = async (saveButton: Locator) => {
  // Saved state uses the className cursor-default; unsaved uses cursor-pointer.
  return await saveButton.locator('svg').evaluate((node) => (node as HTMLElement).classList.contains('cursor-default'));
};

test.describe.serial('persistence', () => {
  test('save new websocket url', async ({ launchElectronApp, createTmpDir }) => {
    const collectionPath = await createTmpDir('websockets-persistence-collection');
    await cp(FIXTURES_COLLECTION_PATH, collectionPath, { recursive: true });

    const baseBruPath = join(collectionPath, BASE_BRU_FILE_NAME);
    const originalData = await readFile(baseBruPath, 'utf8');
    const originalUrlMatch = originalData.match(`(url)\s*\:\s*(.+)`);
    if (!originalUrlMatch) {
      throw new Error('url not found in bru file for websocket');
    }
    const originalUrl = originalUrlMatch[0].replace(/url\:/, '').trim();

    const userDataPath = await createTmpDir('websockets-persistence-user-data');
    await writeFile(
      join(userDataPath, 'preferences.json'),
      JSON.stringify(
        {
          maximized: false,
          lastOpenedCollections: [collectionPath],
          preferences: {
            onboarding: {
              hasLaunchedBefore: true,
              hasSeenWelcomeModal: true
            }
          }
        },
        null,
        2
      ),
      'utf8'
    );

    const app = await launchElectronApp({ userDataPath });
    const page = await app.firstWindow();
    await page.locator('[data-app-state="loaded"]').waitFor({ timeout: 30000 });

    const replacementUrl = 'ws://localhost:8083';
    const locators = buildWebsocketCommonLocators(page);
    const selectAllShortcut = process.platform === 'darwin' ? 'Meta+a' : 'Control+a';

    await page.locator('#sidebar-collection-name').click();
    await page.getByTitle(BRU_REQ_NAME).click();

    // Select all text in the URL input and replace with new URL
    await page.locator('.input-container').filter({ hasText: originalUrl }).first().click();
    await page.keyboard.press(selectAllShortcut);
    await page.keyboard.insertText(replacementUrl);

    // Use auto-retrying assertion to check if the request is now unsaved
    await expect.poll(() => isRequestSaved(locators.saveButton())).toBe(false);

    await locators.saveButton().click();

    // Use auto-retrying assertion to verify save completed
    await expect.poll(() => isRequestSaved(locators.saveButton())).toBe(true);

    // check if the replacementUrl is now visually available
    await expect(page.locator('.input-container').filter({ hasText: replacementUrl }).first()).toBeAttached();

    await closeElectronApp(app);
  });
});

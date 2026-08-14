import { by, device, element, expect as detoxExpect, waitFor } from 'detox';

describe('Pokemon list', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('loads the list and shows at least one row', async () => {
    await waitFor(element(by.id('pokemon-list')))
      .toBeVisible()
      .withTimeout(15000);

    await detoxExpect(element(by.id('pokemon-row-1'))).toBeVisible();
  });

  it('paginates when scrolling to the end of the list', async () => {
    await waitFor(element(by.id('pokemon-list')))
      .toBeVisible()
      .withTimeout(15000);

    await element(by.id('pokemon-list')).scroll(2000, 'down');

    await waitFor(element(by.id('pokemon-row-21')))
      .toBeVisible()
      .withTimeout(15000);
  });
});

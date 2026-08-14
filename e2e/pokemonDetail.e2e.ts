import { by, device, element, expect as detoxExpect, waitFor } from 'detox';

describe('Pokemon detail', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('navigates from the list to the detail screen and shows its stats', async () => {
    await waitFor(element(by.id('pokemon-row-1')))
      .toBeVisible()
      .withTimeout(15000);

    await element(by.id('pokemon-row-1')).tap();

    await waitFor(element(by.id('pokemon-detail-scroll')))
      .toBeVisible()
      .withTimeout(15000);

    await detoxExpect(element(by.text('Estadísticas'))).toBeVisible();
  });
});

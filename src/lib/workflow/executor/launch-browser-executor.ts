import puppeteer from 'puppeteer';

import { ExecutionEnvironment } from '@/types/executor';

import { LaunchBrowserTask } from '../task/launch-browser';

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInputs('Website url');

    const browser = await puppeteer.launch({
      headless: true,
    });

    environment.setBrowser(browser);

    const page = await browser.newPage();
    await page.goto(websiteUrl);

    environment.setPage(page);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

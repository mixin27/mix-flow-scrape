/* eslint-disable @typescript-eslint/no-explicit-any */
import puppeteer from 'puppeteer';

import { ExecutionEnvironment } from '@/types/executor';

import { LaunchBrowserTask } from '../task/launch-browser';

// TODO: handle security using some services
// E.g. Scraping Browser or Datacenter Proxy from https://brightdata.com
export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInputs('Website url');

    const browser = await puppeteer.launch({
      headless: true,
    });
    environment.log.info('Browser started successfully');

    environment.setBrowser(browser);

    const page = await browser.newPage();
    await page.goto(websiteUrl);

    environment.setPage(page);
    environment.log.info(`Opened page at: ${websiteUrl}`);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}

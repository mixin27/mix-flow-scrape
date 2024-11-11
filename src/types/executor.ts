import { Browser, Page } from 'puppeteer';

import { LogCollector } from './log';
import { WorkflowTask } from './workflow';

/**
 * Example:
 *
 * ```javascript
 * {
 *  browser: "PuppeteerInstance",
 *  phases: {
 *    launchBrowser: {
 *      inputs: {
 *        websiteUrl: 'www.google.com',
 *      },
 *      outputs: {
 *        browser: 'PuppetterInstance',
 *       },
 *     },
 *   },
 * };
 * ```
 */
export type Environment = {
  browser?: Browser;
  page?: Page;
  // Phases with nodeId/taskId key
  phases: Record<
    string, // key: nodeId/taskId
    {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    }
  >;
};

export type ExecutionEnvironment<T extends WorkflowTask> = {
  getInputs(name: T['inputs'][number]['name']): string;
  setOutputs(name: T['outputs'][number]['name'], value: string): void;

  getBrowser(): Browser | undefined;
  setBrowser(browser: Browser): void;

  getPage(): Page | undefined;
  setPage(page: Page): void;

  log: LogCollector;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from '@/types/executor';

import { ScrollToElementTask } from '../task/scroll-to-element';

export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInputs('Selector');
    if (!selector) {
      environment.log.error('input->selector is not defined');
    }

    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error('element not found');
      }

      const y = element.getBoundingClientRect().top + window.screenY;
      window.scrollTo({ top: y });
    }, selector);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}

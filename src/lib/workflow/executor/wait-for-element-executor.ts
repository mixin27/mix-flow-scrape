/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from '@/types/executor';

import { WaitForElementTask } from '../task/wait-for-element';

export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInputs('Selector');
    if (!selector) {
      environment.log.error('input->selector is not defined');
    }

    const visibility = environment.getInputs('Visibility');
    if (!visibility) {
      environment.log.error('input->visibiloty is not defined');
    }

    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === 'visible',
      hidden: visibility === 'hidden',
    });

    environment.log.info(`Element ${selector} became: ${visibility}`);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}

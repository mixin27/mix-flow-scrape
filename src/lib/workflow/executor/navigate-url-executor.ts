/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from '@/types/executor';

import { NavigateUrlTask } from '../task/navigate-url';

export async function NavigateUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateUrlTask>
): Promise<boolean> {
  try {
    const url = environment.getInputs('URL');
    if (!url) {
      environment.log.error('input->url is not defined');
    }

    await environment.getPage()!.goto(url);
    environment.log.info(`visited ${url}`);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from '@/types/executor';

import { FillInputTask } from '../task/fill-input';

export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInputs('Selector');
    if (!selector) {
      environment.log.error('input->selector is not defined');
    }

    const value = environment.getInputs('Value');
    if (!value) {
      environment.log.error('input->value is not defined');
    }

    await environment.getPage()!.type(selector, value);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}

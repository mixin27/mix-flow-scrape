/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from '@/types/executor';

import { PageToHtmlTask } from '../task/page-to-html';

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutput('Html', html);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}

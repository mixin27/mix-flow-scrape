import { ExecutionEnvironment } from '@/types/executor';
import { TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/workflow';

import { ClickElementExecutor } from './click-element-executor';
import { DeliverViaWebhookExecutor } from './deliver-via-webhook-executor';
import { ExtractTextFromElementExecutor } from './extract-text-from-element-executor';
import { FillInputExecutor } from './fill-input-executor';
import { LaunchBrowserExecutor } from './launch-browser-executor';
import { PageToHtmlExecutor } from './page-to-html-executor';
import { WaitForElementExecutor } from './wait-for-element-executor';

type ExecutorFn<T extends WorkflowTask> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>;

type ExecutorRegistryType = {
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
};

export const ExecutorRegistry: ExecutorRegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
};

import { TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/workflow';

import { ClickElementTask } from './click-element';
import { DeliverViaWebhookTask } from './deliver-via-webhook';
import { ExtractTextFromElementTask } from './extract-text-from-element';
import { FillInputTask } from './fill-input';
import { LaunchBrowserTask } from './launch-browser';
import { PageToHtmlTask } from './page-to-html';
import { WaitForElementTask } from './wait-for-element';

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
};

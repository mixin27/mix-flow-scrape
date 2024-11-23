/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from '@/types/executor';

import { ReadPropertyFromJsonTask } from '../task/read-property-from-json';

export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>
): Promise<boolean> {
  try {
    const jsonData = environment.getInputs('JSON');
    if (!jsonData) {
      environment.log.error('input->JSON is not defined');
    }

    const propertyName = environment.getInputs('Property name');
    if (!propertyName) {
      environment.log.error('input->propertyName is not defined');
    }

    const json = JSON.parse(jsonData);
    const propertyValue = json[propertyName];
    if (propertyValue === undefined) {
      environment.log.error('property not found');
      return false;
    }

    environment.setOutput('Property value', propertyValue);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}

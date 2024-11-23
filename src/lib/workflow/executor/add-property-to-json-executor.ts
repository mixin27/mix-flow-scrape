/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from '@/types/executor';

import { AddPropertyToJsonTask } from '../task/add-property-to-json';

export async function AddPropertyToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>
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

    const propertyValue = environment.getInputs('Property value');
    if (!propertyValue) {
      environment.log.error('input->propertyValue is not defined');
    }

    const json = JSON.parse(jsonData);
    json[propertyName] = propertyValue;

    environment.setOutput('Update JSON', JSON.stringify(json));

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}

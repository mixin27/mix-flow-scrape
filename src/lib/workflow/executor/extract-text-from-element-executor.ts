import * as cheerio from 'cheerio';

import { ExecutionEnvironment } from '@/types/executor';

import { ExtractTextFromElementTask } from '../task/extract-text-from-element';

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInputs('Selector');
    if (!selector) {
      console.error('Selector not defined');
      return false;
    }

    const html = environment.getInputs('Html');
    if (!html) {
      console.error('Html not defined');
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      console.error('Element not found');
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      console.error('Element has no text');
      return false;
    }

    environment.setOutputs('Extracted text', extractedText);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

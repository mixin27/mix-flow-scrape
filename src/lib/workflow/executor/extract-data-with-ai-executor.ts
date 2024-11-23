/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenAI } from 'openai';

import { symmeticDecrypt } from '@/lib/encryption';
import prisma from '@/lib/prisma';
import { ExecutionEnvironment } from '@/types/executor';

import { ExtractDataWithAiTask } from '../task/extract-data-with-ai';

export async function ExtractDataWithAiExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>
): Promise<boolean> {
  try {
    const content = environment.getInputs('Content');
    if (!content) {
      environment.log.error('input->content is not defined');
    }

    const credentials = environment.getInputs('Credentials');
    if (!credentials) {
      environment.log.error('input->credentials is not defined');
    }

    const prompt = environment.getInputs('Prompt');
    if (!prompt) {
      environment.log.error('input->prompt is not defined');
    }

    // Get credentials from DB
    const credential = await prisma.credential.findUnique({
      where: { id: credentials },
    });
    if (!credential) {
      environment.log.error('credential not found');
      return false;
    }

    const plainCredentialValue = symmeticDecrypt(credential.value);
    if (!plainCredentialValue) {
      environment.log.error('cannot decrypt credential');
      return false;
    }

    // const mockExtractedData = {
    //   usernameSelector: '#username',
    //   passwordSelector: '#password',
    //   loginSelector: 'body > div > form > input.btn.btn-primary',
    // };
    const openAi = new OpenAI({
      apiKey: plainCredentialValue,
    });

    const response = await openAi.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explainations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text',
        },
        {
          role: 'user',
          content: content,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 1,
    });

    environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
    environment.log.info(
      `Completion tokens: ${response.usage?.completion_tokens}`
    );

    const result = response.choices[0].message?.content;
    if (!result) {
      environment.log.error('empty response from AI');
      return false;
    }

    environment.setOutput('Extracted data', result);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}

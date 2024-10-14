import { CONTENTSTACK_API_URL } from './constants';
import { StackDetails } from './sessions';

export type QuestionAnswers = {
  name: string;
  description: string;
  dp: any;
  designation: string;
  x: string;
  linkedin: string;
  github: string;
};

export async function createStack(
  accessToken: string,
  organizationUid: string,
  questionAnswers: QuestionAnswers,
): Promise<StackDetails> {
  let apiKey;
  let deliveryToken;
  let environment;

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${accessToken}`);
  myHeaders.append('organization_uid', organizationUid);
  myHeaders.append('Content-Type', 'application/json');

  const stackCreateBody = JSON.stringify({
    stack: {
      name: 'Portfolio Website',
      description: 'Portfolio website content from React India 2024 conference',
      master_locale: 'en-us',
    },
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: stackCreateBody,
  };

  try {
    const response = await fetch(
      `${CONTENTSTACK_API_URL}/v3/stacks`,
      requestOptions
    );
    const result = await response.json();
    if (!response.ok) {
      throw result;
    }
    apiKey = result.stack.api_key;
  } catch (error) {
    console.error("Stack creation error", error);
    throw error;
  }

  return {
    apiKey,
    deliveryToken: '',
    environment: '',
  }
}
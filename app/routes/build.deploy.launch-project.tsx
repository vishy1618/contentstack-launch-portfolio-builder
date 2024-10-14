import {
  commitSession,
  getSession,
  LaunchProjectDetails,
  SessionProgress,
} from '~/sessions';

import {
  ActionFunctionArgs,
  json,
} from '@remix-run/node';
import { createProject, EnvironmentVariables } from '~/launch-repository';

export const action = async ({
  request,
}: ActionFunctionArgs) => {

  const session = await getSession(
    request.headers.get("Cookie")
  );

  switch (request.method) {
    case 'POST':
      if (session.get('progress') !== SessionProgress.DEPLOYMENT || !session.has('stackDetails')) {
        return json({
          errors: {
            session: 'Create stack first before creating Launch project'
          }
        }, {
          status: 400,
        });
      }
      const envVariables: EnvironmentVariables = [
        {
          key: 'DEFAULT_THEME',
          value: 'light'
        },
        {
          key: 'CONTENTSTACK_API_KEY',
          value: 'blt9a981b9220f1a836',
        },
        {
          key: 'CONTENTSTACK_DELIVERY_TOKEN',
          value: 'cs4e38f11298b815bd08ce52b0',
        },
        {
          key: 'CONTENTSTACK_ENVIRONMENT',
          value: 'production',
        },
        {
          key: 'CONTENTSTACK_CONTENT_TYPE',
          value: 'portfolio',
        },
        {
          key: 'CONTENTSTACK_ENTRY_UID',
          value: 'blt0cbc3d310e173b7e',
        },
        {
          key: 'CONTENTSTACK_ASSET_UID',
          value: 'blte69f1ec4a2912c2e',
        },
      ]
      const projectDetails = await createProject(session.get('accessToken') as string, session.get('organizationUid') as string, envVariables);

      session.set('launchProjectDetails', projectDetails);

      return json(projectDetails, {
        headers: {
          'Set-Cookie': await commitSession(session),
        }
      });
  }
}
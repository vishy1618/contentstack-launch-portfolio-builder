import {
  commitSession,
  getSession,
  SessionProgress,
} from '~/sessions';

import {
  ActionFunctionArgs,
  json,
} from '@remix-run/node';
import { createProject, EnvironmentVariables } from '~/launch-repository';
import { LAUNCH_PROJECT_THEMES } from '~/constants';

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
      const environmentVariables: EnvironmentVariables = [
        {
          key: 'DEFAULT_THEME',
          value: LAUNCH_PROJECT_THEMES[Math.floor(Math.random() * LAUNCH_PROJECT_THEMES.length)]
        },
        {
          key: 'CONTENTSTACK_API_KEY',
          value: session.get('stackDetails')?.apiKey as string,
        },
        {
          key: 'CONTENTSTACK_DELIVERY_TOKEN',
          value: session.get('stackDetails')?.deliveryToken as string,
        },
        {
          key: 'CONTENTSTACK_ENVIRONMENT',
          value: session.get('stackDetails')?.environment as string,
        },
        {
          key: 'CONTENTSTACK_CONTENT_TYPE',
          value: session.get('contentDetails')?.contentType as string,
        },
        {
          key: 'CONTENTSTACK_ENTRY_UID',
          value: session.get('contentDetails')?.entryUid as string,
        },
        {
          key: 'CONTENTSTACK_ASSET_UID',
          value: session.get('contentDetails')?.assetUid as string,
        },
      ]
      const projectDetails = await createProject(session.get('accessToken') as string, session.get('organizationUid') as string, environmentVariables);

      session.set('launchProjectDetails', projectDetails);

      return json(projectDetails, {
        headers: {
          'Set-Cookie': await commitSession(session),
        }
      });
  }
}
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

      // TODO: create Launch project
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });

      const projectDetails: LaunchProjectDetails = {
        projectUid: 'projectUid',
        environmentUid: 'environmentUid',
        deploymentUid: 'deploymentUid',
      };

      session.set('launchProjectDetails', projectDetails);

      return json(projectDetails, {
        headers: {
          'Set-Cookie': await commitSession(session),
        }
      });
  }
}
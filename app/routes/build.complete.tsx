import { CONTENTSTACK_APP_URL } from '~/constants';
import { useRevalidateOnInterval } from '~/revalidate-on-interval';
import { getSession } from '~/sessions';

import {
  redirect,
  useLoaderData,
} from '@remix-run/react';
import { fetchDeploymentDetails} from '~/launch-repository';

export default function Complete() {
  const {
    previewUrl,
    environmentUrl,
    stackUrl,
    launchProjectUrl,
  }: {
    previewUrl: string,
    environmentUrl: string,
    stackUrl: string,
    launchProjectUrl: string,
  } = useLoaderData();
  const websiteUrl = `https://${environmentUrl}`;

  const pollingEnabled = !previewUrl;
  useRevalidateOnInterval({ enabled: pollingEnabled, interval: 5000 });

  return (
    <>
      {
        previewUrl ?
          <a href={websiteUrl} target="_blank" rel="noreferrer">
            <img
              alt="Website Preview"
              src={previewUrl}
              className="h-64 w-full mx-auto object-contain sm:h-80 lg:h-96"
            />
          </a> : <SkeletonLoader />
      }

      <div className="flex flex-col items-center justify-center">
        <h3 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">Your portfolio <a className="text-blue-500 underline" href={websiteUrl} target="_blank" rel="noreferrer">website</a> is live!</h3>

        <p className="mt-2 text-gray-700">
          Next, you can checkout the <a href={stackUrl} target="_blank" className="text-blue-500 underline" rel="noreferrer">Stack (content)</a> and the <a href={launchProjectUrl} target="_blank" className="text-blue-500 underline" rel="noreferrer">Launch project</a> to see how it all works together.
        </p>
      </div>
    </>
  );
}

function SkeletonLoader() {
  return (
    <div role="status" className="max-w-sm animate-pulse mx-auto h-64 sm:h-80 lg:h-96">
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export async function loader({ request }: { request: Request }) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (!session.has('launchProjectDetails')) {
    return redirect('/build/deploy');
  }

  const stackApiKey = session.get('stackDetails')?.apiKey;
  const launchProjectUid = session.get('launchProjectDetails')?.projectUid;
  const launchEnvUid = session.get('launchProjectDetails')?.environmentUid;
  const deploymentUid = session.get('launchProjectDetails')?.deploymentUid;
  const stackUrl = `${CONTENTSTACK_APP_URL}/#!/stack/${stackApiKey}/dashboard`;
  const launchProjectUrl = `${CONTENTSTACK_APP_URL}/#!/launch/projects/${launchProjectUid}/envs`;

  const urls = await fetchDeploymentDetails(session.get('accessToken') as string, session.get('organizationUid') as string, launchEnvUid as string, launchProjectUid as string, deploymentUid as string);
  return {
    previewUrl: urls.previewUrl,
    environmentUrl: urls.deploymentUrl,
    stackUrl,
    launchProjectUrl,
  };
}
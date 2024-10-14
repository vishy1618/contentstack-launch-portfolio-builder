import { CONTENTSTACK_APP_URL } from '~/constants';
import { useRevalidateOnInterval } from '~/revalidate-on-interval';
import { getSession } from '~/sessions';

import {
  redirect,
  useLoaderData,
} from '@remix-run/react';

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

  const pollingEnabled = previewUrl === null;
  useRevalidateOnInterval({ enabled: pollingEnabled, interval: 5000 });

  return (
    <>
      {
        previewUrl ?
          <a href={environmentUrl} target="_blank">
            <img
              alt="Website Preview"
              src={previewUrl}
              className="h-64 w-full mx-auto object-contain sm:h-80 lg:h-96"
            />
          </a> : <SkeletonLoader />
      }

      <div className="flex flex-col items-center justify-center">
        <h3 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">Your portfolio <a className="text-blue-500 underline" href={environmentUrl} target="_blank">website</a> is live!</h3>

        <p className="mt-2 text-gray-700">
          Next, you can checkout the <a href={stackUrl} target="_blank" className="text-blue-500 underline">Stack (content)</a> and the <a href={launchProjectUrl} target="_blank" className="text-blue-500 underline">Launch project</a> to see how it all works together.
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
  const stackUrl = `${CONTENTSTACK_APP_URL}/#!/stack/${stackApiKey}/dashboard`;
  const launchProjectUrl = `${CONTENTSTACK_APP_URL}/#!/launch/projects/${launchProjectUid}/envs`;
  let previewUrl = null;

  // TODO: fetch deployment details
  const random = randomIntFromInterval(0, 10);
  if (random > 5) {
    previewUrl = 'https://images.contentstack.io/v3/assets/bltb6904bc276687b34/blt41733d50ccf59e95/66f5f68666be4a74abdd633b/66f5f677f9d9d6a198c2a955-preview.png';
  }

  return {
    previewUrl,
    environmentUrl: 'https://portfolio.contentstackapps.com',
    stackUrl,
    launchProjectUrl,
  };
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
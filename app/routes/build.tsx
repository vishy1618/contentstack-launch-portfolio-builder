import {
  commitSession,
  getSession,
} from '~/sessions';

import {
  Form,
  Outlet,
  redirect,
  useLoaderData,
} from '@remix-run/react';

export const LOGOUT_ACTION = 'LOGOUT_ACTION';

export default function Build() {
  const { pathname }: { pathname: string } = useLoaderData();
  const isQuestions = pathname.endsWith('questions');
  const isDeploying = pathname.endsWith('deploy');
  const isComplete = pathname.endsWith('complete');

  return (
    <div className="container mx-10 my-10">
      <h2 className="sr-only">Steps</h2>
      <header className="flex flex-col gap-9 my-10">
        <h1 className="leading text-2xl font-bold text-gray-800">
          Contentstack Portfolio Builder

          <Form method="post" className="float-right">
            <button
              className="underline hover:text-blue-500 font-medium text-sm"
              type="submit"
              name="action"
              value={LOGOUT_ACTION}>
              Logout
            </button>
          </Form>
        </h1>
      </header>


      <div>
        <ol
          className="grid grid-cols-1 divide-x divide-gray-100 overflow-hidden rounded-lg border border-gray-100 text-sm text-gray-500 sm:grid-cols-3"
        >
          <li className={`flex items-center lg:justify-center sm:justify-start gap-2 ${isQuestions ? 'bg-gray-200' : 'bg-gray-50'} p-4`}>
            <img src="/conversation.svg" />

            <p className="leading-none">
              <strong className="block font-medium text-black"> Questions </strong>
              <small className="mt-1"> Some info about you. </small>
            </p>
          </li>

          <li className={`relative flex items-center lg:justify-center sm:justify-start gap-2 p-4 ${isDeploying ? 'bg-gray-200' : 'bg-gray-50'}`}>
            <span
              className="absolute -left-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 border border-gray-100 sm:block ltr:border-b-0 ltr:border-s-0 ltr:bg-white rtl:border-e-0 rtl:border-t-0 rtl:bg-gray-50"
            >
            </span>

            <span
              className="absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 border border-gray-100 sm:block ltr:border-b-0 ltr:border-s-0 ltr:bg-gray-50 rtl:border-e-0 rtl:border-t-0 rtl:bg-white"
            >
            </span>

            <img src="/cooking.svg" />

            <p className="leading-none">
              <strong className="block font-medium text-black"> Deploy </strong>
              <small className="mt-1"> Chat with us while we dish out your website </small>
            </p>
          </li>

          <li className={`flex items-center lg:justify-center sm:justify-start gap-2 p-4 ${isComplete ? 'bg-gray-200' : 'bg-gray-50'}`}>
            <img src="/ship.svg" />

            <p className="leading-none">
              <strong className="block font-medium text-black"> Complete </strong>
              <small className="mt-1"> Here's your website! </small>
            </p>
          </li>
        </ol>
      </div>


      <div className="container mx-auto mx-20 my-10">
        <Outlet />
      </div>
    </div>
  );
}

export async function loader({ request }: { request: Request }) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (!session.has('accessToken')) {
    return redirect('/');
  } else if (new URL(request.url).pathname === '/build') {
    return redirect('/build/questions');
  }

  return {
    pathname: new URL(request.url).pathname,
  };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();

  switch (formData.get('action')) {
    case LOGOUT_ACTION:
      const session = await getSession(
        request.headers.get("Cookie")
      );
      session.unset('accessToken');
      session.unset('refreshToken');
      session.unset('progress');
      session.unset('stackDetails');
      session.unset('launchProjectDetails');

      return redirect('/', {
        headers: {
          "Set-Cookie": await commitSession(session),
        }
      });
  }
}
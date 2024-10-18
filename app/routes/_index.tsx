import { REDIRECT_URL } from '~/constants';
import { getSession } from '~/sessions';

import {
  Form,
  redirect,
} from '@remix-run/react';

const LOGIN_ACTION = 'LOGIN_ACTION';

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <span className="flex justify-start items-center">
            <img
              src="/react-india.svg"
              alt="React India Logo"
              className="m-5"
            />
            <img
              src="/contentstack.png"
              alt="Contentstack Logo"
            />
            <img
              src="/launch.png"
              alt="Launch Logo"
            />
          </span>
          <h1 className="leading text-2xl font-bold text-gray-800">
            Contentstack Portfolio Builder
          </h1>
        </header>
        <Form method="post">
          <nav className="flex flex-col items-center justify-center">
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
              type="submit"
              name="action"
              value={LOGIN_ACTION}>
              Authorize
            </button>
            <a className='text-blue-400 hover:underline' rel='noreferrer' href="https://www.contentstack.com/explorerindia" target='_blank'>
              First register yourself for free with Contentstack Explorer India
            </a>
          </nav>
        </Form>
      </div>
    </div >
  );
}

export async function loader({ request }: { request: Request }) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (session.has('accessToken')) {
    return redirect('/build');
  }

  return null;
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();

  switch (formData.get('action')) {
    case LOGIN_ACTION:
      return redirect(REDIRECT_URL);
  }
}
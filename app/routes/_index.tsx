import { REDIRECT_URL } from '~/constants';
import { getSession } from '~/sessions';

import {
  Form,
  redirect,
} from '@remix-run/react';

const LOGIN_ACTION = 'LOGIN_ACTION';

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#2D57E8] via-[#6C1D5F] to-[#2D57E8]">
      <div className="flex flex-col items-center gap-12 max-w-2xl p-8 rounded-2xl shadow-lg bg-white backdrop-blur-md">
        <header className="flex flex-col items-center gap-8">
          <div className="flex justify-center items-center space-x-8">
            <img
              src="/react-india.svg"
              alt="React India Logo"
              className="h-16 object-contain"
            />
            <img
              src="/contentstack.png"
              alt="Contentstack Logo"
              className="h-16 object-contain"
            />
            <img
              src="/launch.png"
              alt="Launch Logo"
              className="h-16 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            Contentstack Portfolio Builder
          </h1>
          <p className="text-gray-600 text-center max-w-md">
            Create your professional portfolio in minutes with our easy-to-use builder
          </p>
        </header>
        
        <div className="flex flex-col gap-4 w-full max-w-md">
          <a 
            href="https://www.contentstack.com/explorerindia" 
            target='_blank' 
            rel='noreferrer'
            className="w-full px-6 py-3 text-center text-white bg-gradient-to-r from-[#2D57E8] to-[#6C1D5F] hover:from-[#2042c0] hover:to-[#521748] rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Register for Explorer India
          </a>
          
          <Form method="post">
            <button
              type="submit"
              name="action"
              value={LOGIN_ACTION}
              className="w-full px-6 py-3 text-center text-[#2D57E8] bg-white border-2 border-[#2D57E8] hover:bg-blue-50 rounded-lg font-medium transition-all duration-200"
            >
              Create Portfolio
            </button>
          </Form>
        </div>
      </div>
    </div>
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
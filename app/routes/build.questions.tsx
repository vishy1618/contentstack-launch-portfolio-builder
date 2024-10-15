/* eslint-disable no-case-declarations */
import {
  commitSession,
  ContentTypeDetails,
  getSession,
  SessionProgress,
  StackDetails,
} from '~/sessions';

import {
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node';
import {
  Form,
  redirect,
  useActionData,
  useNavigation,
} from '@remix-run/react';
import { createPortfolioContentType, createDeliveryTokenForEnvironment, createEntryForPortfolioContentType, createEnvironment, createPortfolioWebsiteStack, QuestionAnswers, uploadFileToAssets } from '~/stack-repository';
import { PORTFOLIO_CONTENT_TYPE_UID, PORTFOLIO_DP_DIRECTORY, STACK_ENVIRONMENT } from '~/constants';

const SUBMIT_QUESTIONS = 'SUBMIT_QUESTIONS';
const FIVE_MB = 5242880;
const MAX_NAME_LENGTH = 200;
const MAX_DESIGNATION_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

export default function Questions() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading' || navigation.state === 'submitting';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateFileSize = (event: any) => {
    if (event.target.files[0].size > FIVE_MB) {
      event.target.value = '';
      alert('Please select a display picture smaller than 5 MB in size');
      return false;
    }
  };

  return (
    <Form method="post" encType="multipart/form-data" className="px-4 py-16 space-y-4 shadow-lg">
      <div>
        <label className="sr-only" htmlFor="name">Name</label>
        <input
          className="w-full rounded-lg border-gray-200 p-3 text-sm"
          placeholder="Name"
          type="text"
          id="name"
          name="name"
          maxLength={MAX_NAME_LENGTH}
        />
        {actionData?.errors?.name ? (
          <em className="text-red-500">{actionData?.errors.name}</em>
        ) : null}
      </div>

      <div>
        <label className="sr-only" htmlFor="designation">Designation</label>
        <input
          className="w-full rounded-lg border-gray-200 p-3 text-sm"
          placeholder="Designation"
          type="text"
          id="designation"
          name="designation"
          maxLength={MAX_DESIGNATION_LENGTH}
        />
        {actionData?.errors?.designation ? (
          <em className="text-red-500">{actionData?.errors.designation}</em>
        ) : null}
      </div>

      <div>
        <label className="sr-only" htmlFor="description">Describe yourself in 2 sentences</label>
        <textarea
          className="w-full rounded-lg border-gray-200 p-3 text-sm"
          placeholder="Describe yourself in 2 sentences"
          id="description"
          name="description"
          maxLength={MAX_DESCRIPTION_LENGTH}
        />
        {actionData?.errors?.description ? (
          <em className="text-red-500">{actionData?.errors.description}</em>
        ) : null}
      </div>

      <div>
        <label htmlFor="dp">Display Picture</label>
        <input
          className="w-full rounded-lg border-gray-200 p-3 text-sm"
          placeholder="Display Picture"
          type="file"
          accept=".jpg,.png"
          id="dp"
          name="dp"
          onChange={validateFileSize}
        />
        {actionData?.errors?.dp ? (
          <em className="text-red-500">{actionData?.errors.dp}</em>
        ) : null}
      </div>

      <div>
        <label className="sr-only" htmlFor="linkedin">LinkedIn Profile URL</label>
        <input
          className="w-full rounded-lg border-gray-200 p-3 text-sm"
          placeholder="LinkedIn Profile URL"
          type="url"
          id="linkedin"
          name="linkedin"
          maxLength={MAX_NAME_LENGTH}
        />
        {actionData?.errors?.linkedin ? (
          <em className="text-red-500">{actionData?.errors.linkedin}</em>
        ) : null}
      </div>

      <div>
        <label className="sr-only" htmlFor="github">GitHub Profile URL</label>
        <input
          className="w-full rounded-lg border-gray-200 p-3 text-sm"
          placeholder="GitHub Profile URL"
          type="url"
          id="github"
          name="github"
          maxLength={MAX_NAME_LENGTH}
        />
        {actionData?.errors?.github ? (
          <em className="text-red-500">{actionData?.errors.github}</em>
        ) : null}
      </div>

      <div>
        <label className="sr-only" htmlFor="x">X Profile URL</label>
        <input
          className="w-full rounded-lg border-gray-200 p-3 text-sm"
          placeholder="X Profile URL"
          type="url"
          id="x"
          name="x"
          maxLength={MAX_NAME_LENGTH}
        />
        {actionData?.errors?.x ? (
          <em className="text-red-500">{actionData?.errors.x}</em>
        ) : null}
      </div>

      <div>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
          type="submit"
          name="action"
          value={SUBMIT_QUESTIONS}
          disabled={isLoading}>
          {isLoading ? <Loader /> : 'Submit'}
        </button>
      </div>
    </Form>
  );
}

function Loader() {
  return (
    <>
      <svg aria-hidden="true" className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
      </svg>
      <span className="sr-only">Loading...</span>
    </>
  );
}

export async function loader({ request }: { request: Request }) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (session.has('stackDetails')) {
    return redirect('/build/deploy');
  }

  return null;
}

export async function action({ request }: { request: Request }) {
  const session = await getSession(
    request.headers.get('Cookie')
  );
  let assetFileName = '';
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: FIVE_MB,
      file: ({ filename }) => {
        console.log('filename', filename);
        assetFileName = `${PORTFOLIO_DP_DIRECTORY}/${filename}`;
        return filename;
      },
      directory: PORTFOLIO_DP_DIRECTORY,
    }),

    // parse everything else into memory
    unstable_createMemoryUploadHandler(),
  );
  console.log('assetFileName', assetFileName);
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );

  switch (formData.get('action')) {
    case SUBMIT_QUESTIONS:
      const errors = validateData(formData);

      if (Object.keys(errors).length > 0) {
        return json({ errors });
      }

      const accessToken = session.get('accessToken') as string;
      const organizationUid = session.get('organizationUid') as string;
      const environmentName = STACK_ENVIRONMENT;
      const portfolioContentTypeUid = PORTFOLIO_CONTENT_TYPE_UID;

      const portfolioQuestionsAnswers: QuestionAnswers = {
        name: formData.get('name') as string,
        designation: formData.get('designation') as string,
        description: formData.get('description') as string,
        dp: assetFileName,
        x: formData.get('x') as string,
        linkedin: formData.get('linkedin') as string,
        github: formData.get('github') as string,
      };

      // create stack
      const apiKey = await createPortfolioWebsiteStack(accessToken, organizationUid);
      
      // create content type
      // create environment
      // save asset
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [ , , assetUid ] = await Promise.all([
        createPortfolioContentType(accessToken, apiKey, portfolioContentTypeUid),
        createEnvironment(accessToken, apiKey, environmentName),
        uploadFileToAssets(accessToken, apiKey, portfolioQuestionsAnswers.dp),
      ]);

      // create delivery token
      // create entry
      const [ deliveryToken, entryUid ] = await Promise.all([
        createDeliveryTokenForEnvironment(accessToken, apiKey, environmentName),
        createEntryForPortfolioContentType(accessToken, apiKey, portfolioContentTypeUid, environmentName, portfolioQuestionsAnswers),
      ]);

      const stackDetails: StackDetails = {
        apiKey,
        deliveryToken,
        environment: environmentName,
      };

      const contentDetails: ContentTypeDetails = {
        contentType: portfolioContentTypeUid,
        entryUid,
        assetUid,
      };

      session.set('progress', SessionProgress.DEPLOYMENT);
      session.set('stackDetails', stackDetails);
      session.set('contentDetails', contentDetails);

      return redirect('/build/deploy', {
        headers: {
          'Set-Cookie': await commitSession(session),
        }
      });
  }
}

function validateData(formData: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = String(formData.get('name') || '');
  const designation = String(formData.get('designation') || '');
  const description = String(formData.get('description') || '');
  const linkedin = String(formData.get('linkedin') || '');
  const github = String(formData.get('github') || '');
  const x = String(formData.get('x') || '');

  if (!(name.trim().length > 0)) {
    errors.name = 'Name is required';
  }

  if (!(designation.trim().length > 0)) {
    errors.name = 'Designation is required';
  }

  if (!(description.trim().length > 0)) {
    errors.description = 'Description is required';
  }

  if (name.length > MAX_NAME_LENGTH) {
    errors.name = `Name is longer than ${MAX_NAME_LENGTH} characters`;
  }

  if (designation.length > MAX_DESIGNATION_LENGTH) {
    errors.name = `Designation is longer than ${MAX_DESIGNATION_LENGTH} characters`;
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description is longer than ${MAX_DESCRIPTION_LENGTH} characters`;
  }

  if (linkedin.length > MAX_NAME_LENGTH) {
    errors.linkedin = `LinkedIn URL is longer than ${MAX_NAME_LENGTH} characters`;
  }

  if (github.length > MAX_NAME_LENGTH) {
    errors.github = `GitHub URL is longer than ${MAX_NAME_LENGTH} characters`;
  }

  if (x.length > MAX_NAME_LENGTH) {
    errors.x = `X URL is longer than ${MAX_NAME_LENGTH} characters`;
  }

  return errors;
}
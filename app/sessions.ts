import { createCookieSessionStorage } from '@remix-run/node';

export enum SessionProgress {
  QUESTIONS,
  DEPLOYMENT,
  COMPLETED,
};

export type StackDetails = {
  apiKey: string;
  deliveryToken: string;
  environment: string;
};

export enum DeploymentStatus {
  QUEUED = 'QUEUED',
  LIVE = 'LIVE',
  DEPLOYED = 'DEPLOYED',
  ARCHIVED = 'ARCHIVED',
  DEPLOYING = 'DEPLOYING',
  SKIPPED = 'SKIPPED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
};

export type LaunchProjectDetails = {
  projectUid: string;
  environmentUid: string;
  deploymentUid: string;
};

type SessionData = {
  accessToken: string;
  refreshToken: string;
  organizationUid: string;
  progress: SessionProgress;
  stackDetails: StackDetails;
  launchProjectDetails: LaunchProjectDetails;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      cookie: {
        name: "__session",
        secure: true,
        maxAge: 86400,
      },
    }
  );

export { commitSession, destroySession, getSession };

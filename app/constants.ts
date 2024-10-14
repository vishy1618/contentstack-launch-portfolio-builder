export const CONTENTSTACK_APP_URL = 'https://app.contentstack.com';
export const CONTENTSTACK_API_URL = 'https://api.contentstack.io';
export const CONTENTSTACK_LAUNCH_API_URL = 'https://launch-api.contentstack.com';
export const CONTENTSTACK_APP_UID = process.env.CONTENTSTACK_APP_UID;
export const CONTENTSTACK_APP_CLIENT_ID = process.env.CONTENTSTACK_APP_CLIENT_ID;
export const CONTENTSTACK_APP_CLIENT_SECRET = process.env.CONTENTSTACK_APP_CLIENT_SECRET;
export const OAUTH_REDIRECT_URI = process.env['OAUTH_REDIRECT_URI'] || 'http://localhost:3000/oauth/callback';
export const REDIRECT_URL = `${CONTENTSTACK_APP_URL}/apps/${CONTENTSTACK_APP_UID}/authorize?client_id=${CONTENTSTACK_APP_CLIENT_ID}&redirect_uri=${encodeURIComponent(OAUTH_REDIRECT_URI)}&response_type=code`;
export const TOKEN_URL = `${CONTENTSTACK_APP_URL}/apps-api/apps/token`;
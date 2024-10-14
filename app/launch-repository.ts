import fs from 'fs';
import path from 'path';
import { CONTENTSTACK_LAUNCH_API_URL } from "./constants";
import { LaunchProjectDetails } from "./sessions";

export type EnvironmentVariables = {
  key: string;
  value: string;
}[];

type SignedUploadUrl = {
  "expiresIn": number,
  "uploadUid": string,
  "uploadUrl": string,
  "method": string,
  "fields": {
          "formFieldKey": string,
          "formFieldValue": string
      }[]
  ,
  "headers": null
}

export async function createProject(
  accessToken: string,
  organizationUid: string,
  environmentVariables: EnvironmentVariables,
): Promise<LaunchProjectDetails> {

  const headers = new Headers();
  headers.append('Authorization', `Bearer ${accessToken}`);
  headers.append('organization_uid', organizationUid);
  headers.append('Content-Type', 'application/json');

  const signedUploadUrl = await getPresiginedUrl(accessToken, organizationUid);
  const uploadResult = await uploadProjectFile(signedUploadUrl);
  // const createLaunchProjectResult = await createLaunchProject(accessToken, organizationUid, signedUploadUrl.uploadUid, environmentVariables);


  return {} as LaunchProjectDetails;
}

async function getPresiginedUrl(accessToken: string, organizationUid: string): Promise<SignedUploadUrl> {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'content-type': 'application/json',
      'organization_uid': organizationUid,
    
    },
    body: JSON.stringify({
      operationName: "CreateSignedUploadUrl",
      variables: {},
      query: `mutation CreateSignedUploadUrl {
        createSignedUploadUrl {
          expiresIn
          uploadUid
          uploadUrl
          method
          fields {
            formFieldKey
            formFieldValue
          }
          headers {
            key
            value
          }
        }
      }`
    })
  };
  try {
    const response = await fetch(
      `${CONTENTSTACK_LAUNCH_API_URL}/manage/graphql`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error("Failed to create signed upload URL");
    }
    const responseBody = await response.json();
    return responseBody.data.createSignedUploadUrl;
    
  } catch (error) {
    console.error("Project creation error", error);
    throw error;
  }
}

async function uploadProjectFile(signedUploadUrl: SignedUploadUrl) {
  const filePath = path.join(process.cwd(), 'app/build/portfolio-site.zip');
  const fileBuffer = await fs.promises.readFile(filePath);
  const fileBlob = new Blob([fileBuffer]);

  const formData = new FormData();
  for (const field of signedUploadUrl.fields) {
    formData.append(field.formFieldKey, field.formFieldValue);
  }
  formData.append('file', fileBlob, path.basename(filePath));

  const response = await fetch(signedUploadUrl.uploadUrl, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`);
  }
}

async function createLaunchProject(accessToken: string, organizationUid: string, uploadUid: string, environmentVariables: EnvironmentVariables) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'content-type': 'application/json',
    'organization_uid': organizationUid,
  };

  const random = Math.random().toString(36).substring(2, 8);
  const body = JSON.stringify({
    operationName: "CreateProject",
    variables: {},
    query: `mutation CreateProject {
      importProject(
        project: {
          name: "portfolio-${random}",
          fileUpload: { uploadUid: "${uploadUid}" },
          projectType: "FILEUPLOAD",
          environment: {
            name: "Default",
            frameworkPreset: "OTHER",
            buildCommand: "npm run build",
            outputDirectory: "./build",
            environmentVariables: [
              ${environmentVariables.map(({ key, value }) => `{ "key": "${key}", "value": "${value}" }`).join(", ")}
            ],
            serverCommand: "npm run start"
          }
        }
      ) {
        projectType
        name
        uid
        environments {
          uid
          deployments(first: 1, after: "", sortBy: "createdAt") {
            edges {
              node {
                uid
              }
            }
          }
        }
        description
      }
    }`
  });
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: body
  };
  console.log(JSON.stringify(requestOptions))
  try {
    console.log("000")
    const response = await fetch(`${CONTENTSTACK_LAUNCH_API_URL}/manage/graphql`, requestOptions);

    console.log(0)
    const responseBody = await response.text();
    console.log(responseBody)
    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`);
    }

    console.log(1)
    // return responseBody.data.importProject;
  } catch (error) {
    console.error("Project creation error", error);
    throw error;
  }
}
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

import { CONTENTSTACK_API_URL } from './constants';

export type QuestionAnswers = {
  name: string;
  description: string;
  dp: string;
  designation: string;
  x?: string;
  linkedin?: string;
  github?: string;
};

export async function createPortfolioWebsiteStack(
  accessToken: string,
  organizationUid: string,
): Promise<string> {
  console.log("Creating Stack");
  let apiKey = '';

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${accessToken}`);
  myHeaders.append('organization_uid', organizationUid);
  myHeaders.append('Content-Type', 'application/json');

  const stackCreateBody = JSON.stringify({
    stack: {
      name: 'Portfolio Website',
      description: 'Portfolio website content from React India 2024 conference',
      master_locale: 'en-us',
    },
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: stackCreateBody,
  };

  try {
    const response = await fetch(
      `${CONTENTSTACK_API_URL}/v3/stacks`,
      requestOptions
    );
    const result = await response.json();
    if (!response.ok) {
      throw result;
    }
    apiKey = result.stack.api_key;
    console.log("Stack created");
  } catch (error) {
    console.error("Stack creation error", error);
    throw error;
  }

  return apiKey;
}

export async function createPortfolioContentType(
  accessToken: string,
  apiKey: string,
  contentTypeUid: string
): Promise<void> {
  console.log("Creating content type");
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${accessToken}`);
  myHeaders.append("api_key", apiKey);
  myHeaders.append("Content-Type", "application/json");

  const createContentTypeBody = JSON.stringify({
    content_type: {
      title: "Portfolio",
      uid: contentTypeUid,
      schema: [
        {
          display_name: "Name",
          uid: "name",
          data_type: "text",
          field_metadata: {
            allow_rich_text: false,
            multiline: false,
          },
          mandatory: false,
          unique: false,
          multiple: false,
        },
        {
          display_name: "Designation",
          uid: "designation",
          data_type: "text",
          field_metadata: {
            _default: true,
          },
          unique: false,
          mandatory: false,
          multiple: false,
        },
        {
          display_name: "Description",
          uid: "description",
          data_type: "text",
          field_metadata: {
            allow_rich_text: false,
            multiline: true,
          },
          mandatory: false,
          unique: false,
          multiple: false,
        },
        {
          display_name: "Linkedin Profile",
          uid: "linkedin",
          data_type: "text",
          field_metadata: {
            _default: true,
          },
          unique: false,
          mandatory: false,
          multiple: false,
        },
        {
          display_name: "X Profile",
          uid: "x",
          data_type: "text",
          field_metadata: {
            _default: true,
          },
          unique: false,
          mandatory: false,
          multiple: false,
        },
        {
          display_name: "Github Profile",
          uid: "github",
          data_type: "text",
          field_metadata: {
            _default: true,
          },
          unique: false,
          mandatory: false,
          multiple: false,
        },
        {
          data_type: "file",
          display_name: "Display Picture",
          uid: "dp",
          extensions: [],
          field_metadata: {
            description: "",
            rich_text_type: "standard",
          },
          mandatory: false,
          multiple: false,
          non_localizable: false,
          unique: false,
        },
      ],
      options: {
        publishable: true,
        is_page: false,
        singleton: true,
        title: "name",
        sub_title: [],
      },
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: createContentTypeBody
  };

  try {
    const response = await fetch(
      `${CONTENTSTACK_API_URL}/v3/content_types`,
      requestOptions
    );
    const result = await response.json();
    if (!response.ok) {
      throw result;
    }
    console.log("Content Type created");
  } catch (error) {
    console.error("Content type creation error: ", error);
    throw error;
  }
}

export async function createEnvironment(
  accessToken: string,
  apiKey: string,
  environmentName: string
): Promise<void> {
  console.log("Creating Environment");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append('Authorization', `Bearer ${accessToken}`);
  myHeaders.append("api_key", apiKey);

  const createEnvironmentBody = JSON.stringify({
    environment: {
      name: environmentName,
      urls: [
        {
          locale: "en-us",
          url: "",
        },
      ],
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: createEnvironmentBody
  };

  try {
    const response = await fetch(
      `${CONTENTSTACK_API_URL}/v3/environments`,
      requestOptions
    );
    const result = await response.json();
    if (!response.ok) {
      throw result;
    }
    console.log("Environment created");
  } catch (error) {
    console.error("Environment creation error", error);
    throw error;
  }
}

export async function createDeliveryTokenForEnvironment(
  accessToken: string,
  apiKey: string,
  environmentName: string
): Promise<string> {
  console.log("Creating Delivery Token");
  let deliveryToken = '';

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append('Authorization', `Bearer ${accessToken}`);
  myHeaders.append("api_key", apiKey);

  const createDeliveryTokenBody = JSON.stringify({
    token: {
      description: "",
      name: "Delivery",
      scope: [
        {
          module: "environment",
          acl: {
            read: true,
          },
          environments: [environmentName],
        },
        {
          module: "branch",
          acl: {
            read: true,
          },
          branches: ["main"],
        },
      ],
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: createDeliveryTokenBody
  };

  try {
    const response = await fetch(
      `${CONTENTSTACK_API_URL}/v3/stacks/delivery_tokens`,
      requestOptions
    );
    const result = await response.json();
    if (!response.ok) {
      throw result;
    }
    deliveryToken = result.token.token;
    console.log("Delivery Token created");
  } catch (error) {
    console.error("Delivery Token creation error", error);
    throw error;
  }

  return deliveryToken;
}

export async function uploadDPFileToAssets(
  accessToken: string,
  apiKey: string,
  dpFilePath: string,
  environmentName: string,
): Promise<string> {
  console.log("Uploading asset");
  let assetUid = '';

  const formData = new FormData();
  formData.append("asset[upload]", fs.createReadStream(dpFilePath));

  const headers = {
    ...formData.getHeaders(),
    api_key: apiKey,
    Authorization: `Bearer ${accessToken}`,
    "cache-control": "no-cache",
  };

  try {
    const response = await axios.post(
      `${CONTENTSTACK_API_URL}/v3/assets`,
      formData,
      {
        headers,
      }
    );

    console.log("Asset uploaded successfully");
    assetUid = response.data.asset.uid;
  } catch (error) {
    console.error("Error uploading asset:", error);
    throw error;
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await publishAsset(accessToken, apiKey, environmentName, assetUid);

  return assetUid;
}

export async function createEntryForPortfolioContentType(
  accessToken: string,
  apiKey: string,
  contentTypeUid: string,
  environmentName: string,
  dpAssetUid: string,
  questionAnswers: QuestionAnswers
): Promise<string> {
  console.log("Creating Entry");
  let entryUid = '';

  const myHeaders = new Headers();
  myHeaders.append("api_key", apiKey);
  myHeaders.append('Authorization', `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  const createEntryBody = JSON.stringify({
    entry: {
      name: questionAnswers.name,
      designation: questionAnswers.designation,
      description: questionAnswers.description,
      dp: dpAssetUid,
      linkedin: questionAnswers.linkedin,
      github: questionAnswers.github,
      x: questionAnswers.x,
      tags: [],
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: createEntryBody
  };

  try {
    const response = await fetch(
      `${CONTENTSTACK_API_URL}/v3/content_types/${contentTypeUid}/entries?locale=en-us`,
      requestOptions
    );
    const result = await response.json();
    if (!response.ok) {
      throw result;
    }
    entryUid = result.entry.uid;
    console.log("Entry created");

    await publishEntry(accessToken, apiKey, contentTypeUid, environmentName, entryUid);
  } catch (error) {
    console.error("Entry creation error", error);
    throw error;
  }

  return entryUid;
}

async function publishEntry(
  accessToken: string,
  apiKey: string,
  contentTypeUid: string,
  environmentName: string,
  entryUid: string
): Promise<void> {
  console.log("Publishing Entry");

  const myHeaders = new Headers();
  myHeaders.append("api_key", apiKey);
  myHeaders.append('Authorization', `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  const publishEntryBody = JSON.stringify({
    entry: {
      environments: [environmentName],
      locales: ["en-us"],
    },
    locale: "en-us",
    version: 1,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: publishEntryBody
  };

  try {
    const response = await fetch(
      `${CONTENTSTACK_API_URL}/v3/content_types/${contentTypeUid}/entries/${entryUid}/publish`,
      requestOptions
    );
    const result = await response.json();
    if (!response.ok) {
      throw result;
    }
    console.log("Entry Published");
  } catch (error) {
    console.error("Entry Publishing error", error);
    throw error;
  }
}

async function publishAsset(
  accessToken: string,
  apiKey: string,
  environmentName: string,
  assetUid: string
): Promise<void> {
  console.log("Publishing Asset");

  const myHeaders = new Headers();
  myHeaders.append("api_key", apiKey);
  myHeaders.append('Authorization', `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  /*
    { "asset": { "locales": [ "en-us" ], "environments": [ "development" ] }, "version": 1, "scheduled_at": "2019-02-08T18:30:00.000Z" }
  */

  const publishAssetBody = JSON.stringify({
    asset: {
      environments: [environmentName],
      locales: ["en-us"],
    },
    version: 1,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: publishAssetBody
  };

  try {
    const response = await fetch(
      `${CONTENTSTACK_API_URL}/v3/assets/${assetUid}/publish`,
      requestOptions
    );
    const result = await response.json();
    console.log(`Asset publishing response: ${JSON.stringify(result)}`);
    console.log(`Asset details: ${assetUid} to ${environmentName}`);
    if (!response.ok) {
      throw result;
    }
    console.log("Asset Published");
  } catch (error) {
    console.error("Asset Publishing error", error);
    throw error;
  }
}



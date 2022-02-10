import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

import remark from "remark";
import html from "remark-html";

const providersDirectory = path.join(process.cwd(), "providers");

export async function getProviderData(providerid) {
  const provider_req = await fetch(
    `${process.env.RUNNER_URL}/flavors/${providerid}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );
  const provider = await provider_req.json();
  return {
    id: provider.name,
    name: provider.display_name,
    url: provider.url,
    logo: provider.logo,
    contentHtml: provider.description,
    pricing: provider.pricing,
  };
}

export async function getProvidersList() {
  const providers_req = await fetch(
    `${process.env.RUNNER_URL}/providers`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );
  const providers = await providers_req.json();
  return providers.providers.map(({name}) => {
    return {
      params: {
        provider: name,
      },
    };
  });
}

export async function getProvidersData() {
  // Get file names
  const providers_req = await fetch(
    `${process.env.RUNNER_URL}/providers`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );
  const providers = await providers_req.json();
  const providersData = providers.providers.map(({name, display_name, url, logo, description}) => {
    return {
        id: name,
        name: display_name,
        url: url,
        logo: logo,
        contentHtml: description
    };
  });
  return providersData.sort(({ name: a }, { name: b }) => {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  });
}

export async function getFlavorsData(providerid) {
  const provider_req = await fetch(
    `${process.env.RUNNER_URL}/flavors/${providerid}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );
  const provider = await provider_req.json();
  return provider.pricing
}

export async function getFlavorsList(providerid) {
  const fullPath = path.join(providersDirectory, providerid, "flavors");
  const fileNames = fs.readdirSync(fullPath);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName,
      },
    };
  });
}

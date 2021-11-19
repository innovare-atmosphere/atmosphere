import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

import remark from "remark";
import html from "remark-html";

const providersDirectory = path.join(process.cwd(), "providers");

export async function getProviderData(providerid) {
  // Read graymatter-markdown file as string
  const fullPath = path.join(providersDirectory, providerid, "META.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  // Use gray-matter to parse the provider metadata section
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Read README.md file as string
  const fullPathReadme = path.join(providersDirectory, providerid,"flavors", "README.md");
  const readmeContents = fs.existsSync(fullPathReadme)? fs.readFileSync(fullPathReadme, "utf8"): "";
  const processedReadme = await remark()
    .use(html)
    .process(readmeContents);
  const readmeHtml = processedReadme.toString();
  // Combine the data with the id
  return {
    id: providerid,
    contentHtml,
    readmeHtml,
    ...matterResult.data,
  };
}

export async function getProvidersList() {
  const fileNames = fs.readdirSync(providersDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        provider: fileName,
      },
    };
  });
}

export async function getProvidersData() {
  // Get file names
  const fileNames = fs.readdirSync(providersDirectory);
  const allProvidersData = await Promise.all(
    fileNames.map(async (fileName) => getProviderData(fileName))
  );
  return allProvidersData.sort(({ fileName: a }, { fileName: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export async function getFlavorsData(providerid) {
  const fullPath = path.join(providersDirectory, providerid, "flavors");
  const options = { withFileTypes: true };
  const files = fs.readdirSync(fullPath, options);
  const filterFiles = files.filter(
    (x) => x.isDirectory() && !x.name.startsWith(".")
  );
  const allFlavorsData = await Promise.all(
    filterFiles.map(async (file) => {
      return { provider: providerid, flavor: file.name };
    })
  );
  return allFlavorsData.sort(({ fileName: a }, { fileName: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
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

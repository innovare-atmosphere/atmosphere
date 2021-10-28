import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import path from "path";
import VersionSelector from "../../../components/versionSelector";
import FormBuilder from "../../../components/formBuilder";
import LogViewer from "../../../components/logViewer";
import Captcha from "../../../components/captcha";
import SimpleDialog from "../../../components/simpleDialog";
import { useLocalStorage } from "../../../lib/useLocalStorage";
import {
  getProvidersList,
  getProviderData,
  getFlavorsData,
} from "../../../lib/providers";

export async function getStaticPaths() {
  const paths = await getProvidersList();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const providerData = await getProviderData(params.provider);
  const allFlavors = await getFlavorsData(params.provider);
  return {
    props: {
      providerData,
      allFlavors,
    },
  };
}

export default function Wizard({ providerData, allFlavors }) {
  const [token, setToken] = useLocalStorage(
    `atmosphere-token${process.env.NEXT_PUBLIC_VERSION}`,
    ""
  );
  const [activeTab, setActiveTab] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState(providerData.name);
  const [selectedFlavor, setSelectedFlavor] = useState(undefined);
  const [uuid, setUuid] = useState(undefined);
  return (
    <>
      <div className="flex flex-col min-h-screen py-2">
        <Head>
          <title>Atmosphere - Wizard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {!token && (
          <SimpleDialog
            title="Welcome human!"
            description="This is probably your first time here"
          >
            <p>We need to make sure you're a real person</p>
            <Captcha
              captchaValidator={(x) => {
                if (x.valid) {
                  setToken(x.token);
                }
              }}
            ></Captcha>
          </SimpleDialog>
        )}
        <main className="flex flex-col items-left w-full flex-1 px-20 text-center">
          {activeTab == 0 && (
            <Link href={path.join("/")}>
              <a className="flex w-32 justify-center rounded text-gray-400 bg-gray-100 items-center py-2 mb-2 hover:text-white hover:bg-gray-500 hover:shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>{" "}
                Back
              </a>
            </Link>
          )}
          {activeTab > 0 && (
            <a
              onClick={() => setActiveTab(activeTab - 1)}
              className="flex w-32 justify-center rounded text-gray-400 bg-gray-100 items-center py-2 mb-2 hover:text-white hover:bg-gray-500 hover:shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>{" "}
              Back
            </a>
          )}
          <div className="flex flex-row justify-center space-x-0 text-sm">
            <a
              onClick={() => setActiveTab(0)}
              className={`flex w-full justify-center rounded-tl text-white ${
                activeTab == 0 ? "bg-purple-500" : "bg-purple-400"
              } items-center px-4 py-1`}
            >
              Step 1 - Select Version
            </a>
            <a
              onClick={() => setActiveTab(1)}
              className={`flex w-full justify-center  text-gray-100 ${
                activeTab == 1 ? "bg-purple-500" : "bg-purple-400"
              } items-center px-4 py-1`}
            >
              Step 2 - Customization
            </a>
            <a
              onClick={() => setActiveTab(2)}
              className={`flex w-full justify-center  text-gray-100 ${
                activeTab == 2 ? "bg-purple-500" : "bg-purple-400"
              } items-center px-4 py-1`}
            >
              Step 3 - Launch summary
            </a>
          </div>
          <div className="bg-gray-200 rounded-br rounded-bl pt-3 pb-3">
            <div className="justify-center items-center flex w-full">
              <img className="p-2 w-auto h-48" src={providerData.logo} />
            </div>
            <h1 className="text-3xl mx-64 mb-3 text-center text-gray-700 font-bold">
              {providerData.name}
            </h1>
            <h2 className="text-l text-justify mx-64">
              <div
                dangerouslySetInnerHTML={{ __html: providerData.contentHtml }}
              />
            </h2>
          </div>
          <div className="flex flex-col text-left">
            {activeTab == 0 && (
              <VersionSelector
                flavors={allFlavors}
                callback={(provider, flavor) => {
                  setSelectedProvider(provider);
                  setSelectedFlavor(flavor);
                  setActiveTab(1);
                }}
              ></VersionSelector>
            )}
            {activeTab == 1 && (
              <FormBuilder
                flavor={selectedFlavor}
                provider={selectedProvider}
                executeCallback={(data) => {
                  setUuid(data.uuid);
                  setActiveTab(2);
                }}
              ></FormBuilder>
            )}
            {activeTab == 2 && <LogViewer uuid={uuid}></LogViewer>}
          </div>
        </main>

        <footer className="flex items-center justify-center w-full h-24 border-t">
          <a
            className="flex items-center justify-center"
            href="https://innovare.es"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <img src="/innovare.svg" alt="Innovare Logo" className="h-4 ml-2" />
          </a>
        </footer>
      </div>
    </>
  );
}

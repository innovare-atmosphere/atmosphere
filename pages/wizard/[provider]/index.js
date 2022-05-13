import Link from "next/link";
import { useState, useEffect } from "react";
import path from "path";
import Layout from "../../../components/layout";
import VersionSelector from "../../../components/versionSelector";
import FormBuilder from "../../../components/formBuilder";
import LogViewer from "../../../components/logViewer";
import Login from "../../../components/login";
import SimpleDialog from "../../../components/simpleDialog";
import useLocalStorage from "../../../lib/useLocalStorage";
import { useRouter } from "next/router";
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
  const { query } = useRouter();
  const [token, setToken] = useLocalStorage(`atmosphere-token`, "");
  const [activeTab, setActiveTab] = useState(query.uuid ? 2 : 0);
  const [selectedProvider, setSelectedProvider] = useState(providerData.name);
  const [selectedFlavor, setSelectedFlavor] = useState(undefined);
  const [uuid, setUuid] = useState(query.uuid);
  return (
    <>
      {!token && (
        <SimpleDialog
          title="Welcome human!"
          description="Is this your first time here?"
        >
          <p className="text-sm text-gray-800">We need some details to prepare Atmosphere for you.</p>
          <Login
            captchaValidator={(x) => {
              if (x.valid) {
                setToken(x.token);
              }
            }}
          ></Login>
        </SimpleDialog>
      )}
      <Layout className="dark:bg-gray-900 dark:text-gray-200 flex flex-col items-left justify-center w-full flex-1 px-2 md:px-20 text-center">
        {activeTab == 0 && (
          <Link href={path.join("/")}>
            <a className="dark:bg-gray-600 flex w-32 justify-center rounded text-gray-400 bg-gray-100 items-center py-2 mb-2 hover:text-white hover:bg-gray-500 hover:shadow">
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
            className="dark:bg-gray-600 cursor-pointer flex w-32 justify-center rounded text-gray-400 bg-gray-100 items-center py-2 mb-2 hover:text-white hover:bg-gray-500 hover:shadow"
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
            className={`cursor-pointer flex w-full justify-center rounded-tl text-white ${
              activeTab == 0 ? "bg-purple-500" : "bg-purple-400"
            } items-center px-4 py-1`}
          >
            Step 1 - Launch options
          </a>
          <a
            onClick={() => setActiveTab(1)}
            className={`cursor-pointer flex w-full justify-center  text-gray-100 ${
              activeTab == 1 ? "bg-purple-500" : "bg-purple-400"
            } items-center px-4 py-1`}
          >
            Step 2 - Customization
          </a>
          <a
            onClick={() => setActiveTab(2)}
            className={`cursor-pointer flex w-full justify-center  text-gray-100 ${
              activeTab == 2 ? "bg-purple-500" : "bg-purple-400"
            } items-center px-4 py-1`}
          >
            Step 3 - Launch summary
          </a>
        </div>
        <div className="dark:bg-gray-800 bg-gray-200 rounded-br rounded-bl pt-3 pb-3">
          <div className="justify-center items-center flex w-full">
            <img className="p-2 w-auto h-auto max-h-48" src={providerData.logo} />
          </div>
          <h1 className="dark:text-gray-400 text-3xl mx-4 lg:mx-64 mb-3 text-center text-gray-700 font-bold">
            {providerData.name}
          </h1>
          <div className="text-l text-justify mx-4 lg:mx-64">
            <div
              dangerouslySetInnerHTML={{ __html: providerData.contentHtml }}
            />
          </div>
        </div>
        <div className="flex flex-col text-left">
          {activeTab == 0 && (
            <>
              <VersionSelector
                flavors={allFlavors}
                provider={providerData}
                callback={(provider, flavor) => {
                  setSelectedProvider(provider);
                  setSelectedFlavor(flavor);
                  setActiveTab(1);
                }}
                token={token}
              ></VersionSelector>
              {/*providerData.readmeHtml && (
                <div className="flex flex-col text-left">
                  <a className="text-2xl text-align-left pt-5 mb-2 flex items-center">
                    About this software
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                  <div
                    className="markdown-body shadow-xl border px-4 py-2 overflow-auto max-h-60"
                    dangerouslySetInnerHTML={{
                      __html: providerData.readmeHtml,
                    }}
                  ></div>
                </div>
                  )*/}
            </>
          )}
          {activeTab == 1 && (
            <FormBuilder
              token={token}
              flavor={selectedFlavor}
              provider={selectedProvider}
              executeCallback={(data) => {
                setUuid(data.uuid);
                setActiveTab(2);
              }}
            ></FormBuilder>
          )}
          {activeTab == 2 && <LogViewer token={token} uuid={uuid}></LogViewer>}
        </div>
      </Layout>
    </>
  );
}

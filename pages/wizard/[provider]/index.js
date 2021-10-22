import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import path from 'path';
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
  return (
    <>
      <div className="flex flex-col min-h-screen py-2">
        <Head>
          <title>Atmosphere - Wizard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-left w-full flex-1 px-20 text-center">
        <Link href={path.join('/')}>
            <a className="flex w-32 justify-center rounded text-gray-400 bg-gray-100 items-center py-2 mb-2 hover:text-white hover:bg-gray-500 hover:shadow">
            {'<'} Back
            </a>
        </Link>
          <div className="flex flex-row justify-center space-x-0 text-sm">
            <a className="flex w-full justify-center rounded-tl text-white bg-purple-500 shaow items-center px-4 py-1 ">
              Step 1 - Select Version
            </a>
            <a className="flex w-full justify-center  text-gray-100 bg-purple-400 items-center px-4 py-1 hover:text-white hover:bg-purple-500 hover:shadow">
              Step 2 - Customization
            </a>
            <a className="flex w-full justify-center  text-gray-100 bg-purple-400 items-center px-4 py-1 hover:text-white hover:bg-purple-500 hover:shadow">
              Step 3 - Deployment settings
            </a>
            <a className="flex w-full justify-center  text-gray-100 bg-purple-400 items-center px-4 py-1 hover:text-white hover:bg-purple-500 hover:shadow">
              Step 4 - Summary
            </a>
            <a className="flex w-full justify-center rounded-tr text-gray-100 bg-purple-400 items-center px-4 py-1 hover:text-white hover:bg-purple-500 hover:shadow">
              Step 5 - Launch
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
            <h2 className="text-2xl text-align-left pt-5">Standard</h2>
            <div className="flex flex-row">
              {allFlavors.map(({ provider, flavor, description, name }) => (
                <div className="shadow w-full mr-2" key={flavor}>
                  <div className="bg-gray-200 rounded-t h-16"></div>
                  <div className="flex flex-row text-gray-500 text-center text-xs">
                    <div className="p-2">
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <p>100k+</p>
                    </div>
                    <div className="p-2">
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
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                      <p>4</p>
                    </div>
                  </div>
                  <p className="p-2 text-xl">
                    {name} <span className="text-sm">({flavor})</span>
                  </p>
                  <p className="p-2">{description}</p>
                  <Link href={path.join('/wizard',provider, flavor)}>
                    <a className="flex w-full justify-center rounded-b text-gray-100 bg-purple-400 items-center px-4 py-2 hover:text-white hover:bg-purple-500 hover:shadow">
                      Select
                    </a>
                  </Link>
                </div>
              ))}
            </div>
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

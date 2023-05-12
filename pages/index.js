import Link from "next/link";
import path from "path";
import Layout from "../components/layout";

import { getProvidersData } from "../lib/providers";

export async function getStaticProps() {
  const allProvidersData = await getProvidersData();
  return {
    props: {
      allProvidersData,
    },
  };
}

export default function Home({ allProvidersData }) {
  return (
    <>
      <Layout className="dark:bg-gray-900 dark:text-gray-200 flex flex-col items-left justify-center w-full flex-1 px-2 md:px-20 text-center">
        <h1 className="sm:text-6xl text-3xl font-bold">
          Welcome to{" "}
          <a className="text-purple-600" href="/">
            Atmosphere!
          </a>
        </h1>
        <p className="mt-3 text-2xl">
          Discover, install and use Free and Open Source software the easy route.
        </p>
        <p className="text-xl">
          We want to allow you effortlessly try and use free and open source software meant for the cloud.
        </p>
        <div className="flex flex-row mt-6">
          <div className="flex flex-col space-y-4 pb-4 w-full border">
            {allProvidersData.map(({ id, name, url, logo, contentHtml }) => (
              <div
                className="flex flex-col md:flex-row border m-4 mb-0 rounded"
                key={id}
              >
                <div className="w-full md:w-64 dark:to-gray-600 dark:from-gray-800 bg-gradient-to-t to-gray-300 from-gray-200 border-r rounded-l">
                  <div className="justify-center items-center flex md:w-64">
                    <img className="p-2 w-auto h-14" src={logo} />
                  </div>
                  <div className="flex flex-row p-2 justify-center">
                    <Link href={path.join("/wizard", id)}>
                      <a className="flex w-full justify-center rounded text-gray-100 bg-purple-400 items-center px-4 py-2 mx-1 hover:text-white hover:bg-purple-500 hover:shadow">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 pr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Run your own
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="text-justify mx-1 pl-2 pt-2">
                  <div className="flex flex-row space-x-2">
                    <p className="flex text-black-400 text-lg font-medium pb-2">
                      {name}
                    </p>
                    <a target="_blank" className="flex text-gray-500 text-sm h-5 p-1 bg-blue-100 items-center rounded-2xl" href={url}>
                      {" "}
                      Website
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                  <div className="md:max-h-16 overflow-auto">
                    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

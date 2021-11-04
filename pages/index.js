import Head from "next/head";
import Link from "next/link";
import path from "path";
import Captcha from "../components/captcha";
import SimpleDialog from "../components/simpleDialog";
import useLocalStorage from "../lib/useLocalStorage";

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
  const [token, setToken] = useLocalStorage(
    `atmosphere-token${process.env.NEXT_PUBLIC_VERSION}`,
    ""
  );
  return (
    <>
      {!token && (
        <SimpleDialog
          title="Welcome human!"
          description="This is probably your first time here (or we did some changes)"
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
      <div className="flex flex-row-reverse space-x-4 space-x-reverse p-2">
        <a
          className="flex text-gray-400 items-center border px-4 py-2 hover:text-gray-600 hover:shadow"
          href="https://github.com/innovare-atmosphere"
        >
          Github
        </a>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Head>
          <title>Atmosphere - ready, set, launch</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-left justify-center w-full flex-1 px-2 md:px-20 text-center">
          <h1 className="text-6xl font-bold">
            Welcome to{" "}
            <a
              className="text-purple-600"
              href="https://atmosphere.innovare.es"
            >
              Atmosphere!
            </a>
          </h1>
          <p className="mt-3 text-2xl">
            Select, launch and use Free and Open Source software sass easy.
          </p>
          <div className="flex flex-row mt-6">
            {/*<div className="flex flex-col w-1/5 hidden">
              <div className="flex bg-gray-400 text-gray-100 items-center px-4 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Categories
              </div>
              <a
                className="flex text-gray-400 items-center border px-4 py-2 hover:text-gray-600 hover:shadow"
                href="https://github.com/boriscougar/atmosphere/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Free Software
              </a>
              <a
                className="flex text-gray-400 items-center border px-4 py-2 hover:text-gray-600 hover:shadow"
                href="https://github.com/boriscougar/atmosphere/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Open Source
              </a>
              <a
                className="flex text-gray-400 items-center border px-4 py-2 hover:text-gray-600 hover:shadow"
                href="https://github.com/boriscougar/atmosphere/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Administration
              </a>
              <a
                className="flex text-gray-400 items-center border px-4 py-2 hover:text-gray-600 hover:shadow"
                href="https://github.com/boriscougar/atmosphere/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                IT
              </a>
              <a
                className="flex text-gray-400 items-center border px-4 py-2 hover:text-gray-600 hover:shadow"
                href="https://github.com/boriscougar/atmosphere/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
                Legal
              </a>
              <a
                className="flex text-gray-400 items-center border px-4 py-2 hover:text-gray-600 hover:shadow"
                href="https://github.com/boriscougar/atmosphere/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
                Marketing
              </a>
            </div>*/}
            <div className="flex flex-col space-y-4 pb-4 w-full border">
              {allProvidersData.map(({ id, name, url, logo, contentHtml }) => (
                <div className="flex flex-col md:flex-row border m-4 mb-0 rounded" key={id}>
                  <div className="w-full md:w-64 bg-gradient-to-t to-gray-300 from-gray-200 border-r rounded-l">
                    <div className="justify-center items-center flex md:w-64">
                      <img className="p-2 w-auto h-14" src={logo} />
                    </div>
                    <div className="flex flex-row p-2 justify-center">
                      <Link href={path.join("/wizard", id)}>
                        <a className="flex w-full justify-center rounded text-gray-100 bg-purple-400 items-center px-4 py-2 mx-1 hover:text-white hover:bg-purple-500 hover:shadow">
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
                              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                            />
                          </svg>
                          Launch
                        </a>
                      </Link>
                    </div>
                  </div>
                  <div className="text-justify mx-1 pl-2 pt-2">
                    <a
                      className="flex text-black-400 text-lg font-medium pb-2"
                      target="_blank"
                      href={url}
                    >
                      {name}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mx-1"
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
                    <div className="md:max-h-16 overflow-auto">
                      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="flex flex-col items-center justify-center w-full h-24 border-t">
          <a
            className="flex items-center justify-center"
            href="https://innovare.es"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <img src="/innovare.svg" alt="Innovare Logo" className="h-4 ml-2" />
          </a>
          <p className="text-xs text-gray-700">
            Version [{process.env.NEXT_PUBLIC_VERSION}]
          </p>
        </footer>
      </div>
    </>
  );
}

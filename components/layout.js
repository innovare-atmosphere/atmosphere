import Head from "next/head";
import Link from "next/link";
import path from "path";

export default function Layout({ children, className }) {
  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row pt-2 w-full">
        <div className="flex flex-col md:flex-row sm:w-2/4 sm:p-2 w-full">
        <Link href={path.join("/")}>
            <a
              className="flex text-purple-600 items-center px-4 py-2 hover:text-purple-600 hover:shadow-md text-sm sm:text-base sm:border-none shadow border"
            >
              Atmosphere
            </a>
          </Link>
        </div>
        <div className="flex md:flex-row-reverse flex-col md:space-x-2 space-x-reverse sm:p-2 sm:w-2/4 w-full">
          <a
            className="flex flex-row text-gray-400 items-center px-4 py-2 hover:text-gray-600 hover:shadow md:border-none border "
            href="https://github.com/innovare-atmosphere"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="w-4 mr-1"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
            >
              <path
                fill="rgb(149, 157, 165)"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              ></path>
            </svg>
          </a>
          <Link href={path.join("/my-account")}>
            <a
              className="flex text-gray-400 items-center border px-4 py-2 hover:text-gray-600 hover:shadow text-sm sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              My account
            </a>
          </Link>
        </div>
      </div>
      <div className="flex flex-col min-h-screen py-2">
        <Head>
          <title>Atmosphere - ready, set, launch</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>{children}</main>

        <footer className="flex flex-col items-center justify-center w-full min-h-24 border-t">
          <a
            className="flex items-center justify-center dark:bg-purple-500 dark:rounded-md dark:p-3 mt-4"
            href="https://innovare.es"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <img src="/innovare.svg" alt="Innovare Logo" className="h-4 ml-2" />
          </a>
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-4">
            Version [{process.env.NEXT_PUBLIC_VERSION}]
          </p>
          <div className="flex flex-row items-left flex-1 w-full bg-purple-100 rounded-lg p-5">
            <Link href={path.join("/get-help")}><a className="text-gray-600 mr-1 ml-1 dark:text-gray-300 hover:text-gray-900">Help</a></Link>
            <p>|</p>
            <Link href={path.join("/terms-and-conditions")}><a className="text-gray-600 mr-1 ml-1 dark:text-gray-300 hover:text-gray-900">Terms & conditions</a></Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

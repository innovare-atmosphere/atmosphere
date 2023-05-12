import useSWR from "swr";
import Link from "next/link";
import Ansi from "ansi-to-react";
import { Disclosure } from "@headlessui/react";
import { useState, useEffect } from "react";
import path from "path";

const urlExpression =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
const regex = new RegExp(urlExpression);

const fetcher = async (url, token) => {
  const options = {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  };
  const x = await fetch(url, options).then((res) => res.json());
  if (x.error_status) {
    console.error(x.error);
    throw x.error;
  }
  return x;
};

const useLogData = (
  uuid,
  token,
  setStatusName,
  setPercentage,
  setColorState
) => {
  if (uuid === undefined) {
    return {
      log: undefined,
      isLoading: true,
      isError: undefined,
    };
  }
  const { data, error } = useSWR(
    [`${process.env.NEXT_PUBLIC_RUNNER_URL}/state/${uuid}`, token],
    fetcher,
    { refreshInterval: 5000 }
  );
  useEffect(() => {
    if (data) {
      if (data.output) {
        if ((data.output.status == 'DEPLOY_ERROR') || (data.output.status == 'DESTROY_ERROR') || error) {
          setStatusName("Error");
          setColorState("red");
        } 
        else if (data.output.status == 'LOADING')  {
          if (data.output.output_init && !data.output.output_apply){
            const advancement = data.output.output_init.length / 500;
            const number = Math.round(10 + (advancement < 20 ? advancement : 19));
            setPercentage(`${number}%`);
            setStatusName("Applying");
          } else if (data.output.output_apply){
            const advancement = data.output.output_apply.length / 2000;
            const number = Math.round(40 + (advancement < 60 ? advancement : 59));
            setPercentage(`${number}%`);
            setStatusName("Applying");
          } else if (data.output.output_destroy) {
            setPercentage("10%");
            setStatusName("Destroying");
          } else {
            setPercentage("10%");
            setStatusName("Initializing");
          }
        }
        else if (data.output.status == 'COMPLETED'){
          setPercentage("100%");
          setStatusName("Finished");
          setColorState("green");
        }
        else if (data.output.status == 'DESTROYED'){
          setPercentage("100%");
          setStatusName("Destroyed");
          setColorState("purple");
        }
      }
    }
  }, [data]);
  return {
    log: data,
    isLoading: !error && !(data ? data.output : data),
    isError: error,
  };
};

export default function LogViewer({ uuid, token }) {
  const [statusName, setStatusName] = useState("Warming up");
  const [percentage, setPercentage] = useState("0%");
  const [colorState, setColorState] = useState("purple");
  const { log, isLoading, isError } = useLogData(
    uuid,
    token,
    setStatusName,
    setPercentage,
    setColorState
  );

  if (!uuid) return <></>;

  return (
    <>
      {log && log.output && log.output.status == "LOADING" && (
        <div className="pb-4 shadow rounded bg-purple-50 dark:bg-purple-900">
          <div className="flex mx-4 lg:mx-64 sm:flex-row flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-3xl text-gray-600 dark:text-gray-300">This will take ~5 minutes</p>
          </div>
          <div className="flex mx-4 lg:mx-64 flex-col bg-white shadow p-4 dark:bg-gray-900">
            <div className="flex flex-col pt-2 items-baseline">
            <p className="text-gray-800 dark:text-gray-200">
                Installation is in progress, you can safely close this page.
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                To check your installations later, on the top bar, click
              </p>
              <Link href={path.join("/my-account")}>
                <a className="flex flex-row text-gray-400 items-center border px-4 py-2 hover:text-gray-600 hover:shadow mt-2">
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
        </div>
      )}
      {log && log.output && (log.output.status == "DEPLOY_ERROR"||log.output.status == "DESTROY_ERROR") && (
        <div className="pb-4 shadow rounded bg-red-50">
          <div className="flex mx-4 lg:mx-64 sm:flex-row flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-3xl text-gray-600">Oops! Something went wrong</p>
          </div>
          <div className="flex mx-4 lg:mx-64 flex-col bg-white shadow p-4">
            <p className="text-gray-800">
              You can check the log by clicking the arrow below.
            </p>
          </div>
        </div>
      )}
      {log && log.output && log.output.status == "COMPLETED" && (
        <div className="pb-4 shadow rounded bg-green-50 dark:bg-green-900">
          <div className="flex mx-4 lg:mx-64 sm:flex-row flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <p className="text-3xl text-gray-600 dark:text-gray-300">
              Installation was successfull!
            </p>
          </div>
          <div className="flex mx-4 lg:mx-64 flex-col bg-white shadow p-4 dark:bg-gray-700">
            <p className="text-gray-800 dark:text-gray-300">
              You can start using the software with the following information
            </p>
            {Object.keys(log.output.output_done).map((key) => {
              const { value } = log.output.output_done[key];
              return (
                <div
                  className="flex flex-col sm:flex-row pt-2 items-baseline"
                  key={key}
                >
                  <p className="flex flex-row text-gray-700 dark:text-gray-400">{key}</p>
                  {!value.match(regex) && (
                    <div className="flex flex-row sm:mx-2 p-2 shadow-inner rounded-xl bg-yellow-100 items-start text-gray-500">
                      {value}

                      <button
                        className="pl-2 transition duration-500 ease-in-out transform hover:scale-100 text-xs scale-75 focus:scale-75"
                        onClick={() =>
                          navigator.clipboard.writeText(`${value}`)
                        }
                      >
                        Copy
                      </button>
                    </div>
                  )}
                  {value.match(regex) && (
                    <a
                      className="flex flex-row p-2 sm:mx-2  hover:shadow rounded-xl bg-purple-500 items-start text-gray-100 hover:text-white"
                      href={value}
                      target="_blank"
                    >
                      {value}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="pl-1 text-gray-100 hover:text-white h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Disclosure>
        <Disclosure.Button className="pt-2">
          <>
            <div className="relative pt-3 border p-2 rounded-t shadow">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span
                    className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-${colorState}-600 bg-${colorState}-200`}
                  >
                    {statusName}
                  </span>
                </div>
                <div className="text-sm">UUID: {uuid}</div>
                <div className="text-right">
                  <span
                    className={`text-xs font-semibold inline-block text-${colorState}-600`}
                  >
                    {percentage}
                  </span>
                </div>
              </div>
              <div
                className={`animate-pulse overflow-hidden h-2 mb-4 text-xs flex rounded bg-${colorState}-200`}
              >
                <div
                  style={{ width: percentage }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${colorState}-500`}
                ></div>
              </div>
              <div className="flex justify-center hover:shadow-xl text-gray-900 rounded-xl py-2 border-t">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-auto w-8 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </>
        </Disclosure.Button>
        <Disclosure.Panel className="text-gray-100 shadow bg-gray-700 p-3 pb-6 rounded-b overflow-scroll max-h-96">
          {isError && <p>Error happened!</p>}
          {isLoading && <p>Please wait...</p>}
          {log && log.output && (
            <>
              <pre className="text-green-600 bg-green-200 hidden">
                Color output green
              </pre>
              <pre className="text-green-600 bg-green-500 hidden">
                Color output green A
              </pre>
              <pre className="text-red-600 bg-red-200 hidden">
                Color output red
              </pre>
              <pre className="text-red-600 bg-red-500 hidden">
                Color output red A
              </pre>
              <pre className="text-purple-600 bg-purple-200 hidden">
                Color output purple
              </pre>
              <pre className="text-purple-600 bg-purple-500 hidden">
                Color output purple A
              </pre>
              <pre>Init Output</pre>
              <pre>
                <Ansi>{log.output.output_init || "-- No output --"}</Ansi>
              </pre>
              <pre>Apply Output</pre>
              <pre>
                <Ansi>{log.output.output_apply || "-- No output --"}</Ansi>
              </pre>
              {log.output.output_destroy && (
                <pre>
                  <Ansi>{log.output.output_destroy || "-- No output --"}</Ansi>
                </pre>
              )}
              {log.output.error_deploy && (
                <pre className="text-red-300">
                  Deploy error: <Ansi>{log.output.error_deploy}</Ansi>
                </pre>
              )}
              {log.output.error_destroy && (
                <pre className="text-red-300">
                  Destroy error: <Ansi>{log.output.error_destroy}</Ansi>
                </pre>
              )}
            </>
          )}
        </Disclosure.Panel>
      </Disclosure>
    </>
  );
}

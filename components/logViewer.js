import useSWR from "swr";
import Ansi from "ansi-to-react";
import { Disclosure } from "@headlessui/react";
import { useState, useEffect } from "react";

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
        if (data.status) {
          if (data.status.error_status || error) {
            setStatusName("Error");
            setColorState("red");
          } else if (data.status.output_init && !data.status.completed) {
            setPercentage("20%");
            setStatusName("Applying");
          } else if (data.status.output_apply && !data.status.completed) {
            setPercentage("40%");
            setStatusName("Applying");
          } else if (data.status.completed) {
            setPercentage("100%");
            setStatusName("Finished");
            setColorState("green");
          } else {
            setPercentage("10%");
            setStatusName("Initializing");
          }
        }
      }
  }, [data]);
  return {
    log: data,
    isLoading: !error && !(data?data.status:data),
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
      <Disclosure>
        <Disclosure.Button className="pt-2">
          <>
            <div className="relative pt-3 border p-2 rounded-t shadow">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-${colorState}-600 bg-${colorState}-200`}>
                    {statusName}
                  </span>
                </div>
                <div className="text-sm">UUID: {uuid}</div>
                <div className="text-right">
                  <span className={`text-xs font-semibold inline-block text-${colorState}-600`}>
                    {percentage}
                  </span>
                </div>
              </div>
              <div className={`overflow-hidden h-2 mb-4 text-xs flex rounded bg-${colorState}-200`}>
                <div
                  style={{ width: percentage }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${colorState}-500`}
                ></div>
              </div>
            </div>
          </>
        </Disclosure.Button>
        <Disclosure.Panel className="text-gray-100 shadow bg-gray-700 p-3 pb-6 rounded-b overflow-scroll">
          {isError && <p>Error happened!</p>}
          {isLoading && <p>Please wait...</p>}
          {log && log.status && (
            <>
              <pre className="text-green-600 bg-green-200 hidden">Color output green</pre>
              <pre className="text-green-600 bg-green-500 hidden">Color output green A</pre>
              <pre className="text-red-600 bg-red-200 hidden">Color output red</pre>
              <pre className="text-red-600 bg-red-500 hidden">Color output red A</pre>
              <pre className="text-purple-600 bg-purple-200 hidden">Color output purple</pre>
              <pre className="text-purple-600 bg-purple-500 hidden">Color output purple A</pre>
              <pre>Init Output</pre>
              <pre>
                <Ansi>{log.status.output_init || "-- No output --"}</Ansi>
              </pre>
              <pre>Apply Output</pre>
              <pre><Ansi>{log.status.output_apply || "-- No output --"}</Ansi></pre>
              {log.status.error && (
                  <pre className="text-red-300">Error: <Ansi>{log.status.error}</Ansi></pre>
              )}
            </>
          )}
        </Disclosure.Panel>
      </Disclosure>
    </>
  );
}

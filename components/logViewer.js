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
  setErrorState
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
          if (data.status.error_status) {
            setStatusName("Error");
            setErrorState(true);
          } else if (data.status.output_init) {
            setPercentage("20%");
            setStatusName("Applying");
          } else if (data.status.output_apply) {
            setPercentage("40%");
            setStatusName("Applying");
          } else if (data.status.completed) {
            setPercentage("100%");
            setStatusName("Finished");
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
  const [errorState, setErrorState] = useState(false);
  const { log, isLoading, isError } = useLogData(
    uuid,
    token,
    setStatusName,
    setPercentage,
    setErrorState
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
                  <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${errorState?"text-red-600 bg-red-200":"text-purple-600 bg-purple-200"}`}>
                    {statusName}
                  </span>
                </div>
                <div className="text-sm">UUID: {uuid}</div>
                <div className="text-right">
                  <span className={`text-xs font-semibold inline-block ${errorState?"text-red-600":"text-purple-600"}`}>
                    {percentage}
                  </span>
                </div>
              </div>
              <div className={`overflow-hidden h-2 mb-4 text-xs flex rounded ${errorState?"bg-red-200":"bg-purple-200"}`}>
                <div
                  style={{ width: percentage }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${errorState?"bg-red-500":"bg-purple-500"}`}
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
              <pre>Init Output</pre>
              <pre>
                <Ansi>{log.status.output_init || "-- No output --"}</Ansi>
              </pre>
              <pre>Apply Output</pre>
              <pre>{log.status.otuput_apply || "-- No output --"}</pre>
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

import { useRouter } from "next/router";
import Link from 'next/link'
import path from 'path'
import { useState } from "react";
import useSWR from "swr";
import useSWRImmutable from 'swr/immutable';
import Ansi from "ansi-to-react";



const fetcher = (...args) => fetch(...args).then((res) => res.json());

export async function submit(event, provider, flavor, setLogData) {
  event.preventDefault();
  let body = {};
  const items = [...new Set(event.target.elements)];
  items.map(({ name, value }) => {
    body[name] = value;
  });
  const res = await fetch(
    `http://127.0.0.1:8000/invoke/${provider}/${flavor}`,
    {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  );

  const result = await res.json();
  setLogData(result);
}

function useProviderFlavor(provider, flavor) {
  const { data, error } = useSWRImmutable(
    `http://127.0.0.1:8000/variables/${provider}/${flavor}`,
    fetcher
  );
  return {
    formData: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const useLogData = (uuid) => {
    if (uuid === undefined) {
      return {
        formData: undefined,
        isLoading: true,
        isError: undefined,
      };
    }
    const { data, error } = useSWR(
      `http://127.0.0.1:8000/state/${uuid}`,
      fetcher,
      {refreshInterval: 1000}
    );
    return {
      log: data,
      isLoading: !error && !data,
      isError: error,
    };
  }

export function OutputData({ uuid }) {
  if (!uuid) return <></>;
  const { log, isLoading, isError } = useLogData(uuid);
  return (
    <>
      <pre>UUID: {uuid}</pre>
      {log && log.status && (
        <>
          <h1>Init Output</h1>
          <pre><Ansi>{log.status.output_init}</Ansi></pre>
          <h1>Apply Output</h1>
          <pre>{log.status.otuput_apply}</pre>
          <h1>State</h1>
          <pre>Error status: {log.status.error_status}</pre>
          <pre>Error: {log.status.error}</pre>
        </>
      )}
    </>
  );
}

export default function WizardFlavor() {
  const router = useRouter();
  const { provider, flavor } = router.query;
  if (provider === undefined || flavor === undefined) {
    return (<></>);
  }
  const { formData, isLoading, isError } = useProviderFlavor(provider, flavor);
  const [logData, setLogData] = useState(undefined);
  return (
    <>
        <Link href={path.join('/wizard',provider)}>
            <a className="flex w-32 justify-center rounded text-gray-400 bg-gray-100 items-center px-4 py-2 mx-1 hover:text-white hover:bg-gray-500 hover:shadow">
            {'<'} Back
            </a>
        </Link>
      {isError && (<p>Error happened!</p>)}
      {isLoading && (<p>Please wait...</p>)}
      {formData && (formData.output) && (
        <>
          <p>{formData.output.loading ? "Loading" : ""}</p>
          <form
            className="flex flex-col"
            onSubmit={(event) => submit(event, provider, flavor, setLogData)}
          >
            {Object.values(formData.output.variables)
              .filter((x) => x.required)
              .map(({ name, description, required }) => (
                <div className="flex-row p-2" key={name}>
                  <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {name}
                    <span className="pl-1 text-xs text-gray-400">
                      {required ? "required field" : ""}
                    </span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name={name}
                      id={name}
                      required={required}
                      className="pt-2 pb-2 focus:ring-purple-500 focus:border-purple-500 block w-full pl-1 sm:text-sm ring-gray-300 rounded-md"
                      placeholder={
                        description ? description : "Set a value here"
                      }
                    />
                  </div>
                </div>
              ))}
            {Object.values(formData.output.variables)
              .filter((x) => !x.required)
              .map(({ name, description, required }) => (
                <div className="flex-row p-2" key={name}>
                  <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {name}
                    <span className="pl-1 text-xs text-gray-400">
                      {required ? "required field" : ""}
                    </span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name={name}
                      id={name}
                      required={required}
                      className="pt-2 pb-2 focus:ring-purple-500 focus:border-purple-500 block w-full pl-1 sm:text-sm ring-gray-300 rounded-md"
                      placeholder={
                        description ? description : "Set a value here"
                      }
                    />
                  </div>
                </div>
              ))}
            <button type="submit"
                className="flex w-full justify-center rounded-b text-gray-100 bg-purple-400 items-center px-4 py-2 hover:text-white hover:bg-purple-500 hover:shadow">
                Execute
            </button>
          </form>
        </>
      )}
      {logData && <OutputData uuid={logData.uuid}></OutputData>}
    </>
  );
}

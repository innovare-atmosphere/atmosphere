import { useState } from "react";
import useSWRImmutable from "swr/immutable";
import { useLocalStorage } from "../lib/useLocalStorage";

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

async function submit(event, provider, flavor, token, executeCallback, setExecutionError) {
  event.preventDefault();
  let body = {};
  const items = [...new Set(event.target.elements)];
  items.map(({ name, value }) => {
    body[name] = value;
  });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_RUNNER_URL}/invoke/${provider}/${flavor}`,
    {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      method: "POST",
    }
  );

  const result = await res.json();
  if (result.error_status){
      console.error(result.error);
      setExecutionError(result.error);
  }else{
    executeCallback(result);
  }
}

function useProviderFlavor(provider, flavor, token) {
  const { data, error } = useSWRImmutable(
    [
      `${process.env.NEXT_PUBLIC_RUNNER_URL}/variables/${provider}/${flavor}`,
      token,
    ],
    fetcher
  );
  return {
    formData: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function FormBuilder({ provider, flavor, executeCallback }) {
  const [token, setToken] = useLocalStorage("atmosphere-token", "");
  const [executionError, setExecutionError] = useState(undefined);
  const { formData, isLoading, isError } = useProviderFlavor(
    provider,
    flavor,
    token
  );
  if (provider === undefined || flavor === undefined) {
    return <></>;
  }
  return (
    <>
      {isError && <p>Error happened!</p>}
      {isLoading && <p>Please wait...</p>}
      {formData && formData.output && (
        <>
          <p>{formData.output.loading ? "Loading" : ""}</p>
          <form
            className="flex flex-col"
            onSubmit={(event) =>
              submit(event, provider, flavor, token, executeCallback,setExecutionError)
            }
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
              {executionError && (
                  <>
                  <p>
                      Error, couldn't execute.
                  </p>
                  <p>{executionError}</p>
                  </>
              )}
            <button
              type="submit"
              className="flex w-full justify-center rounded-b text-gray-100 bg-purple-400 items-center px-4 py-2 hover:text-white hover:bg-purple-500 hover:shadow"
            >
              Execute
            </button>
          </form>
        </>
      )}
    </>
  );
}

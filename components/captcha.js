import useSWRImmutable from "swr/immutable";
import { useSWRConfig } from "swr";
import { useState } from "react";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Captcha({ captchaValidator }) {
  const { mutate } = useSWRConfig();
  const [finishedState, setFinishedState] = useState(undefined);
  const [wrongInput, setWrongInput] = useState(false);
  const useToken = () => {
    const { data, error } = useSWRImmutable(
      `${process.env.NEXT_PUBLIC_RUNNER_URL}/token`,
      fetcher
    );
    return {
      data: data,
      isLoading: !error && !data,
      isError: error,
    };
  };
  const handleClick = async (event, token) => {
    event.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_RUNNER_URL}/validate`, {
      body: JSON.stringify({
        validation: {
          token: token,
          proof: event.target.elements.captcha_validate.value,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const result = await res.json();
    setFinishedState(result.valid);
    captchaValidator(result);
    if (!result.valid) {
      mutate(`${process.env.NEXT_PUBLIC_RUNNER_URL}/token`);
    }
    setWrongInput(!result.valid);
    event.target.elements.captcha_validate.value = "";
    event.target.elements.captcha_validate.focus();
  };
  const { data, isLoading, isError } = useToken();
  return (
    <>
      {isError && <p>Error loading captcha!</p>}
      {isLoading && <p>Please wait...</p>}
      {data && !finishedState && (
        <form
          autoComplete="off"
          className="flex flex-col space-y-2 items-center mt-2"
          onSubmit={(event) => handleClick(event, data.token)}
        >
          <div className="flex flex-row w-full">
            <img
              className="w-4/5"
              src={`data:image/png;base64,${data.captcha}`}
            ></img>
            <button
              className="border w-1/5 justify-center items-center text-gray-400 rounded-tr rounded-br flex p-4 hover:shadow"
              onClick={() => {
                mutate(`${process.env.NEXT_PUBLIC_RUNNER_URL}/token`);
              }}
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
          <input
            placeholder="Please enter the text above"
            className="border w-full p-3"
            type="text"
            id="captcha_validate"
            name="captcha_validate"
            autoFocus
          ></input>
          {wrongInput && (
            <p className="text-gray-400 text-sm text-justify">
              Input invalid. Please try again
            </p>
          )}
          <button
            className="border w-full bg-purple-400 text-white p-3 rounded hover:bg-purple-600 hover:shadow"
            type="submit"
          >
            Validate
          </button>
        </form>
      )}
      {finishedState && <p>Success!</p>}
    </>
  );
}

import useSWRImmutable from "swr/immutable";
import { useSWRConfig } from "swr";
import { useState } from "react";
import Link from "next/link";
import path from "path";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Login({ captchaValidator }) {
  const { mutate } = useSWRConfig();
  const [finishedState, setFinishedState] = useState(undefined);
  const [wrongCaptcha, setWrongCaptcha] = useState(false);
  const [wrongEmail, setWrongEmail] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [isloadingCode, setLoadingCode] = useState(false);
  const [isWrongCode, setWrongCode] = useState(false);
  const [twoStepToken, setTwoStepToken] = useState(undefined);
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
    setLoadingCode(true);
    setSelectedEmail(event.target.elements.login_email.value);
    const res = await fetch(`${process.env.NEXT_PUBLIC_RUNNER_URL}/validate`, {
      body: JSON.stringify({
        email: event.target.elements.login_email.value,
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
    //captchaValidator(result);
    if (!result.valid) {
      mutate(`${process.env.NEXT_PUBLIC_RUNNER_URL}/token`);
    }
    setTwoStepToken(result.token);
    setWrongCaptcha(!result.valid);
    setWrongEmail(!result.valid_email);
    event.target.elements.captcha_validate.value = "";
    event.target.elements.login_email.focus();
    setLoadingCode(false);
  };
  const handleClick2 = async (event, token) => {
    event.preventDefault();
    setLoadingCode(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_RUNNER_URL}/validate2`,
      {
        body: JSON.stringify({code: event.target.elements.code_validate.value}),
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        method: "POST",
      }
    );
    const result = await res.json();
    captchaValidator(result);
    setWrongCode(!result.valid);
    event.target.elements.code_validate.value = "";
    event.target.elements.code_validate.focus();
    setLoadingCode(false);
  };
  const { data, isLoading, isError } = useToken();
  return (
    <>
      {isError && <p>Error loading captcha!</p>}
      {isLoading && <p>Please wait...</p>}
      {data && !finishedState && !isloadingCode && (
        <form
          autoComplete="off"
          className="flex flex-col space-y-2 items-center mt-5 bg-white"
          onSubmit={(event) => handleClick(event, data.token)}
        >
          <div className="flex flex-row w-full bg-red-0 p-3 rounded-xl">
            <div className="flex flex-col w-full bg-gray">
              <label>
                E-mail{" "}
                <small className="text-xs text-gray-500">
                  We use your e-mail to make sure you can access your account
                </small>
              </label>
              <input
                placeholder="email@domain.com"
                className="border w-full p-3 mt-1"
                type="email"
                id="login_email"
                name="login_email"
                autoFocus
              ></input>
            </div>
          </div>
          <div className={`flex flex-col w-full ${
              wrongCaptcha? "bg-red-50" : ""
            } p-3`}>
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-full">
                <label>
                  Verification code{" "}
                  <small className="text-xs text-gray-500">
                    Please type the text to verify you're a human
                  </small>
                </label>
              </div>
            </div>

            <div className="flex flex-row w-full">
              <img
                className="w-4/5"
                src={`data:image/png;base64,${data.captcha}`}
              ></img>
              <button
                className="border w-1/5 justify-center items-center text-gray-400 rounded-tr rounded-br flex p-4 hover:shadow"
                tabIndex={-1}
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
            ></input>
          </div>
          {wrongEmail && (
            <p className="text-red-400 text-sm text-justify">
              Invalid e-mail. Please try again
            </p>
          )}
          {wrongCaptcha && (
            <p className="text-red-400 text-sm text-justify">
              Verification code is invalid. Please try again
            </p>
          )}
          <p className="text-xs mt-2 text-gray-500 p-2">By using this software, you acknowledge and agree to the <Link href={path.join("/terms-and-conditions")}><a className="text-purple-600">terms and conditions</a></Link> outlined on this website. Please read these terms carefully before proceeding.</p>
          <button
            className="border w-full bg-purple-400 text-white p-3 rounded hover:bg-purple-600 hover:shadow"
            type="submit"
          >
            Validate
          </button>
        </form>
      )}
      {isloadingCode && 
      <>
      Loading...
      </>
      }
      {finishedState && 
      <>
        <form
          autoComplete="off"
          className="flex flex-col space-y-2 items-center mt-2"
          onSubmit={(event) => handleClick2(event, twoStepToken)}
        >
          <div className="flex flex-row w-full bg-red-0 p-3 rounded-xl">
            <div className="flex flex-col w-full bg-gray">
              <label>
                Verification code{" "}
                <small className="text-xs text-gray-500">
                  Type the code you received in your e-mail ({selectedEmail}) or {" "}
                </small>
                <small className="text-xs text-gray-600">
                  <a className="hover:underline" onClick={()=>{
                    setFinishedState(undefined);
                    setLoadingCode(false);
                    setSelectedEmail("");
                    setTwoStepToken(undefined);
                  }}>change e-mail.</a>
                </small>
              </label>
              <input
                placeholder="_ _ _ _ _ _"
                className="border w-full p-3 mt-1"
                type="number"
                id="code_validate"
                name="code_validate"
              ></input>
              {isWrongCode && (
            <p className="text-red-400 text-sm text-justify">
              Verification code is invalid. Please try again.
            </p>
          )}
              <button
            className="border w-full bg-purple-400 text-white p-3 rounded hover:bg-purple-600 hover:shadow"
            type="submit"
          >
            Validate
          </button>
            </div>
          </div>
        </form>
      </>
      }
    </>
  );
}

import Layout from "../components/layout";
import useLocalStorage from "../lib/useLocalStorage";
import SimpleDialog from "../components/simpleDialog";
import Login from "../components/login";
import useSWR from "swr";
import Link from "next/link";
import path from "path";

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

function useMyAccount(token) {
  const { data, error } = useSWR(
    [`${process.env.NEXT_PUBLIC_RUNNER_URL}/my-tasks`, token],
    fetcher
  );
  return {
    accountData: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function MyAccount() {
  const [token, setToken] = useLocalStorage(`atmosphere-token`, "");
  const { accountData, isLoading, isError } = useMyAccount(token);
  return (
    <>
      {!token && (
        <SimpleDialog
          title="Welcome human!"
          description="Is this your first time here?"
        >
          <p className="text-sm text-gray-800">We need some details to prepare Atmosphere for you.</p>
          <Login
            captchaValidator={(x) => {
              if (x.valid) {
                setToken(x.token);
              }
            }}
          ></Login>
        </SimpleDialog>
      )}
      <Layout className="flex flex-col items-left justify-center w-full flex-1 px-2 md:px-20 text-center">
        <p className="mt-3 text-2xl">My profile</p>
        <Link href="/">
          <a 
            className="p-2 w-full bg-gray-50 flex text-gray-700 justify-center hover:shadow-lg border"
            onClick={()=>{setToken("")}}
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
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Logout
          </a>
        </Link>
        <p className="mt-3 text-2xl">Deployments</p>
        {isLoading && <p>Loading... </p>}
        {accountData && accountData.all_tasks.length == 0 &&
          <>
          Your account doesn't have deployments yet.
          </>
        }
        {accountData &&
          accountData.all_tasks &&
          accountData.all_tasks.map(
            ({ created_at, domain, provider, flavor, uuid, output }) => {
              const loading_button = (
                <div className="flex w-full flex-row bg-purple-50 px-2 py-2 text-gray-600 items-center">
                  <div className="ml-1 bg-purple-400 rounded-full w-6 h-6 text-gray-50 overflow-hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 animate-spin"
                      fill="none"
                      viewBox="0 12 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                      />
                    </svg>
                  </div>{" "}
                  <span className="ml-1 text-sm text-gray-500">{uuid}</span>
                </div>
              );
              const error_button = (
                <div className="flex w-full flex-row bg-gray-50 px-2 py-2 text-gray-600 items-center">
                  <div className="ml-1 bg-red-400 rounded-full w-6 h-6 text-gray-50 overflow-hidden">
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>{" "}
                  <span className="ml-1 text-sm text-gray-500">{uuid}</span>
                </div>
              );
              const success_button = (
                <div className="flex w-full flex-row bg-gray-50 px-2 py-2 text-gray-600 items-center">
                  <div className="ml-1 bg-green-400 w-6 h-6 rounded-full text-gray-50">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>{" "}
                  <span className="ml-1 text-sm text-gray-500">{uuid}</span>
                </div>
              );
              return (
                <div
                  key={uuid}
                  className="flex flex-col shadow mt-5 text-gray-600"
                >
                  <div className="flex flex-row text-left text-sm items-baseline">
                    {output.completed
                      ? output.error_status
                        ? error_button
                        : success_button
                      : loading_button}
                  </div>
                  <div className="pl-4 pt-2 pb-2">
                    <p className="text-left text-sm">
                      Created at <span>{created_at}</span>
                    </p>
                    <p className="text-left text-sm">
                      Software{" "}
                      <span>
                        {provider} / {flavor}
                      </span>
                    </p>
                  </div>
                  <Link href={`${path.join("/wizard", provider)}?uuid=${uuid}`}>
                    <a className="p-2 w-full bg-gray-50 flex text-gray-700 justify-center hover:shadow-lg border">
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
                          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Details
                    </a>
                  </Link>
                </div>
              );
            }
          )}
      </Layout>
    </>
  );
}

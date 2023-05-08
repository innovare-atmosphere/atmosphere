import Layout from "../components/layout";
import useLocalStorage from "../lib/useLocalStorage";
import SimpleDialog from "../components/simpleDialog";
import Login from "../components/login";
import useSWR from "swr";
import { useSWRConfig } from "swr";
import Link from "next/link";
import path from "path";
import { useState } from "react";

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

function usePaymentURL(token) {
  const { data, error } = useSWR(
    [`${process.env.NEXT_PUBLIC_RUNNER_URL}/payment/10`, token],
    fetcher
  );
  return {
    paymentURLData: data,
    isLoadingPaymentURL: !error && !data,
    isErrorPaymentURL: error,
  };
}

function useMyAccount(token) {
  const { data, error } = useSWR(
    [`${process.env.NEXT_PUBLIC_RUNNER_URL}/my-account`, token],
    fetcher
  );
  return {
    accountData: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function MyAccount() {
  const { mutate } = useSWRConfig();
  const handleClick = async (token, task_uuid) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_RUNNER_URL}/destroy/${task_uuid}`,
      {
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        method: "POST",
      }
    );
    const result = await res.json();
    mutate([`${process.env.NEXT_PUBLIC_RUNNER_URL}/my-account`, token]);
    console.log(result); //TODO: Handle API errors
  };
  const handleClickPaymentURL = async (token) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_RUNNER_URL}/payment/10`,
      {
        //body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        method: "GET",
      }
    );
    const result = await res.json();
    mutate([`${process.env.NEXT_PUBLIC_RUNNER_URL}/payment/10`, token]);
    console.log(result); //TODO: Handle API errors
  }
  const [token, setToken] = useLocalStorage(`atmosphere-token`, "");
  const [isPaymentDialog, setPaymentDialog] = useState(false);
  const [isDeleteDialog, setDeleteDialog] = useState(false);
  const [selectedTaskUUID, setSelectedTaskUUID] = useState(undefined);
  const { accountData, isLoading, isError } = useMyAccount(token);
  const { paymentURLData, isLoadingPaymentURL, isErrorPaymentURL } = usePaymentURL(token);
  return (
    <>
      {!token && (
        <SimpleDialog
          title="Welcome human!"
          description="Is this your first time here?"
        >
          <p className="text-sm text-gray-800">
            We need some details to prepare Atmosphere for you.
          </p>
          <Login
            captchaValidator={(x) => {
              if (x.valid) {
                setToken(x.token);
              }
            }}
          ></Login>
        </SimpleDialog>
      )}
      {isDeleteDialog && (
        <SimpleDialog
          title="Delete deployment"
          description="Are you sure you want to delete X?"
        >
          <p className="text-sm text-gray-800">
            All data within this deployment will be lost.
          </p>
          <div className="flex flex-row">
            <a
              className="p-2 w-full bg-red-400 flex text-gray-100 justify-center hover:shadow-lg border"
              onClick={() => {
                handleClick(token, selectedTaskUUID);
                setDeleteDialog(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Destroy
            </a>
            <a
              className="p-2 w-full bg-gray-200 flex text-gray-500 justify-center hover:shadow-lg border"
              onClick={() => {
                setDeleteDialog(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </a>
          </div>
        </SimpleDialog>
      )}
      {isPaymentDialog && (
        <SimpleDialog
          title="Add funds"
          description="Continue to add US$10.00 credits into your account"
        >
          <div className="flex flex-col">
            {isLoadingPaymentURL && (
              <p>Loading...</p>
            )}
            {paymentURLData && (
              <>
                <p className="text-sm text-gray-800 mb-2" >By clicking on "<a
                  href={`${paymentURLData.redirect_url}`}> Continue to payment
                </a>" you will be sent to our payment gateway "Pagadito" where you can safely add your payment information, you'll be charged for US$10.00.
                </p>
                <p className="text-sm text-gray-800">Once the payment is completed the credit will be added on your account.</p>
                <a
                  className="p-2 mb-5 mt-5 rounded-full bg-purple-600 flex text-gray-50 text-xs justify-center hover:shadow-lg"
                  href={`${paymentURLData.redirect_url}`}> Continue to payment
                </a>
                <a className="p-2 mb-5 rounded-full bg-gray-400 flex text-gray-50 text-xs justify-center hover:shadow-lg" onClick={() => {
                  setPaymentDialog(false);
                }}>Cancel</a>
              </>
            )}
          </div>
          <div className="flex flex-row">
          </div>
        </SimpleDialog>
      )}
      <Layout className="dark:bg-gray-900 flex flex-col items-left justify-center w-full flex-1 px-2 md:px-20">
        {accountData && (
          <>
            <div class="flex flex-col md:flex-row items-start">
              <div class="flex flex-col w-full md:w-1/5 text-center items-center bg-purple-400 text-gray-50 md:min-h-screen">
                <img
                  className="shadow-2xl rounded-full w-32 md:w-3/5 mt-8"
                  src={`https://www.gravatar.com/avatar/${accountData.user.md5}?s=200`}
                />
                <p className="mt-5 text-xs">email</p>
                <p className="mb-3">{accountData.user.email}</p>
                <Link href="/">
                  <a
                    className="p-2 mb-5 md:w-2/5 rounded-full bg-gray-600 flex text-gray-50 text-xs justify-center hover:shadow-lg"
                    onClick={() => {
                      setToken("");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign out
                  </a>
                </Link>
                <p className="mt-5 text-xs mb-3">organizations</p>
                {accountData.organizations.map(({ id, balance, name, subdomain }) => {
                  return (
                    <>
                      <div className="flex flex-row flex-wrap justify-center">
                        <Link href={`/my-account/#org${id}`} scroll={false}>
                          <div className="flex flex-col items-center m-2">
                            <a className="rounded-full bg-gray-600 p-2 w-10">
                              {name[0]}
                            </a>
                            <a className="text-xs">{name}</a>
                          </div>
                        </Link>
                      </div >
                      <p className="mt-5 text-xs">Credits</p>
                      <p className="mb-3">US$ {balance}</p>
                      <a
                        className="p-2 mb-5 md:w-2/5 rounded-full bg-gray-600 flex text-gray-50 text-xs justify-center hover:shadow-lg"
                        onClick={() => {
                          handleClickPaymentURL(token);
                          setPaymentDialog(true);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>

                        Add funds
                      </a>
                    </>
                  );
                })}
              </div>
              <div class="flex flex-col w-full md:w-4/5 md:max-h-screen md:overflow-auto">
                {accountData.all_tasks.length == 0 && (
                  <>Your account doesn't have deployments yet.</>
                )}
                {accountData.all_tasks &&
                  accountData.all_tasks.map(
                    ({ task, organization }, index, arr) => {
                      const loading_title = (
                        <div className="dark:bg-gray-700 flex w-full flex-row bg-purple-50 px-2 py-2 text-gray-600 items-center">
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
                          <span className="ml-1 text-sm text-gray-500">
                            {task.uuid}
                          </span>
                        </div>
                      );
                      const error_title = (
                        <div className="dark:bg-gray-700 flex w-full flex-row bg-gray-50 px-2 py-2 text-gray-600 items-center">
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
                          <span className="ml-1 text-sm text-gray-500">
                            {task.uuid}
                          </span>
                        </div>
                      );
                      const success_title = (
                        <div className="dark:bg-gray-700 flex w-full flex-row bg-gray-50 px-2 py-2 text-gray-600 items-center">
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
                          <span className="ml-1 text-sm text-gray-500">
                            {task.uuid}
                          </span>
                        </div>
                      );
                      const destroyed_title = (
                        <div className="dark:bg-gray-700 flex w-full flex-row bg-gray-50 px-2 py-2 text-gray-600 items-center">
                          <div className="ml-1 bg-gray-400 rounded-full w-6 h-6 text-gray-50 overflow-hidden">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>{" "}
                          <span className="ml-1 text-sm text-gray-500">
                            {task.uuid}
                          </span>
                        </div>
                      );
                      const title_selector = {
                        COMPLETED: success_title,
                        DESTROYED: destroyed_title,
                        LOADING: loading_title,
                        DEPLOY_ERROR: error_title,
                        DESTROY_ERROR: error_title,
                      };
                      return (
                        <>
                          {(index == 0 ||
                            arr[index - 1].organization.id !=
                            organization.id) && (
                              <div
                                id={`org${organization.id}`}
                                className="bg-purple-400 items-start p-4 text-gray-100 flex md:max-w-max"
                              >
                                <div className="flex flex-col">
                                  <p className="text-xs">name</p>
                                  <p>{organization.name}</p>
                                  <p className="text-xs">domain</p>
                                  <p>{organization.subdomain}.atmos.live</p>
                                </div>
                                <div className="flex flex-col">
                                </div>
                              </div>
                            )}
                          <div
                            key={task.uuid}
                            className="flex flex-col shadow text-gray-600 mt-4 p-2"
                          >
                            <div className="flex flex-row text-left text-sm items-baseline">
                              {title_selector[task.output.status]}
                              {(task.output.status == "COMPLETED" ||
                                task.output.status == "DEPLOY_ERROR") && (
                                  <div className="">
                                    <a
                                      className="p-2 w-full bg-red-400 flex text-gray-100 justify-center hover:shadow-lg border"
                                      onClick={() => {
                                        setSelectedTaskUUID(task.uuid);
                                        setDeleteDialog(true);
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                      Destroy
                                    </a>
                                  </div>
                                )}
                            </div>
                            <div className="pl-4 pt-2 pb-2">
                              <p className="text-left text-sm">
                                Created at <span>{task.created_at}</span>
                              </p>
                              <p className="text-left text-sm">
                                Software{" "}
                                <span>
                                  {task.provider} / {task.flavor}
                                </span>
                              </p>
                            </div>
                            <Link
                              href={`${path.join(
                                "/wizard",
                                task.provider
                              )}?uuid=${task.uuid}`}
                            >
                              <a className="dark:bg-gray-600 dark:text-gray-300 p-2 w-full bg-gray-50 flex text-gray-700 justify-center hover:shadow-lg border">
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
                        </>
                      );
                    }
                  )}
              </div>
            </div>
          </>
        )}
        {isLoading && <p>Loading... </p>}
      </Layout >
    </>
  );
}

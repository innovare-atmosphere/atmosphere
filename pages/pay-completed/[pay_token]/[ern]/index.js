import { useRouter } from 'next/router';
import Layout from "../../../../components/layout";
import useLocalStorage from '../../../../lib/useLocalStorage';
import Link from "next/link";
import path from "path";
import useSWRImmutable from "swr/immutable";
import SimpleDialog from '../../../../components/simpleDialog';
import Login from '../../../../components/login';

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

function useCheckPayment(pay_token, ern, token) {
    const { data, error } = useSWRImmutable(
      [
        `${process.env.NEXT_PUBLIC_RUNNER_URL}/check-payment/${pay_token}/${ern}`,
        token,
      ],
      fetcher
    );
    //console.log(error);
    return {
      data: data,
      isLoading: !error && !data,
      isError: !!error,
    };
  }

export default function PayCompleted(){
    const router = useRouter();
    const [token, setToken] = useLocalStorage(`atmosphere-token`, "");
    const { data, isLoading, isError } = useCheckPayment(router.query.pay_token, router.query.ern, token);
    return (
        <Layout className="dark:bg-gray-900 dark:text-gray-200 flex flex-col items-left justify-center w-full flex-1 px-2 md:px-20 text-center">
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
            {isLoading && (
                <div className="text-center flex items-center text-green-400 justify-center">
                    <p>Loading...</p>
                </div>
            )}
            {isError && (
                <>
                <div className="text-center flex items-center text-red-400 justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-64">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-2xl">Payment not completed.</p>
                <p className="text-xl mt-2">There is a problem with your payment.</p>
                <p className="text-xl">Please inform about this issue at boris@innovare.es.</p>
                <p className="text">ERN: {router.query.ern}.</p>
                <p className="text mb-4">Pay token: {router.query.pay_token}.</p>
                <p className="mt-4 text-sm text-gray-500"> You can continue installing software by clicking on "Continue" or check your balance in "My Account"</p>
                <div className="flex justify-center mb-5 mt-5">
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
                    <Link href={path.join("/")} >
                        <a
                        className="flex items-center border px-4 py-2 text-gray-100 bg-purple-400 hover:text-white hover:bg-purple-500 hover:shadow ml-3"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        </svg>
                        Continue
                        </a>
                    </Link>
                </div>
            </>
            )}
            {data && (
                <>
                    <div className="text-center flex items-center text-green-400 justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-64">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-2xl">Payment completed successfully!</p>
                    <p className="text-xl mt-2">Your order was successfully processed ({data.status}).</p>
                    <p className="text-xl mb-4">Check your email for your receipt.</p>
                    <p>Details: Atmosphere funds for US$ {data.amount}.</p>
                    <p>Transaction ID: {data.ern}</p>
                    <p>Reference Code (Pagadito): {data.reference}</p>
                    <p className="mt-4 text-sm text-gray-500"> You can now continue installing software by clicking on "Continue" or check your balance in "My Account"</p>
                    <div className="flex justify-center mb-5 mt-5">
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
                        <Link href={path.join("/")} >
                            <a
                            className="flex items-center border px-4 py-2 text-gray-100 bg-purple-400 hover:text-white hover:bg-purple-500 hover:shadow ml-3"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            </svg>
                            Continue
                            </a>
                        </Link>
                    </div>
                </>
            )}
        </Layout>
    )
}
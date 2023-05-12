import Layout from '../components/layout';
import Link from "next/link";
import Login from '../components/login';
import useLocalStorage from '../lib/useLocalStorage';
import SimpleDialog from '../components/simpleDialog';
import { useState } from "react";

export default function GetHelp() {
    const [token, setToken] = useLocalStorage(`atmosphere-token`, "");
    const [displayContactInfo, setDisplayContactInfo] = useState(false);
  return (
    <Layout>
        {!token && displayContactInfo && (
                <SimpleDialog
                title="Welcome human!"
                description="Is this your first time here?"
                >
                <p className="text-sm text-gray-800">
                    We need to make sure you're a real person.
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
      <main className="max-w-3xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Get Help</h1>
        <p className="mt-4 text-lg text-gray-500">Need help with Atmosphere? We're here to assist you.</p>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h2>
          <dl className="mt-4 space-y-8">
            <div>
              <dt className="text-base font-medium text-gray-900">How do I create an account?</dt>
              <dd className="mt-2 text-base text-gray-500">
                To create an account, simply add your e-mail and validate the verification code sent to your inbox.
              </dd>
            </div>

            <div>
              <dt className="text-base font-medium text-gray-900">There is no password?</dt>
              <dd className="mt-2 text-base text-gray-500">
                No. The only way to Log in is by using your email account and validation code.
              </dd>
            </div>

            <div>
              <dt className="text-base font-medium text-gray-900">How do I contact support?</dt>
              <dd className="mt-2 text-base text-gray-500">
                To get help, please email us at info@innovare.es
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Still Need Help?</h2>
          <p className="mt-4 text-base text-gray-500">If you still need assistance, please contact us using one of the methods below:</p>
          {!displayContactInfo && (
            <button
            className="p-3 bg-purple-100 hover:bg-purple-200 mt-2"
            onClick={() => {
                setDisplayContactInfo(true);
            }}
            >Show contact information</button>
          )}
          {displayContactInfo && token && (
            <ul className="mt-4 pl-4 list-disc text-base text-gray-500">
            <li>Email: <Link href="mailto:info@innovare.es"><a>info@innovare.es</a></Link></li>
            <li>Whatsapp: <Link href="https://wa.me/+50256331847"><a>Click here</a></Link></li>
          </ul>
          )}
        </div>
      </main>
    </Layout>
  );
}
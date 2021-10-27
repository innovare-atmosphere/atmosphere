import Link from "next/link";
import path from "path";

export default function ({ flavors, callback }) {
  return (
    <>
      <h2 className="text-2xl text-align-left pt-5">Standard</h2>
      <div className="flex flex-row">
        {flavors.map(({ provider, flavor, description, name }) => (
          <div className="shadow w-full mr-2" key={flavor}>
            <div className="bg-gray-200 rounded-t h-16"></div>
            <div className="flex flex-row text-gray-500 text-center text-xs">
              <div className="p-2">
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <p>100k+</p>
              </div>
              <div className="p-2">
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
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <p>4</p>
              </div>
            </div>
            <p className="p-2 text-xl">
              {name} <span className="text-sm">({flavor})</span>
            </p>
            <p className="p-2">{description}</p>
            {/*<Link href={path.join("/wizard", provider, flavor)}>*/}
            <a
              onClick={() => callback(provider, flavor)}
              className="flex w-full justify-center rounded-b text-gray-100 bg-purple-400 items-center px-4 py-2 hover:text-white hover:bg-purple-500 hover:shadow"
            >
              Select
            </a>
            {/*</Link>*/}
          </div>
        ))}
      </div>
    </>
  );
}

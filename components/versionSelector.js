export default function ({ flavors, provider, callback }) {
  return (
    <>
      <h2 className="text-2xl text-align-left pt-5 mb-2">Launch options</h2>
      <div className="flex flex-row">
        {flavors.map(({ flavor }) => (
          <div className="shadow w-full mr-2" key={flavor}>
            <div className="bg-gray-200 rounded-t h-16"></div>
            <p className="p-2 text-xl">
              Launch {provider.name} using {flavor}
            </p>
            <p className="p-2 text-gray-600">
              Use this software on your own Digitalocean installation
            </p>
            <a
              onClick={() => callback(provider.id, flavor)}
              className="flex w-full justify-center rounded-b text-gray-100 bg-purple-400 items-center px-4 py-2 hover:text-white hover:bg-purple-500 hover:shadow"
            >
              Select
            </a>
          </div>
        ))}
      </div>
    </>
  );
}

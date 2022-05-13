import { useState } from "react";

function PaymentSelector({ total, setValid, setPaymentInformation }) {
  const today = new Date();
  const mm = (today.getMonth() + 1)>9? (today.getMonth() + 1): "0"+(today.getMonth() + 1); //January is 0!
  const yyyy = today.getFullYear();
  if (total <= 0) {
    setValid(true);
    setPaymentInformation(undefined);
    return (
      <>
        <div className="border-l border-r pt-6 px-6 max-w-lg"></div>
        <div className="flex flex-col max-w-lg py-4">
          <>
            <p className="text-right">Total ammount</p>
            <p className="text-right font-bold text-lg">
              US$ {parseFloat(0).toFixed(2)}
            </p>
          </>
        </div>
      </>
    );
  }
  const [paymentOption, setPaymentOption] = useState("new_card");
  const [isNewCardValid, setNewCardValid] = useState(false);
  const isPaymentOptionValid = {
    "new_card": isNewCardValid,
    "24hours": true,
  };
  setValid(isPaymentOptionValid[paymentOption]);
  return (
    <>
      <div className="border-l border-r pt-6 px-6 max-w-lg mb-6">
        <div className="">
          <div>
            I want to{" "}
            <select
              onChange={(event) => {
                setPaymentOption(event.target.value);
                setNewCardValid(false);
                setPaymentInformation({"type": event.target.value});
              }}
              className="border p-2 shadow rounded-xl"
            >
              <option value="new_card">pay with a new card</option>
              <option value="24hours">use it for free for 24 hours</option>
            </select>
          </div>
          {paymentOption == "24hours" && (
            <p className="text-gray-600 text-sm">
              * After 24 hours, the system will automatically delete all created
              resources, you can pay the total of US${" "}
              {parseFloat(total).toFixed(2)} to preserve your information before
              the 24 hour period ends.
            </p>
          )}
          {paymentOption == "new_card" && (
            <form
              className="flex flex-col mt-4"
              onChange={(event) => {
                const validateCardNumber = (number) => {
                  //Check if the number contains only numeric value
                  //and is of between 13 to 19 digits
                  const regex = new RegExp("^[0-9]{13,19}$");
                  if (!regex.test(number)) {
                    return false;
                  }

                  return luhnCheck(number);
                };

                const luhnCheck = (val) => {
                  let checksum = 0; // running checksum total
                  let j = 1; // takes value of 1 or 2

                  // Process each digit one by one starting from the last
                  for (let i = val.length - 1; i >= 0; i--) {
                    let calc = 0;
                    // Extract the next digit and multiply by 1 or 2 on alternative digits.
                    calc = Number(val.charAt(i)) * j;

                    // If the result is in two digits add 1 to the checksum total
                    if (calc > 9) {
                      checksum = checksum + 1;
                      calc = calc - 10;
                    }

                    // Add the units element to the checksum total
                    checksum = checksum + calc;

                    // Switch the value of j
                    if (j == 1) {
                      j = 2;
                    } else {
                      j = 1;
                    }
                  }

                  //Check if it is divisible by 10 or not.
                  return checksum % 10 == 0;
                };
                const allFieldsAreFull = (
                  event.target.form["cardholder"].value !== "" &&
                  event.target.form["card_number"].value !== "" &&
                  event.target.form["exp_date"].value !== "" &&
                  event.target.form["cvv"].value !== ""
                );
                const isCardNumberValid = validateCardNumber(
                  event.target.form["card_number"].value
                );
                const isCVVValid = (
                  !isNaN(event.target.form["cvv"].value) &&
                  event.target.form["cvv"].value.length >= 3 &&
                  parseFloat(event.target.form["cvv"].value) >= 0 &&
                  parseFloat(event.target.form["cvv"].value) <= 9999
                );
                const isExpDateValid = (
                  event.target.form["exp_date"].value.split("-")[0] >= yyyy
                );
                setPaymentInformation(
                  {
                    "type": "new_card",
                    "cardholder": event.target.form["cardholder"].value,
                    "card_number": event.target.form["card_number"].value,
                    "exp_date": event.target.form["exp_date"].value,
                    "cvv": event.target.form["cvv"].value,
                  }
                );
                setNewCardValid(
                  allFieldsAreFull && 
                  isCardNumberValid && 
                  isCVVValid &&
                  isExpDateValid
                );
              }}
            >
              <label>Cardholder</label>
              <input
                className="border p-1 rounded"
                type="text"
                placeholder="John Doe"
                name="cardholder"
              ></input>
              <label>Card number</label>
              <input
                className="border p-1 rounded"
                type="text"
                placeholder="1234 5678 9876 5432"
                name="card_number"
              ></input>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col mr-1">
                  <label>Expiration</label>
                  <input
                    className="border p-1 rounded"
                    type="month"
                    placeholder="07/2025"
                    name="exp_date"
                    min={yyyy+"-"+mm}
                  ></input>
                </div>
                <div className="flex flex-col ml-1">
                  <label>CVV</label>
                  <input
                    className="border p-1 rounded"
                    type="text"
                    placeholder="432"
                    name="cvv"
                  ></input>
                </div>
              </div>
              {!isNewCardValid && (
                <p className="text-red-400 pt-1 text-sm">
                  * Card information is invalid or incomplete
                </p>
              )}
            </form>
          )}
        </div>
        <div className="flex flex-col max-w-lg py-4">
          {paymentOption != "24hours" && (
            <>
              <p className="text-right">Total ammount</p>
              <p className="text-right font-bold text-lg">
                US$ {parseFloat(total).toFixed(2)}
              </p>
            </>
          )}
          {paymentOption == "24hours" && (
            <>
              <p className="text-right">Total ammount</p>
              <p className="text-right font-bold text-lg">
                US$ {parseFloat(0).toFixed(2)}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function FlavorSelector({ provider, flavor, callback, token }) {
  const [valid, setValid] = useState(provider.pricing === undefined);
  const [paymentInformation, setPaymentInformation] = useState(undefined);
  const [paymentFailure, setPaymentFailure] = useState("");
  const pricing = provider.pricing.find(item => item.flavor === flavor)
  const processPayment = () => {
    //do API call for payment information, dont callback unless all is good
    // I guess here we should call an API to check the billing info is valid
    console.log(paymentInformation);
    setPaymentFailure("Processing payment");
    // Ejemplo implementando el metodo POST:
    const response = fetch(`${process.env.NEXT_PUBLIC_RUNNER_URL}/pay`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'token': token
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({details:{method: '', information: paymentInformation}}) // body data type must match "Content-Type" header
    });
    response.then(response => response.json())
    .then(data => {
      setPaymentFailure("Payment processed, result: " + data.success);
      if(data.success){
        callback(provider.id, flavor, paymentInformation)
      }
    })
  };
  const selector = {
    digitalocean: (provider, flavor) => (
      <>
        <p className="p-4 text-gray-600">
          To use this option you need to have an existing Digitalocean account.
          If you don't have one, it is easier to use Atmosphere alternative.
        </p>
        {provider.pricing && (
          <>
            <div className="dark:bg-gray-700 lex flex-row m-4 p-6 bg-gray-100 rounded justify-between items-center">
              <div className="flex flex-col">
                <p>Installation</p>
                <p className="dark:text-gray-400 text-gray-500 text-sm">
                  This is the cost of installing {provider.name} using
                  Atmosphere{" "}
                </p>
              </div>
              <div className="flex flex-col">
                {pricing.installation.normal !=
                pricing.installation.discounted ? (
                  <>
                    <p className="dark:text-gray-500 line-through text-gray-600">
                      US${" "}
                      {parseFloat(
                        pricing.installation.normal
                      ).toFixed(2)}
                    </p>
                    <p>
                      US${" "}
                      {parseFloat(
                        pricing.installation.discounted
                      ).toFixed(2)}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      US${" "}
                      {parseFloat(
                        pricing.installation.discounted
                      ).toFixed(2)}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-row justify-end items-start mx-4 px-4 ">
              <PaymentSelector
                className=""
                total={pricing.installation.discounted}
                setValid={setValid}
                setPaymentInformation={setPaymentInformation}
              ></PaymentSelector>
              <div className=""></div>
            </div>
            <div className="flex flex-row justify-end"></div>
            <details className="mb-4 p-4 cursor-pointer">
              <summary className="pl-2 pt-2 text-gray-500 font-bold">
                Additional costs (billed on your Digitalocean account)
              </summary>
              <div className="dark:bg-gray-700 flex flex-row m-4 p-6 bg-gray-100 rounded justify-between">
                <div className="flex flex-col">
                  <p>Monthly infrastructure cost</p>
                  <p className="dark:text-gray-400 text-gray-500 text-sm">
                    This is the cost of the infrastructure that will be created,
                    Digitalocean will be charging this ammount every month.
                  </p>
                </div>
                <p>
                  US${" "}
                  {parseFloat(pricing.monthly).toFixed(2)}{" "}
                </p>
              </div>
            </details>
          </>
        )}
        <p>{paymentFailure}</p>
        <button
          onClick={() => processPayment()}
          type="button"
          className={`flex w-full justify-center rounded-b items-center px-4 py-2 ${
            valid
              ? "text-gray-100 bg-gray-400 hover:text-white hover:bg-gray-500 hover:shadow"
              : "cursor-not-allowed text-gray-300 bg-gray-400"
          }`}
          disabled={!valid}
        >
          Customize {provider.name}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 w-6"
            stroke="currentColor"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M20.322.75a10.75 10.75 0 00-7.373 2.926l-1.304 1.23A23.743 23.743 0 0010.103 6.5H5.066a1.75 1.75 0 00-1.5.85l-2.71 4.514a.75.75 0 00.49 1.12l4.571.963c.039.049.082.096.129.14L8.04 15.96l1.872 1.994c.044.047.091.09.14.129l.963 4.572a.75.75 0 001.12.488l4.514-2.709a1.75 1.75 0 00.85-1.5v-5.038a23.741 23.741 0 001.596-1.542l1.228-1.304a10.75 10.75 0 002.925-7.374V2.499A1.75 1.75 0 0021.498.75h-1.177zM16 15.112c-.333.248-.672.487-1.018.718l-3.393 2.262.678 3.223 3.612-2.167a.25.25 0 00.121-.214v-3.822zm-10.092-2.7L8.17 9.017c.23-.346.47-.685.717-1.017H5.066a.25.25 0 00-.214.121l-2.167 3.612 3.223.679zm8.07-7.644a9.25 9.25 0 016.344-2.518h1.177a.25.25 0 01.25.25v1.176a9.25 9.25 0 01-2.517 6.346l-1.228 1.303a22.248 22.248 0 01-3.854 3.257l-3.288 2.192-1.743-1.858a.764.764 0 00-.034-.034l-1.859-1.744 2.193-3.29a22.248 22.248 0 013.255-3.851l1.304-1.23zM17.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-11 13c.9-.9.9-2.6 0-3.5-.9-.9-2.6-.9-3.5 0-1.209 1.209-1.445 3.901-1.49 4.743a.232.232 0 00.247.247c.842-.045 3.534-.281 4.743-1.49z"
            ></path>
          </svg>
        </button>
      </>
    ),
    atmosphere: (provider, flavor) => (
      <>
        <p className="p-4 text-gray-600">
          This is the easiest installation method. The monthly costs for this
          service are stated below.
        </p>
        {provider.pricing && (
          <>
            <div className="dark:bg-gray-700 flex flex-row m-4 p-6 bg-gray-100 rounded justify-between items-center">
              <div className="flex flex-col">
                <p>Installation</p>
                <p className="text-gray-500 text-sm">
                  This is the cost of installing {provider.name} using
                  Atmosphere{" "}
                </p>
              </div>
              <div className="flex flex-col">
                {pricing.installation.normal !=
                pricing.installation.discounted ? (
                  <>
                    <p className="dark:text-gray-500 line-through text-gray-600">
                      US${" "}
                      {parseFloat(
                        pricing.installation.normal
                      ).toFixed(2)}
                    </p>
                    <p>
                      US${" "}
                      {parseFloat(
                        pricing.installation.discounted
                      ).toFixed(2)}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      US${" "}
                      {parseFloat(
                        pricing.installation.discounted
                      ).toFixed(2)}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="dark:bg-gray-700 flex flex-row m-4 p-6 bg-gray-100 rounded justify-between">
              <div className="flex flex-col">
                <p>Monthly infrastructure cost</p>
                <p className="text-gray-500 text-sm">
                  This is the cost of the infrastructure that will be created,
                  Atmosphere will be charging this ammount every month.
                </p>
              </div>
              <p>
                US$ {parseFloat(pricing.monthly).toFixed(2)}{" "}
              </p>
            </div>
            <div className="flex flex-row justify-end items-start mx-4 px-4 ">
              <PaymentSelector
                className=""
                total={
                  pricing.installation.discounted +
                  pricing.monthly
                }
                setValid={setValid}
                setPaymentInformation={setPaymentInformation}
              ></PaymentSelector>
              <div className=""></div>
            </div>
          </>
        )}
        <p>{paymentFailure}</p>
        <button
          onClick={() => processPayment()}
          type="button"
          className={`flex w-full justify-center rounded-b  items-center px-4 py-2 ${
            valid
              ? "text-gray-100 bg-purple-400 hover:text-white hover:bg-purple-500 hover:shadow"
              : "cursor-not-allowed bg-purple-300 text-gray-800"
          }`}
          disabled={!valid}
        >
          Customize {provider.name}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 w-6"
            stroke="currentColor"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M20.322.75a10.75 10.75 0 00-7.373 2.926l-1.304 1.23A23.743 23.743 0 0010.103 6.5H5.066a1.75 1.75 0 00-1.5.85l-2.71 4.514a.75.75 0 00.49 1.12l4.571.963c.039.049.082.096.129.14L8.04 15.96l1.872 1.994c.044.047.091.09.14.129l.963 4.572a.75.75 0 001.12.488l4.514-2.709a1.75 1.75 0 00.85-1.5v-5.038a23.741 23.741 0 001.596-1.542l1.228-1.304a10.75 10.75 0 002.925-7.374V2.499A1.75 1.75 0 0021.498.75h-1.177zM16 15.112c-.333.248-.672.487-1.018.718l-3.393 2.262.678 3.223 3.612-2.167a.25.25 0 00.121-.214v-3.822zm-10.092-2.7L8.17 9.017c.23-.346.47-.685.717-1.017H5.066a.25.25 0 00-.214.121l-2.167 3.612 3.223.679zm8.07-7.644a9.25 9.25 0 016.344-2.518h1.177a.25.25 0 01.25.25v1.176a9.25 9.25 0 01-2.517 6.346l-1.228 1.303a22.248 22.248 0 01-3.854 3.257l-3.288 2.192-1.743-1.858a.764.764 0 00-.034-.034l-1.859-1.744 2.193-3.29a22.248 22.248 0 013.255-3.851l1.304-1.23zM17.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-11 13c.9-.9.9-2.6 0-3.5-.9-.9-2.6-.9-3.5 0-1.209 1.209-1.445 3.901-1.49 4.743a.232.232 0 00.247.247c.842-.045 3.534-.281 4.743-1.49z"
            ></path>
          </svg>
        </button>
      </>
    ),
  };
  const selection = selector[flavor];
  if (selection) return selection(provider, flavor);
  return (
    <>
      <p className="p-2 text-gray-600">Currently {flavor} is not supported.</p>
    </>
  );
}

export default function VersionSelector({ flavors, provider, callback, token }) {
  const { flavor } = flavors[0];
  //console.log(provider);
  const [selectedFlavor, setSelectedFlavor] = useState(flavor);
  /**/
  return (
    <>
      <h2 className="text-2xl text-align-left pt-5 mb-2">Launch options</h2>
      <div className="flex flex-row">
        <div className="shadow-md border w-full">
          <h2 className="p-2 pl-4 border-b text-xl">
            Launch {provider.name} on
            <select onChange={(event) => setSelectedFlavor(event.target.value)}>
              {flavors.map(({ flavor }) => (
                <option key={flavor} value={flavor}>
                  {flavor}
                </option>
              ))}
            </select>
          </h2>
          <FlavorSelector
            provider={provider}
            flavor={selectedFlavor}
            callback={callback}
            token={token}
          ></FlavorSelector>
        </div>
      </div>
    </>
  );
}

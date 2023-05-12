import { useState } from "react";
import AddFunds from "./addFunds";
import useSWR from "swr";

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
      [`${process.env.NEXT_PUBLIC_RUNNER_URL}/my-account`, token],
      fetcher
    );
    return {
      accountData: data,
      isLoading: !error && !data,
      isError: error,
    };
  }

export default function PaymentSelector({ total, setValid, setPaymentInformation, token }) {

    const { accountData, isLoading, isError } = useMyAccount(token);
    const today = new Date();
    const mm = (today.getMonth() + 1)>9? (today.getMonth() + 1): "0"+(today.getMonth() + 1); //January is 0!
    const yyyy = today.getFullYear();
    const [paymentOption, setPaymentOption] = useState("balance");
    if (total <= 0) {
      setValid(true);
      setPaymentInformation("undefined");
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
    //const [isNewCardValid, setNewCardValid] = useState(false);
    const isPaymentOptionValid = {
      "balance": accountData?(accountData.organizations[0].balance > total):false,
      //"new_card": isNewCardValid,
      //"24hours": true,
    };
    setValid(isPaymentOptionValid[paymentOption]);
    return (
      <>
        <div className="border-l border-r pt-6 px-6 max-w-lg mb-6">
          <div className="">
            <div>
              I want to{" "}
              <select
                className="dark:text-purple-500 border p-2 shadow rounded-xl"
                onChange={(event) => {
                  setPaymentOption(event.target.value);
                  //setNewCardValid(false);
                  setPaymentInformation({"type": event.target.value});
                }}
              >
                {
                    //<option disabled selected value> -- select a payment option -- </option>
                }
                <option value="balance">pay with account balance</option>
                {
                // <option value="new_card">pay with a new card</option>
                }
                {
                    //<option value="24hours">use it for free for 24 hours</option>
                }
              </select>
            </div>
            {paymentOption == "balance" && (
            <div className="text-right flex-col">
                <p className="text-gray-600 text-sm">
                    We will charge US${" "}
                    {parseFloat(total).toFixed(2)} from your current balance. 
                </p>
                {accountData && accountData.organizations.map(({ id, balance, name, subdomain }) => {
                    return (
                    <>
                      <AddFunds
                        organization={name}
                        balance={balance}
                        token={token}>
                      </AddFunds>
                    </>
                    );
                })}
            </div>
            )}
            {/*paymentOption == "24hours" && (
              <p className="text-gray-600 text-sm">
                * After 24 hours, the system will automatically delete all created
                resources, you can pay the total of US${" "}
                {parseFloat(total).toFixed(2)} to preserve your information before
                the 24 hour period ends.
              </p>
            )*/}
            {/*paymentOption == "new_card" && (
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
                )*/}
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
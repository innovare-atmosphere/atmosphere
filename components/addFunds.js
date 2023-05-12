import { useState } from "react";
import SimpleDialog from "./simpleDialog";


export default function AddFunds({balance, token, organization}) {
    const [isPaymentDialog, setPaymentDialog] = useState(false);
    const [fundsToAdd, setFundsToAdd] = useState(10.00);
    const [isAmountInvalid, setAmountInvalid] = useState(false);
    const [isErrorPaymentURL, setErrorPaymentURL] = useState(false);
    const [isLoadingPaymentURL, setLoadingPaymentURL] = useState(false);
    return (
        <>
        {isPaymentDialog && (
            <SimpleDialog
                title="Add funds"
                description="Continue to add funds into your account"
            >
                <>
                    <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Funds to add in US${" "}
                    </label>
                    <input
                        className="border p-1 rounded block w-full dark:bg-gray-500"
                        type="number"
                        placeholder="10.00"
                        name="fundsToAdd"
                        min="5"
                        value={fundsToAdd}
                        onChange={(ev) => {
                            setFundsToAdd(ev.target.value);
                            setAmountInvalid((ev.target.value < 5 || isNaN(ev.target.value)));
                            //generate new link
                            //handleClickPaymentURL(token, ev.target.value);
                        }}>
                    </input>
                    {isAmountInvalid && (
                        <label className="text-sm text-red-400 pt-1">
                        The minimum ammount to add to your account is US$5.00
                        </label>
                    )}
                    {isErrorPaymentURL && (
                        <label className="text-sm text-red-400 pt-1">
                        {isErrorPaymentURL}
                        </label>
                    )}
                    <button
                        className={`p-2 mb-5 mt-5 rounded-full bg-purple-400 flex text-gray-50 text-xs justify-center w-full ${
                            (isAmountInvalid||isLoadingPaymentURL||isErrorPaymentURL)
                              ? "cursor-not-allowed"
                              : "bg-purple-600 hover:shadow-lg"
                          }`}
                        disabled={(isAmountInvalid||isLoadingPaymentURL||isErrorPaymentURL)}
                        onClick={() => {
                            setLoadingPaymentURL(true);
                            const response = fetch(`${process.env.NEXT_PUBLIC_RUNNER_URL}/payment/${fundsToAdd}`,
                            {
                                //body: JSON.stringify({}),
                                headers: {
                                "Content-Type": "application/json",
                                token: token,
                                },
                                method: "GET",
                            });
                            response.then(response => response.json())
                            .then(result => {
                                if (result.error_status){
                                    setErrorPaymentURL(result.error);
                                }else{
                                    setErrorPaymentURL(result.error_status);
                                    setLoadingPaymentURL(false);
                                    window.location = result.redirect_url;
                                }
                            });
                        }}> Continue to payment
                    </button>
                    <a className="p-2 mb-5 rounded-full bg-gray-500 flex text-gray-50 text-xs justify-center hover:shadow-lg" onClick={() => {
                        setErrorPaymentURL(false);
                        setLoadingPaymentURL(false);
                        setPaymentDialog(false);
                    }}>Cancel</a>
                </>
            </SimpleDialog>
        )}
        <p className="mt-5 text-xs">Current balance</p>
        {organization && (<p className="text-xs">{organization}</p>)}
        {balance && ( <p className="mb-3">US$ {parseFloat(balance).toFixed(2)}</p>)}
        {!balance && (<p className="mb-3">US$ {parseFloat(0).toFixed(2)}</p>)}
        <a className="p-2 mb-5 rounded-full bg-gray-600 flex text-gray-50 text-xs justify-center hover:shadow-lg"
        onClick={() => {
            setPaymentDialog(true);
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
            Add funds
        </a>
        </>
    );
}
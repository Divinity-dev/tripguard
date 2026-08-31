"use client";

import Link from "next/link";

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Loader2,
  Search,
  ShieldCheck,
  WalletCards,
  AlertCircle,
} from "lucide-react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useEffect, useRef, useState } from "react";

import ProtectedRoute from "../../../component/ProtectedRoute";

import API from "@/axios/index";


export default function OwnerAccountPage() {

  const queryClient = useQueryClient();

  const [bankSearch, setBankSearch] =
    useState("");

  const [selectedBank, setSelectedBank] =
    useState(null);

  const [accountNumber, setAccountNumber] =
    useState("");

  const [showBanks, setShowBanks] =
    useState(false);

  const [message, setMessage] =
    useState(null);

    const bankSelectorRef = useRef(null);

    useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      bankSelectorRef.current &&
      !bankSelectorRef.current.contains(event.target)
    ) {
      setShowBanks(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);


  /*
   * GET CURRENT PAYMENT ACCOUNT
   */
  const {
    data: paymentData,
    isLoading: paymentLoading,
    isError: paymentError,
  } = useQuery({
    queryKey: ["owner-payment-account"],

    queryFn: async () => {
      const response = await API.get(
        "/users/payment-account"
      );

      return response.data;
    },
  });


  /*
   * GET ALL NIGERIAN BANKS
   */
  const {
    data: banksData,
    isLoading: banksLoading,
    isError: banksError,
  } = useQuery({
    queryKey: ["nigerian-banks"],

    queryFn: async () => {
      const response = await API.get(
        "/users/banks"
      );

      return response.data;
    },

    staleTime:
      1000 * 60 * 60 * 24,
  });


  const banks =
    banksData?.banks || [];

  const paymentAccount =
    paymentData?.paymentAccount || null;


  /*
   * FILTER BANKS
   */
  const filteredBanks =
    banks.filter((bank) =>
      bank.name
        .toLowerCase()
        .includes(
          bankSearch.toLowerCase()
        )
    );


  /*
   * CREATE PAYMENT ACCOUNT
   */
  const setupMutation = useMutation({

    mutationFn: async () => {

      const response =
        await API.post(
          "/users/payment-account",
          {
            bankCode:
              selectedBank.code,

            accountNumber:
              accountNumber.trim(),
          }
        );

      return response.data;
    },

    onSuccess: (data) => {

      queryClient.invalidateQueries({
        queryKey: [
          "owner-payment-account",
        ],
      });

      setMessage({
        type: "success",
        text:
          data.message ||
          "Payment account created successfully.",
      });

      setAccountNumber("");

      setSelectedBank(null);

      setBankSearch("");

      setShowBanks(false);
    },

    onError: (error) => {

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to set up payment account.",
      });
    },
  });


  /*
   * UPDATE PAYMENT ACCOUNT
   */
  const updateMutation = useMutation({

    mutationFn: async () => {

      const response =
        await API.put(
          "/users/payment-account",
          {
            bankCode:
              selectedBank.code,

            accountNumber:
              accountNumber.trim(),
          }
        );

      return response.data;
    },

    onSuccess: (data) => {

      queryClient.invalidateQueries({
        queryKey: [
          "owner-payment-account",
        ],
      });

      setMessage({
        type: "success",
        text:
          data.message ||
          "Payment account updated successfully.",
      });

      setAccountNumber("");

      setSelectedBank(null);

      setBankSearch("");

      setShowBanks(false);
    },

    onError: (error) => {

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to update payment account.",
      });
    },
  });


  const isSubmitting =
    setupMutation.isPending ||
    updateMutation.isPending;


  /*
   * SELECT BANK
   */
  const handleSelectBank = (bank) => {

    setSelectedBank(bank);

    setBankSearch(bank.name);

    setShowBanks(false);

    setMessage(null);
  };


  /*
   * SUBMIT
   */
  const handleSubmit = (event) => {

    event.preventDefault();

    setMessage(null);

    if (!selectedBank) {

      setMessage({
        type: "error",
        text:
          "Please select your bank.",
      });

      return;
    }

    const cleanAccountNumber =
      accountNumber.trim();


    if (!cleanAccountNumber) {

      setMessage({
        type: "error",
        text:
          "Please enter your account number.",
      });

      return;
    }


    if (
      !/^\d+$/.test(
        cleanAccountNumber
      )
    ) {

      setMessage({
        type: "error",
        text:
          "Account number must contain only numbers.",
      });

      return;
    }


    if (
      cleanAccountNumber.length !== 10
    ) {

      setMessage({
        type: "error",
        text:
          "Nigerian bank account numbers should contain 10 digits.",
      });

      return;
    }


    if (paymentAccount) {

      updateMutation.mutate();

    } else {

      setupMutation.mutate();
    }
  };


  /*
   * LOADING
   */
  if (paymentLoading) {

    return (
      <ProtectedRoute allowedRole="owner">

        <div className="flex min-h-screen items-center justify-center bg-[#F7F7F2]">

          <div className="flex items-center gap-3 text-sm text-[#75817D]">

            <Loader2
              className="h-5 w-5 animate-spin"
            />

            Loading account settings...

          </div>

        </div>

      </ProtectedRoute>
    );
  }

  if (paymentError) {
  return (
    <ProtectedRoute allowedRole="owner">
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F2] px-5">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />

          <p className="mt-3 text-sm font-semibold text-red-600">
            Unable to load your payment account.
          </p>

          <p className="mt-2 text-xs text-[#7A8581]">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}


  return (

    <ProtectedRoute allowedRole="owner">

      <main className="min-h-screen bg-[#F7F7F2] text-[#172322]">

        {/* HEADER */}

        <section className="border-b border-[#E4E3DC] bg-white">

          <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8">

            <Link
              href="/owner"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#397A69] transition hover:text-[#173C37]"
            >

              <ArrowLeft className="h-4 w-4" />

              Back to dashboard

            </Link>


            <div className="mt-6">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">

                Account settings

              </p>


              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">

                Payment account

              </h1>


              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#75817D]">

                Set up the Nigerian bank account where
                your property earnings will be settled.

              </p>

            </div>

          </div>

        </section>


        {/* CONTENT */}

        <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">


            {/* FORM */}

            <section className="rounded-[26px] border border-[#E3E3DC] bg-white p-6 sm:p-8">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E1F5ED]">

                  <Building2
                    className="h-6 w-6 text-[#277765]"
                  />

                </div>


                <div>

                  <h2 className="text-xl font-semibold text-[#173C37]">

                    Bank account details

                  </h2>

                  <p className="mt-1 text-sm text-[#7A8581]">

                    Use an account that belongs to you.

                  </p>

                </div>

              </div>


              {/* MESSAGE */}

              {message && (

                <div
                  className={`mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                    message.type === "success"
                      ? "border-[#CDEBDD] bg-[#F0FAF5] text-[#277765]"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >

                  {message.type === "success" ? (

                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

                  ) : (

                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                  )}

                  <span>
                    {message.text}
                  </span>

                </div>

              )}


              {banksError && (

                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">

                  Unable to load Nigerian banks.
                  Please refresh the page and try again.

                </div>

              )}


              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
              >


                {/* BANK */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#394742]">

                    Bank

                  </label>


                  <div ref={bankSelectorRef} className="relative">

                    <div className="relative">

                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA29F]" />

                      <input
                        type="text"
                        value={bankSearch}
                        onChange={(event) => {

                          setBankSearch(
                            event.target.value
                          );

                          setSelectedBank(null);

                          setShowBanks(true);

                          setMessage(null);
                        }}
                        onFocus={() => {
                          setShowBanks(true);
                        }}
                        placeholder={
                          banksLoading
                            ? "Loading banks..."
                            : "Search for your bank"
                        }
                        disabled={
                          banksLoading ||
                          isSubmitting
                        }
                        className="w-full rounded-xl border border-[#DCE2DF] bg-white py-3.5 pl-11 pr-10 text-sm text-[#173C37] outline-none transition placeholder:text-[#A0A8A5] focus:border-[#397A69] focus:ring-4 focus:ring-[#E1F5ED]"
                      />

                      <ChevronDown
                        className={`pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9390] transition ${
                          showBanks
                            ? "rotate-180"
                            : ""
                        }`}
                      />

                    </div>


                    {showBanks &&
                      !banksLoading &&
                      filteredBanks.length > 0 && (

                        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-[#DCE2DF] bg-white p-1 shadow-xl">

                          {filteredBanks.map(
                            (bank) => (

                              <button
                                key={`${bank.id}-${bank.code}`}
                                type="button"
                                onClick={() =>
                                  handleSelectBank(
                                    bank
                                  )
                                }
                                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition hover:bg-[#F1F6F3]"
                              >

                                <span className="font-medium text-[#394742]">

                                  {bank.name}

                                </span>

                                <span className="ml-4 shrink-0 rounded-md bg-[#F4F6F2] px-2 py-1 text-[10px] font-bold text-[#7A8581]">

                                  {bank.code}

                                </span>

                              </button>

                            )
                          )}

                        </div>

                      )}


                    {showBanks &&
                      !banksLoading &&
                      bankSearch &&
                      filteredBanks.length === 0 && (

                        <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-[#DCE2DF] bg-white p-5 text-center shadow-xl">

                          <p className="text-sm font-medium text-[#596661]">

                            No bank found

                          </p>

                          <p className="mt-1 text-xs text-[#8A9390]">

                            Try another bank name.

                          </p>

                        </div>

                      )}

                  </div>


                  {selectedBank && (

                    <div className="mt-2 flex items-center gap-2 text-xs text-[#277765]">

                      <CheckCircle2 className="h-3.5 w-3.5" />

                      {selectedBank.name}

                      <span className="text-[#9AA29F]">

                        ({selectedBank.code})

                      </span>

                    </div>

                  )}

                </div>


                {/* ACCOUNT NUMBER */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#394742]">

                    Account number

                  </label>


                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={accountNumber}
                    onChange={(event) => {

                      const value =
                        event.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setAccountNumber(value);

                      setMessage(null);
                    }}
                    disabled={isSubmitting}
                    placeholder="Enter your 10-digit account number"
                    className="w-full rounded-xl border border-[#DCE2DF] bg-white px-4 py-3.5 text-sm tracking-wide text-[#173C37] outline-none transition placeholder:text-[#A0A8A5] focus:border-[#397A69] focus:ring-4 focus:ring-[#E1F5ED]"
                  />


                  <p className="mt-2 text-xs text-[#8A9390]">

                    Enter your Nigerian bank account
                    number.

                  </p>

                </div>


                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    banksLoading ||
                    banksError
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#173C37] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#23584E] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isSubmitting ? (

                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />

                      {paymentAccount
                        ? "Updating account..."
                        : "Setting up account..."
                      }
                    </>

                  ) : (

                    <>
                      <WalletCards className="h-4 w-4" />

                      {paymentAccount
                        ? "Update payment account"
                        : "Set up payment account"
                      }
                    </>

                  )}

                </button>

              </form>

            </section>


            {/* RIGHT SIDE */}

            <aside className="space-y-6">


              {/* CURRENT ACCOUNT */}

              <section className="rounded-[26px] bg-[#173C37] p-6 text-white">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">

                    <CreditCard className="h-5 w-5 text-[#63E6BE]" />

                  </div>


                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#63E6BE]">

                      Payment account

                    </p>

                    <h2 className="mt-1 text-lg font-semibold">

                      {paymentAccount
                        ? "Connected"
                        : "Not set up"
                      }

                    </h2>

                  </div>

                </div>


                {paymentAccount ? (

                  <div className="mt-6 space-y-4">

                    <div>

                      <p className="text-xs text-white/50">

                        Bank

                      </p>

                      <p className="mt-1 text-sm font-semibold">

                        {paymentAccount.bank ||
                          "—"}

                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-white/50">

                        Account number

                      </p>

                      <p className="mt-1 text-sm font-semibold tracking-wider">

                        {paymentAccount.accountNumber ||
                          "—"}

                      </p>

                    </div>


                    {paymentAccount.accountName && (

                      <div>

                        <p className="text-xs text-white/50">

                          Account name

                        </p>

                        <p className="mt-1 text-sm font-semibold">

                          {
                            paymentAccount.accountName
                          }

                        </p>

                      </div>

                    )}


                    <div className="flex items-center gap-2 border-t border-white/10 pt-4">

                      <CheckCircle2 className="h-4 w-4 text-[#63E6BE]" />

                      <span className="text-xs text-white/70">

                        Payment account configured

                      </span>

                    </div>

                  </div>

                ) : (

                  <p className="mt-5 text-sm leading-6 text-white/60">

                    You haven't connected a payment
                    account yet. Set one up to receive
                    earnings from your properties.

                  </p>

                )}

              </section>


              {/* SECURITY */}

              <section className="rounded-[26px] border border-[#DCE6E2] bg-[#F0F7F4] p-6">

                <div className="flex items-center gap-3">

                  <ShieldCheck className="h-5 w-5 text-[#397A69]" />

                  <h2 className="text-sm font-semibold text-[#173C37]">

                    Your information is secure

                  </h2>

                </div>


                <p className="mt-3 text-xs leading-5 text-[#697570]">

                  Your bank details are securely sent
                  to Paystack for payment processing.
                  TripGuard does not store your banking
                  credentials.

                </p>

              </section>


              {/* HELP */}

              <section className="rounded-[26px] border border-[#E3E3DC] bg-white p-6">

                <h2 className="text-sm font-semibold text-[#173C37]">

                  Need to change your account?

                </h2>

                <p className="mt-2 text-xs leading-5 text-[#7A8581]">

                  You can update your bank details at
                  any time. Your existing Paystack
                  subaccount will be updated instead of
                  creating another one.

                </p>

              </section>

            </aside>

          </div>

        </div>

      </main>

    </ProtectedRoute>
  );
}
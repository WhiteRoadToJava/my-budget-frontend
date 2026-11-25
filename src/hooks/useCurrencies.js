import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrencies } from "../api/currencyService";

// The app's currencies, in the admin's order.
// codes: for accounts, debts and the base currency; paymentCodes: for subscription payments;
// allCodes: every currency of the list that is used for something.
// Both are empty until the list has loaded.
export const useCurrencies = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
    staleTime: 10 * 60 * 1000,
  });
  return useMemo(() => {
    const list = data ?? [];
    return {
      codes: list.filter((c) => c.enabled).map((c) => c.code),
      paymentCodes: list.filter((c) => c.payment).map((c) => c.code),
      allCodes: list.map((c) => c.code),
      isLoading,
      isError,
    };
  }, [data, isLoading, isError]);
};

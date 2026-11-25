import React from "react";
import { useQuery } from "@tanstack/react-query";
import { flagLoader } from "../../utils/currencies/currencyFlags";
import styles from "../../styles/components/currencies/currencyFlag.module.scss";

// A small flag before a currency code; nothing when the currency has no country.
// The picture is decorative: the code next to it says the same.
const CurrencyFlag = ({ code }) => {
  const load = flagLoader(code);
  const { data: src } = useQuery({
    queryKey: ["flag", code],
    queryFn: load,
    enabled: Boolean(load),
    staleTime: Infinity,
    gcTime: Infinity,
  });
  if (!load) return null;
  return src
    ? <img className={styles.flag} src={src} alt="" aria-hidden="true" />
    : <span className={styles.flag} aria-hidden="true" />;
};

export default CurrencyFlag;

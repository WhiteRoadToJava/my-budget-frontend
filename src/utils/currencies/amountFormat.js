// One way to show an amount with its currency, everywhere in the app:
// CODE   (default)  1 250,00 SEK
// SYMBOL            1 250,00 kr   (the user's choice in the settings)
// Two currencies of the app's list with the same symbol (SEK and NOK are both "kr",
// GBP and SYP both "£") keep their code, so an amount is never ambiguous.
import i18n from "../../configuration/i18n";
import { formatMoney } from "../accounts/accountStatement";

const LOCALES = { ar: "ar-u-nu-latn", sv: "sv-SE", en: "en-US" };
const localeOf = (language) => LOCALES[language] ?? LOCALES.en;

// set by UserLayout from the user's preferences and the app's currencies;
// pages outside it (admin, sign-in) keep the codes
let settings = { display: "CODE", codes: [] };
export const configureAmounts = (display, codes = []) => {
  settings = { display: display === "SYMBOL" ? "SYMBOL" : "CODE", codes };
};

const formatters = new Map();
const formatterOf = (currency, language) => {
  const key = `${language}:${currency}`;
  if (!formatters.has(key)) {
    try {
      formatters.set(key, new Intl.NumberFormat(localeOf(language), {
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }));
    } catch {
      formatters.set(key, null); // not a currency the browser knows
    }
  }
  return formatters.get(key);
};

// "kr" for SEK, "€" for EUR...; the code itself for a code Intl has no symbol for
export const symbolOf = (currency, language) =>
  formatterOf(currency, language)?.formatToParts(1).find((p) => p.type === "currency")?.value ?? null;

// true when the currency's symbol is its own among the codes (and is not just the code)
export const hasOwnSymbol = (currency, language, codes = []) => {
  const symbol = symbolOf(currency, language);
  if (!symbol || symbol === currency) return false;
  return !codes.some((other) => other !== currency && symbolOf(other, language) === symbol);
};

// the amount with its currency; a negative amount starts with "−"
// (callers that show their own + or − pass the amount without its sign)
export const formatAmount = (amount, currency, options = {}) => {
  const { display = settings.display, codes = settings.codes, language = i18n.language } = options;
  const number = Number(amount ?? 0) || 0;
  const value = Math.abs(number);
  const sign = number < 0 ? "−" : "";
  if (!currency) return sign + formatMoney(value, language);
  if (display === "SYMBOL" && hasOwnSymbol(currency, language, codes)) {
    return sign + formatterOf(currency, language).format(value);
  }
  return `${sign}${formatMoney(value, language)} ${currency}`;
};

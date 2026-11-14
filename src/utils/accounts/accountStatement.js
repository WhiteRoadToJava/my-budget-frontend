// Account statement as plain text, for WhatsApp / Messenger.
// Plain text on purpose: Messenger shows *bold* markers as they are, and
// column alignment with spaces breaks with proportional fonts and Arabic.
//
// Balance wording (agreed): a positive balance is what they owe us
// ("لنا عندكم"), a negative balance is what we owe them ("لكم عندنا").
// The number is always shown without a sign next to the words.
import {
  addMonths,
  endOfMonth,
  format,
  isValid,
  parseISO,
  startOfMonth,
} from "date-fns";
import { countedAmount, isCancelled, signedAmount, isTransferFee } from "../transactions/transactionList";
import { findCategory } from "../../assiets/categories/assits";
import { categoryName, typeLabelKey } from "../transactionTypes";
import { dateFnsLocale } from "../dates";
import { firstCurrency, pocketOf, transactionCurrency } from "./pockets";

// ---------- periods ----------

const day = (date) => format(date, "yyyy-MM-dd");

// presets offered in the share dialog; "none" sends no transactions
export const periodPreset = (preset, today = new Date()) => {
  if (preset === "thisMonth")
    return { from: day(startOfMonth(today)), to: day(today) };
  if (preset === "lastMonth") {
    const last = addMonths(today, -1);
    return { from: day(startOfMonth(last)), to: day(endOfMonth(last)) };
  }
  return null;
};

export const isValidPeriod = (period) =>
  !!period &&
  isValid(parseISO(period.from)) &&
  isValid(parseISO(period.to)) &&
  period.from <= period.to;

const dayOf = (transaction) => {
  const date = new Date(transaction.createdAt);
  return Number.isNaN(date.getTime()) ? null : day(date);
};

// ---------- numbers ----------

const round2 = (n) => Math.round(n * 100) / 100;

// Latin digits in every language, two decimals
export const formatMoney = (amount, language) =>
  new Intl.NumberFormat(
    language === "ar" ? "ar-u-nu-latn" : language === "sv" ? "sv-SE" : "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(Math.abs(amount));

// "لنا عندكم 1,200.00" / "لكم عندنا 300.00" / "0.00"
export const balancePhrase = (balance, language, t) => {
  const value = round2(balance);
  if (value === 0) return formatMoney(0, language);
  const key = value > 0 ? "share.theyOweUs" : "share.weOweThem";
  return `${t(key)} ${formatMoney(value, language)}`;
};

// the balance at the end of the period: today's balance minus everything after it
export const balanceAt = (currentBalance, transactions, lastDay) =>
  round2(
    transactions
      .filter((t) => (dayOf(t) ?? "") > lastDay)
      .reduce(
        (balance, t) => balance - countedAmount(t),
        Number(currentBalance ?? 0),
      ),
  );

// ---------- lines ----------

// what the transaction was; transfers never name the other account
const labelOf = (transaction, t) => {
  if (transaction.type === "in-transfer") return t("share.transferIn");
  if (transaction.type === "out-transfer") return t("share.transferOut");
  if (isTransferFee(transaction)) return t("share.transferFee");
  const name = categoryName(
    findCategory(transaction.category, transaction.type),
  );
  if (name) return name;
  const key = typeLabelKey(transaction.type);
  return key ? t(key) : transaction.type;
};

const transactionLines = (transaction, language, t) => {
  const amount = signedAmount(transaction);
  const date = format(new Date(transaction.createdAt), "d MMM", {
    locale: dateFnsLocale(language),
  });
  const sign = amount >= 0 ? "+" : "−";
  const text = `${labelOf(transaction, t)}  ${sign} ${formatMoney(amount, language)}`;
  // a cancelled one is struck through (~text~ in WhatsApp) and counts in no total
  const lines = [
    isCancelled(transaction)
      ? `• ${date}  ~${text}~  (${t("cancel.cancelled")})`
      : `• ${date}  ${text}`,
  ];
  const description = transaction.description?.trim();
  if (description) lines.push(`   ${description}`);
  if (isCancelled(transaction) && transaction.cancelReason) lines.push(`   ${t("cancel.reason")}: ${transaction.cancelReason}`);
  return lines;
};

// ---------- the statement ----------

export const buildAccountStatement = ({
  account,
  transactions = [],
  period,
  language = "en",
  t,
  today = new Date(),
  currency: wantedCurrency,
}) => {
  const locale = dateFnsLocale(language);
  // one currency of the account: its balance and only its transactions
  const currency = wantedCurrency ?? firstCurrency(account);
  const current = Number(pocketOf(account, currency)?.totalBalance ?? account?.totalBalance ?? 0);
  // a row without any currency (old data) belongs to the account's only currency
  transactions = transactions.filter((tr) => !currency || !transactionCurrency(tr) || transactionCurrency(tr) === currency);
  const lines = [
    `📊 ${t("share.statementFor", { name: account?.name ?? "" })}`,
  ];

  if (!isValidPeriod(period)) {
    lines.push(
      `${t("share.currency")}: ${currency ?? ""}`,
      `${t("share.currentBalance")}: ${balancePhrase(current, language, t)}`,
    );
  } else {
    const inPeriod = transactions
      .filter((tr) => {
        const d = dayOf(tr);
        return d && d >= period.from && d <= period.to;
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const totalIn = round2(
      inPeriod
        .map(countedAmount)
        .filter((a) => a > 0)
        .reduce((s, a) => s + a, 0),
    );
    const totalOut = round2(
      inPeriod
        .map(countedAmount)
        .filter((a) => a < 0)
        .reduce((s, a) => s - a, 0),
    );
    const from = format(parseISO(period.from), "d MMM yyyy", { locale });
    const to = format(parseISO(period.to), "d MMM yyyy", { locale });
    const endsToday = period.to >= day(today);

    lines.push(
      `${t("share.period")}: ${from} – ${to}`,
      `${t("share.currency")}: ${currency ?? ""}`,
      "",
      `${t("share.moneyIn")}: + ${formatMoney(totalIn, language)}`,
      `${t("share.moneyOut")}: − ${formatMoney(totalOut, language)}`,
      "",
    );
    if (!endsToday) {
      const atEnd = balanceAt(current, transactions, period.to);
      lines.push(
        `${t("share.balanceAtEnd")}: ${balancePhrase(atEnd, language, t)}`,
      );
    }
    lines.push(
      `${t("share.currentBalance")}: ${balancePhrase(current, language, t)}`,
    );

    lines.push("", `${t("share.transactions")}:`);
    if (inPeriod.length === 0) {
      lines.push(t("share.noTransactions"));
    } else {
      for (const tr of inPeriod)
        lines.push(...transactionLines(tr, language, t));
    }
  }

  lines.push("", `— ${t("share.sentFrom")}`);
  lines.push(
    "",
    current < 0
      ? "\n\n 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥"
      : "\n\n 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩",
  );
  return lines.join("\n");
};

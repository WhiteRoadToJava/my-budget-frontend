// Subscription helpers for the banner, the admin pages and the WhatsApp links.

// where users write to renew (later: a setting the admin can change)
export const SUPPORT_WHATSAPP = "+46762638940";

export const PAYMENT_METHODS = [
  "CASH", "SHAM_CASH", "SYRIATEL_CASH", "MTN_CASH", "BANK_TRANSFER", "HAWALA", "FREE", "OTHER",
];

export const PAYMENT_CURRENCIES = ["SYP", "USD", "EUR", "SEK"];

// wa.me wants the number with country code and digits only: "+46 76-263 89 40" -> "46762638940"
export const whatsappLink = (phone, text = "") => {
  const digits = String(phone ?? "").replace(/^00/, "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
};

// What the banner at the top of the app says, or null when nothing is needed.
// key is an i18n key under "subscription."; tone colours the banner.
export const bannerFor = (info, warnDays = 7) => {
  if (!info) return null;
  const { status, daysLeft } = info;
  if (status === "EXPIRED") return { key: "subscription.bannerExpired", tone: "error" };
  if (status === "GRACE") return { key: "subscription.bannerGrace", tone: "warning" };
  if ((status === "TRIAL" || status === "ACTIVE") && daysLeft != null && daysLeft <= warnDays) {
    if (daysLeft <= 0) return { key: "subscription.bannerLastDay", tone: "warning" };
    return {
      key: status === "TRIAL" ? "subscription.bannerTrialEnds" : "subscription.bannerEnds",
      tone: "info",
    };
  }
  return null;
};

// the backend answers 402 to any change once the subscription has ended
export const isSubscriptionExpired = (error) => error?.response?.status === 402;

// months: a number of months, or null when an exact date is used
export const validateExtension = ({ months, until, method, amount, currency }, today) => {
  if (!months && !until) return "admin.validation.durationRequired";
  if (until && until < today) return "admin.validation.noPastDate";
  if (!method) return "admin.validation.methodRequired";
  if (amount !== "" && amount != null) {
    const n = Number(amount);
    if (Number.isNaN(n) || n < 0) return "admin.validation.amountInvalid";
    if (method !== "FREE" && n > 0 && !currency) return "admin.validation.currencyRequired";
  }
  return null;
};

export const toExtendRequest = ({ months, until, method, amount, currency, reference, note }) => ({
  months: until ? null : months,
  until: until || null,
  method,
  amount: amount === "" || amount == null ? null : Number(amount),
  currency: amount === "" || amount == null ? null : currency,
  reference: reference?.trim() || null,
  note: note?.trim() || null,
});

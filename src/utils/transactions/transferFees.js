// Transfer fees on the frontend: the form values, the request shape, and the
// same balance effects the backend computes (TransferEffects), for the summary.
//
// Each fee has an amount, a direction (CHARGE = علينا, taken from its account;
// CREDIT = لنا, added to it) and a currency of its side's account: the send fee
// is paid from the sending account, the receive fee from the receiving one.
// An empty currency means the side's currency.
//
// Transfers saved before could have a fee on a third account: that account is
// kept (sendFeeAccountId / receiveFeeAccountId) and sent back unchanged.

export const FEE_DIRECTIONS = [
  { value: "CHARGE", label: "transferFees.charge" },
  { value: "CREDIT", label: "transferFees.credit" },
];

export const emptyFees = () => ({
  sendFee: "",
  sendFeeDirection: "CHARGE",
  sendFeeAccountId: "",
  sendFeeCurrency: "",
  receiveFee: "",
  receiveFeeDirection: "CHARGE",
  receiveFeeAccountId: "",
  receiveFeeCurrency: "",
});

// from a transfer returned by the backend (find-transfer)
export const feesFromTransfer = (transfer) => {
  const sideOrOther = (feeAccount, sideAccount) =>
    !feeAccount?.id || feeAccount.id === sideAccount?.id ? "" : feeAccount.id;
  return {
    sendFee: transfer?.sendFee ? String(transfer.sendFee) : "",
    sendFeeDirection: transfer?.sendFeeDirection ?? "CHARGE",
    sendFeeAccountId: sideOrOther(transfer?.sendFeeAccount, transfer?.sourceAccount),
    sendFeeCurrency: transfer?.sendFeeCurrency ?? "",
    receiveFee: transfer?.receiveFee ? String(transfer.receiveFee) : "",
    receiveFeeDirection: transfer?.receiveFeeDirection ?? "CHARGE",
    receiveFeeAccountId: sideOrOther(transfer?.receiveFeeAccount, transfer?.destinationAccount),
    receiveFeeCurrency: transfer?.receiveFeeCurrency ?? "",
  };
};

const amountOf = (value) => {
  const n = Number(value);
  return value === "" || value === null || value === undefined || Number.isNaN(n) ? 0 : n;
};

// the fee fields of TransferRequest; sides: { sourceCurrency, destinationCurrency }
// (a fee without its own currency is in its side's currency)
export const feesToRequest = (fees, sides = {}) => ({
  sendFee: amountOf(fees.sendFee),
  sendFeeDirection: fees.sendFeeDirection,
  sendFeeAccount: fees.sendFeeAccountId ? { id: fees.sendFeeAccountId } : null,
  sendFeeCurrency: fees.sendFeeCurrency || (fees.sendFeeAccountId ? undefined : sides.sourceCurrency),
  receiveFee: amountOf(fees.receiveFee),
  receiveFeeDirection: fees.receiveFeeDirection,
  receiveFeeAccount: fees.receiveFeeAccountId ? { id: fees.receiveFeeAccountId } : null,
  receiveFeeCurrency: fees.receiveFeeCurrency || (fees.receiveFeeAccountId ? undefined : sides.destinationCurrency),
});

export const validateFees = (fees) => {
  for (const value of [fees.sendFee, fees.receiveFee]) {
    if (value !== "" && (Number.isNaN(Number(value)) || Number(value) < 0)) {
      return "transferFees.negative";
    }
  }
  return null;
};

const round2 = (n) => Math.round(n * 100) / 100;

const signed = (fee, direction) => (direction === "CREDIT" ? 1 : -1) * amountOf(fee);

// [{ accountId, currency, amount }] per pocket (account + currency), in the order source,
// destination, fee pockets; amounts on the same pocket are added; zero effects are left out.
// A fee is in its chosen currency, else its side's; an old fee on a third account without
// a currency is in that account's first currency (feeCurrencyOf), like the backend does.
export const transferEffects = ({
  sourceId, sourceCurrency = "", destinationId, destinationCurrency = "",
  amountSent, amountReceived, fees, feeCurrencyOf = () => "",
}) => {
  const effects = new Map();
  const add = (id, currency, amount) => {
    if (!id || amount === 0) return;
    const key = `${id}|${currency}`;
    effects.set(key, { accountId: id, currency, amount: round2((effects.get(key)?.amount ?? 0) + amount) });
  };
  const feePocket = (feeAccountId, feeCurrency, sideId, sideCurrency) => {
    if (!feeAccountId || feeAccountId === sideId) return [sideId, feeCurrency || sideCurrency];
    return [feeAccountId, feeCurrency || feeCurrencyOf(feeAccountId)];
  };

  add(sourceId, sourceCurrency, -amountOf(amountSent));
  add(destinationId, destinationCurrency, amountOf(amountReceived));
  add(...feePocket(fees.sendFeeAccountId, fees.sendFeeCurrency, sourceId, sourceCurrency),
    signed(fees.sendFee, fees.sendFeeDirection));
  add(...feePocket(fees.receiveFeeAccountId, fees.receiveFeeCurrency, destinationId, destinationCurrency),
    signed(fees.receiveFee, fees.receiveFeeDirection));
  return [...effects.values()];
};

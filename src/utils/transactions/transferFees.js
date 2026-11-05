// Transfer fees on the frontend: the form values, the request shape, and the
// same balance effects the backend computes (TransferEffects), for the summary.
//
// Each fee has an amount, a direction (CHARGE = علينا, taken from its account;
// CREDIT = لنا, added to it) and an account. An empty account id means
// "the account on the fee's side": the source for the send fee, the
// destination for the receive fee.

export const FEE_DIRECTIONS = [
  { value: "CHARGE", label: "transferFees.charge" },
  { value: "CREDIT", label: "transferFees.credit" },
];

export const emptyFees = () => ({
  sendFee: "",
  sendFeeDirection: "CHARGE",
  sendFeeAccountId: "",
  receiveFee: "",
  receiveFeeDirection: "CHARGE",
  receiveFeeAccountId: "",
});

// from a transfer returned by the backend (find-transfer)
export const feesFromTransfer = (transfer) => {
  const sideOrOther = (feeAccount, sideAccount) =>
    !feeAccount?.id || feeAccount.id === sideAccount?.id ? "" : feeAccount.id;
  return {
    sendFee: transfer?.sendFee ? String(transfer.sendFee) : "",
    sendFeeDirection: transfer?.sendFeeDirection ?? "CHARGE",
    sendFeeAccountId: sideOrOther(transfer?.sendFeeAccount, transfer?.sourceAccount),
    receiveFee: transfer?.receiveFee ? String(transfer.receiveFee) : "",
    receiveFeeDirection: transfer?.receiveFeeDirection ?? "CHARGE",
    receiveFeeAccountId: sideOrOther(transfer?.receiveFeeAccount, transfer?.destinationAccount),
  };
};

const amountOf = (value) => {
  const n = Number(value);
  return value === "" || value === null || value === undefined || Number.isNaN(n) ? 0 : n;
};

// the fee fields of TransferRequest
export const feesToRequest = (fees) => ({
  sendFee: amountOf(fees.sendFee),
  sendFeeDirection: fees.sendFeeDirection,
  sendFeeAccount: fees.sendFeeAccountId ? { id: fees.sendFeeAccountId } : null,
  receiveFee: amountOf(fees.receiveFee),
  receiveFeeDirection: fees.receiveFeeDirection,
  receiveFeeAccount: fees.receiveFeeAccountId ? { id: fees.receiveFeeAccountId } : null,
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

// [{ accountId, amount }] in the order source, destination, fee accounts;
// amounts on the same account are added; zero effects are left out
export const transferEffects = ({ sourceId, destinationId, amountSent, amountReceived, fees }) => {
  const effects = new Map();
  const add = (id, amount) => {
    if (!id || amount === 0) return;
    effects.set(id, round2((effects.get(id) ?? 0) + amount));
  };
  add(sourceId, -amountOf(amountSent));
  add(destinationId, amountOf(amountReceived));
  add(fees.sendFeeAccountId || sourceId, signed(fees.sendFee, fees.sendFeeDirection));
  add(fees.receiveFeeAccountId || destinationId, signed(fees.receiveFee, fees.receiveFeeDirection));
  return [...effects].map(([accountId, amount]) => ({ accountId, amount }));
};

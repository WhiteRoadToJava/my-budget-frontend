import { describe, it, expect } from "vitest";
import {
  emptyFees, feesFromTransfer, feesToRequest, validateFees, transferEffects,
} from "../transactions/transferFees";

const base = { sourceId: "sek", sourceCurrency: "SEK", destinationId: "eur", destinationCurrency: "EUR", amountSent: 1000, amountReceived: 87 };
const fees = (over) => ({ ...emptyFees(), ...over });

describe("transferEffects (same rules as the backend)", () => {
  it("moves only the two accounts without fees", () => {
    expect(transferEffects({ ...base, fees: emptyFees() })).toEqual([
      { accountId: "sek", currency: "SEK", amount: -1000 },
      { accountId: "eur", currency: "EUR", amount: 87 },
    ]);
  });

  it.each([
    ["CHARGE", "CHARGE", -1015, 85],
    ["CHARGE", "CREDIT", -1015, 89],
    ["CREDIT", "CHARGE", -985, 85],
    ["CREDIT", "CREDIT", -985, 89],
  ])("send %s, receive %s", (send, receive, sek, eur) => {
    const result = transferEffects({
      ...base,
      fees: fees({ sendFee: "15", sendFeeDirection: send, receiveFee: "2", receiveFeeDirection: receive }),
    });
    expect(result).toEqual([
      { accountId: "sek", currency: "SEK", amount: sek },
      { accountId: "eur", currency: "EUR", amount: eur },
    ]);
  });

  it("puts a fee on another chosen account", () => {
    // an old transfer with its fee on a third account
    const result = transferEffects({ ...base, fees: fees({ sendFee: "15", sendFeeAccountId: "cash" }), feeCurrencyOf: () => "SEK" });
    expect(result).toEqual([
      { accountId: "sek", currency: "SEK", amount: -1000 },
      { accountId: "eur", currency: "EUR", amount: 87 },
      { accountId: "cash", currency: "SEK", amount: -15 },
    ]);
  });

  it("a fee in another currency of its side's account is its own pocket", () => {
    const result = transferEffects({ ...base, fees: fees({ sendFee: "2", sendFeeCurrency: "USD" }) });
    expect(result).toEqual([
      { accountId: "sek", currency: "SEK", amount: -1000 },
      { accountId: "eur", currency: "EUR", amount: 87 },
      { accountId: "sek", currency: "USD", amount: -2 },
    ]);
  });

  it("an exchange inside one account moves two of its pockets", () => {
    const result = transferEffects({
      sourceId: "w", sourceCurrency: "USD", destinationId: "w", destinationCurrency: "SYP",
      amountSent: 10, amountReceived: 130000, fees: fees({ sendFee: "1" }),
    });
    expect(result).toEqual([
      { accountId: "w", currency: "USD", amount: -11 },
      { accountId: "w", currency: "SYP", amount: 130000 },
    ]);
  });
});

describe("conversion", () => {
  it("builds the request; an empty account means the side account", () => {
    expect(feesToRequest(fees({ sendFee: "15", receiveFee: "", receiveFeeAccountId: "cash" }))).toEqual({
      sendFee: 15, sendFeeDirection: "CHARGE", sendFeeAccount: null,
      receiveFee: 0, receiveFeeDirection: "CHARGE", receiveFeeAccount: { id: "cash" },
    });
  });

  it("a fee without its own currency is sent in its side's currency", () => {
    const request = feesToRequest(fees({ sendFee: "2", receiveFee: "5", receiveFeeCurrency: "EUR" }),
      { sourceCurrency: "USD", destinationCurrency: "SYP" });
    expect(request.sendFeeCurrency).toBe("USD");
    expect(request.receiveFeeCurrency).toBe("EUR");
  });

  it("reads a transfer from the backend; the side account becomes empty", () => {
    const transfer = {
      sourceAccount: { id: "sek" }, destinationAccount: { id: "eur" },
      sendFee: 15, sendFeeDirection: "CREDIT", sendFeeAccount: { id: "sek" },
      receiveFee: 2, receiveFeeDirection: "CHARGE", receiveFeeAccount: { id: "cash" },
    };
    expect(feesFromTransfer(transfer)).toEqual({
      sendFee: "15", sendFeeDirection: "CREDIT", sendFeeAccountId: "", sendFeeCurrency: "",
      receiveFee: "2", receiveFeeDirection: "CHARGE", receiveFeeAccountId: "cash", receiveFeeCurrency: "",
    });
  });

  it("reads an old transfer without fees as no fees", () => {
    expect(feesFromTransfer({ sourceAccount: { id: "a" } })).toEqual(emptyFees());
  });

  it("refuses negative fees", () => {
    expect(validateFees(fees({ sendFee: "-1" }))).toBe("transferFees.negative");
    expect(validateFees(fees({ sendFee: "5", receiveFee: "" }))).toBeNull();
  });
});

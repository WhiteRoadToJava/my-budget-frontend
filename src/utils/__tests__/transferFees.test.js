import { describe, it, expect } from "vitest";
import {
  emptyFees, feesFromTransfer, feesToRequest, validateFees, transferEffects,
} from "../transactions/transferFees";

const base = { sourceId: "sek", destinationId: "eur", amountSent: 1000, amountReceived: 87 };
const fees = (over) => ({ ...emptyFees(), ...over });

describe("transferEffects (same rules as the backend)", () => {
  it("moves only the two accounts without fees", () => {
    expect(transferEffects({ ...base, fees: emptyFees() })).toEqual([
      { accountId: "sek", amount: -1000 },
      { accountId: "eur", amount: 87 },
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
      { accountId: "sek", amount: sek },
      { accountId: "eur", amount: eur },
    ]);
  });

  it("puts a fee on another chosen account", () => {
    const result = transferEffects({ ...base, fees: fees({ sendFee: "15", sendFeeAccountId: "cash" }) });
    expect(result).toEqual([
      { accountId: "sek", amount: -1000 },
      { accountId: "eur", amount: 87 },
      { accountId: "cash", amount: -15 },
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

  it("reads a transfer from the backend; the side account becomes empty", () => {
    const transfer = {
      sourceAccount: { id: "sek" }, destinationAccount: { id: "eur" },
      sendFee: 15, sendFeeDirection: "CREDIT", sendFeeAccount: { id: "sek" },
      receiveFee: 2, receiveFeeDirection: "CHARGE", receiveFeeAccount: { id: "cash" },
    };
    expect(feesFromTransfer(transfer)).toEqual({
      sendFee: "15", sendFeeDirection: "CREDIT", sendFeeAccountId: "",
      receiveFee: "2", receiveFeeDirection: "CHARGE", receiveFeeAccountId: "cash",
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

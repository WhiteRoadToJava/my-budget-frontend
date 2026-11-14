import { describe, it, expect } from "vitest";
import {
  whatsappLink, bannerFor, isSubscriptionExpired, validateExtension, toExtendRequest,
  validatePaymentRequest, toPaymentRequest, USER_PAYMENT_METHODS,
} from "../subscription/subscription";

describe("whatsappLink", () => {
  it("keeps only the digits of an international number", () => {
    expect(whatsappLink("+46 76-263 89 40")).toBe("https://wa.me/46762638940");
    expect(whatsappLink("0046762638940", "Hej")).toBe("https://wa.me/46762638940?text=Hej");
    expect(whatsappLink("")).toBeNull();
  });
});

describe("bannerFor", () => {
  it("says nothing while there is time left or no date", () => {
    expect(bannerFor({ status: "ACTIVE", daysLeft: 20 })).toBeNull();
    expect(bannerFor({ status: "NONE", daysLeft: null })).toBeNull();
    expect(bannerFor(undefined)).toBeNull();
  });

  it("warns in the last week, in grace days and when expired", () => {
    expect(bannerFor({ status: "TRIAL", daysLeft: 5 }).key).toBe("subscription.bannerTrialEnds");
    expect(bannerFor({ status: "ACTIVE", daysLeft: 7 }).key).toBe("subscription.bannerEnds");
    expect(bannerFor({ status: "ACTIVE", daysLeft: 0 }).key).toBe("subscription.bannerLastDay");
    expect(bannerFor({ status: "GRACE", daysLeft: -2 }).tone).toBe("warning");
    expect(bannerFor({ status: "EXPIRED", daysLeft: -10 })).toEqual({ key: "subscription.bannerExpired", tone: "error" });
  });
});

describe("extension form", () => {
  const today = "2026-11-15";
  const base = { months: 3, until: "", method: "SHAM_CASH", amount: "150000", currency: "SYP", reference: " TX-1 ", note: "" };

  it("accepts a normal payment", () => {
    expect(validateExtension(base, today)).toBeNull();
  });

  it.each([
    [{ months: null, until: "" }, "admin.validation.durationRequired"],
    [{ months: null, until: "2026-11-01" }, "admin.validation.noPastDate"],
    [{ method: "" }, "admin.validation.methodRequired"],
    [{ amount: "-1" }, "admin.validation.amountInvalid"],
    [{ currency: "" }, "admin.validation.currencyRequired"],
  ])("rejects %o", (change, key) => {
    expect(validateExtension({ ...base, ...change }, today)).toBe(key);
  });

  it("a free extension needs no amount or currency", () => {
    expect(validateExtension({ ...base, method: "FREE", amount: "", currency: "" }, today)).toBeNull();
  });

  it("builds the request: a date wins over months, empty text becomes null", () => {
    expect(toExtendRequest(base)).toEqual({
      months: 3, until: null, method: "SHAM_CASH", amount: 150000, currency: "SYP", reference: "TX-1", note: null,
    });
    expect(toExtendRequest({ ...base, until: "2027-01-31", amount: "" })).toMatchObject({
      months: null, until: "2027-01-31", amount: null, currency: null,
    });
  });
});

describe("isSubscriptionExpired", () => {
  it("recognises the 402 answer", () => {
    expect(isSubscriptionExpired({ response: { status: 402 } })).toBe(true);
    expect(isSubscriptionExpired({ response: { status: 400 } })).toBe(false);
  });
});

describe("payment request form", () => {
  const base = { months: 3, method: "SHAM_CASH", amount: "150000", currency: "SYP", reference: " TX-9 ", note: " " };

  it("needs months, a method and the transaction number", () => {
    expect(validatePaymentRequest(base)).toBeNull();
    expect(validatePaymentRequest({ ...base, months: null })).toBe("subscription.validation.monthsRequired");
    expect(validatePaymentRequest({ ...base, method: "" })).toBe("subscription.validation.methodRequired");
    expect(validatePaymentRequest({ ...base, reference: "  " })).toBe("subscription.validation.referenceRequired");
    expect(validatePaymentRequest({ ...base, amount: "-5" })).toBe("subscription.validation.amountInvalid");
  });

  it("builds the request", () => {
    expect(toPaymentRequest(base)).toEqual({
      months: 3, method: "SHAM_CASH", amount: 150000, currency: "SYP", reference: "TX-9", note: null,
    });
  });

  it("users can not choose a free extension", () => {
    expect(USER_PAYMENT_METHODS).not.toContain("FREE");
  });
});

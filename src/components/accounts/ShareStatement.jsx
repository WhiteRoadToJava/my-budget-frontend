import React, { useMemo, useState } from "react";
import Modal from "../modals/Modal";
import Button from "../btns/Button";
import Datepicker from "../inputs/Datepicker";
import { buildAccountStatement, isValidPeriod, periodPreset } from "../../utils/accounts/accountStatement";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import styles from "../../styles/components/accounts/shareStatement.module.scss";
import i18n from "../../configuration/i18n";

const PRESETS = ["none", "thisMonth", "lastMonth", "custom"];

// Preview of the account statement and the ways to send it.
// Nothing leaves the app until the user presses a button.
const ShareStatementForm = ({ onClose, account, transactions, currency }) => {
  const [preset, setPreset] = useState("none");
  const [range, setRange] = useState({ from: "", to: "" });
  const [copied, setCopied] = useState(false);

  const period = preset === "custom" ? range : periodPreset(preset);
  const customInvalid = preset === "custom" && range.from && range.to && !isValidPeriod(range);

  const text = useMemo(
    () => buildAccountStatement({
      account,
      transactions,
      currency,
      period: preset === "custom" && !isValidPeriod(range) ? null : period,
      language: i18n.language,
      t: (key, values) => i18n.t(key, values),
    }),
    // period is rebuilt from preset and range on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, transactions, currency, preset, range.from, range.to],
  );

  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const share = async () => {
    try {
      await navigator.share({ text });
    } catch {
      // the user closed the share sheet: nothing to do
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const openWhatsApp = () =>
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");

  return (
    <Modal isOpen onClose={onClose} className={sheet.sheet}>
      <div className={sheet.form}>
        <header className={sheet.header}>
          <h2 className={sheet.title}>{i18n.t("share.title")}</h2>
          <p className={sheet.subtitle}>{i18n.t("share.subtitle")}</p>
        </header>

        <div className={sheet.field}>
          <span className={sheet.label}>{i18n.t("share.period")}</span>
          <div className={styles.periods} role="group" aria-label={i18n.t("share.period")}>
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                className={styles.period}
                aria-pressed={preset === p}
                onClick={() => {
                  setPreset(p);
                  setCopied(false);
                }}
              >
                {i18n.t(`share.presets.${p}`)}
              </button>
            ))}
          </div>
        </div>

        {preset === "custom" && (
          <div className={styles.range}>
            <div className={sheet.field}>
              <span className={sheet.label}>{i18n.t("share.from")}</span>
              <Datepicker value={range.from} onChange={(d) => { setRange((r) => ({ ...r, from: d })); setCopied(false); }} />
            </div>
            <div className={sheet.field}>
              <span className={sheet.label}>{i18n.t("share.to")}</span>
              <Datepicker value={range.to} onChange={(d) => { setRange((r) => ({ ...r, to: d })); setCopied(false); }} />
            </div>
          </div>
        )}
        {customInvalid && (
          <p className={sheet.error} role="alert">{i18n.t("share.invalidPeriod")}</p>
        )}

        <pre className={styles.preview} dir="auto" aria-label={i18n.t("share.preview")}>
          {text}
        </pre>

        {copied && <p className={styles.copied} role="status">{i18n.t("share.copied")}</p>}

        <div className={sheet.actions}>
          <Button variant="cancel" type="button" text={i18n.t("buttons.close")} onClick={onClose} />
          <Button variant="secondary" type="button" text={i18n.t("share.copy")} onClick={copy} />
          {canShare ? (
            <Button variant="primary" type="button" text={i18n.t("share.send")} onClick={share} />
          ) : (
            <Button variant="primary" type="button" text={i18n.t("share.whatsapp")} onClick={openWhatsApp} />
          )}
        </div>
      </div>
    </Modal>
  );
};

// rendered only while open, so every opening starts without a period
// currency: the statement of one currency of the account (the account's first when not given)
const ShareStatement = ({ isOpen, onClose, account, transactions, currency }) =>
  isOpen ? <ShareStatementForm onClose={onClose} account={account} transactions={transactions} currency={currency} /> : null;

export default ShareStatement;

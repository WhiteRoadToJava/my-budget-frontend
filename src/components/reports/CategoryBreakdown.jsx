import React from "react";
import { useCategories } from "../../hooks/useCategories";
import { categoryLabel, debtCategory, DEBT_CATEGORY } from "../../utils/categories/categories";
import { formatMoney } from "../../utils/accounts/accountStatement";
import overview from "../../styles/components/overview/overview.module.scss";
import styles from "../../styles/pages/report/report.module.scss";
import i18n from "../../configuration/i18n";

// the name shown for a group: the category with its emoji, debts, or transfer fees
const useGroupName = () => {
  const { find } = useCategories();
  return (group) => {
    if (group.key === "fees") return i18n.t("report.fees");
    if (group.key === DEBT_CATEGORY) return categoryLabel(debtCategory);
    const category = find(group.sample.category, group.sample.type);
    return category ? `${category.emoji ?? ""} ${categoryLabel(category)}`.trim() : i18n.t("report.noCategory");
  };
};

// a group's part of the total; a very small part is "<1 %" rather than "0 %"
const shareOf = (amount, total) => {
  const percent = Math.round((amount / total) * 100);
  return percent < 1 ? "<1 %" : `${percent} %`;
};

// where the money went (or came from), biggest first, with each group's share
const CategoryBreakdown = ({ title, groups, currency, incoming = false }) => {
  const nameOf = useGroupName();
  const total = groups.reduce((sum, g) => sum + g.amount, 0);
  const max = Math.max(...groups.map((g) => g.amount), 0);

  return (
    <section className={overview.card} aria-label={title}>
      <h3 className={overview.cardTitle}>{title}</h3>
      {groups.length === 0 ? (
        <p className={overview.empty}>{i18n.t(incoming ? "report.noIncome" : "report.noExpenses")}</p>
      ) : (
        <ul className={overview.bars}>
          {groups.map((g) => (
            <li key={g.key} className={overview.barRow}>
              <span className={overview.barName}>{nameOf(g)}</span>
              <span className={overview.barTrack} aria-hidden="true">
                <span
                  className={`${overview.barFill} ${incoming ? styles.incomeFill : ""}`}
                  style={{ display: "block", width: `${max ? (g.amount / max) * 100 : 0}%` }}
                />
              </span>
              <span className={overview.barAmount}>
                {formatMoney(g.amount, i18n.language)} {currency}
                <span className={styles.share}> · {shareOf(g.amount, total)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CategoryBreakdown;
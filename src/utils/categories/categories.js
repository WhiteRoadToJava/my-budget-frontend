import debtIcon from "../../assiets/categories/icons/debt.svg";
import i18n from "../../configuration/i18n";

// Records made by a debt movement (and debt payment schedules) are stored by the backend
// with the category "Debt". It is not one of the user's categories: nobody picks it.
export const DEBT_CATEGORY = "Debt";

export const debtCategory = { key: DEBT_CATEGORY, icon: debtIcon };

// "incomse" -> the user's INCOME categories; expense (and anything else) -> EXPENSE
export const categoryTypeOf = (transactionType) =>
  transactionType === "incomse" ? "INCOME" : "EXPENSE";

// the category of a transaction or schedule, from the user's categories
export const findCategory = (categories = [], category, type) => {
  if (category === DEBT_CATEGORY || type === "debt-in" || type === "debt-out") {
    return debtCategory;
  }
  if (category === undefined || category === null || category === "") return undefined;
  const wanted = categoryTypeOf(type);
  return categories.find((c) => c.type === wanted && c.key === String(category));
};

// the user's own name, else the translated name of a ready-made category
export const categoryLabel = (category) => {
  if (!category) return undefined;
  if (category.key === DEBT_CATEGORY) return i18n.t("debts.category");
  if (category.name) return category.name;
  return category.defaultKey ? i18n.t(`categories.defaults.${category.defaultKey}`) : undefined;
};

// what the category picker shows for one category
export const categoryOption = (category) => `${category.emoji} ${categoryLabel(category)}`;

// emojis offered when choosing one; any other can be typed or pasted
export const EMOJI_CHOICES = [
  "🏠", "🛋️", "💡", "🔥", "💧", "📱", "🛒", "🍽️", "☕", "🍔",
  "🚗", "⛽", "🚌", "✈️", "🏨", "🩺", "💊", "🎓", "📚", "👕",
  "👶", "🐾", "🎁", "🎬", "🎮", "🏋️", "💇", "🧾", "💱", "🏦",
  "💼", "💻", "📈", "👛", "↩️", "🤝", "🕌", "❤️", "🛠️", "🗂️",
];

// the ids of a list after moving one item up (-1) or down (+1); unchanged at the ends
export const moveId = (ids, index, step) => {
  const target = index + step;
  if (index < 0 || target < 0 || target >= ids.length) return ids;
  const moved = [...ids];
  [moved[index], moved[target]] = [moved[target], moved[index]];
  return moved;
};

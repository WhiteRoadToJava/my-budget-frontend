import React from "react";
import SearchableDropDown from "../elements/SearchableDropDown.jsx";
import { useCategories } from "../../hooks/useCategories";
import { categoryOption } from "../../utils/categories/categories";
import i18n from "../../configuration/i18n";

// Choose one of the user's categories, with a search.
// type: "incomse" or "expense"; value: the category key; onChange(key).
// Hidden categories are not offered, but one already on the transaction is still shown.
const CategoryPicker = ({ type, value, onChange }) => {
  const { categories, find } = useCategories();
  const wanted = type === "incomse" ? "INCOME" : "EXPENSE";
  const options = categories.filter((c) => c.type === wanted && !c.hidden);
  const current = find(value, type);

  return (
    <SearchableDropDown
      label={i18n.t("categories.label")}
      placeholder={i18n.t("categories.placeholder")}
      searchPlaceholder={i18n.t("categories.search")}
      name="category"
      list={options.map(categoryOption)}
      value={current?.emoji ? categoryOption(current) : ""}
      onChange={(e) => {
        const chosen = options.find((c) => categoryOption(c) === e.target.value);
        if (chosen) onChange(chosen.key);
      }}
    />
  );
};

export default CategoryPicker;
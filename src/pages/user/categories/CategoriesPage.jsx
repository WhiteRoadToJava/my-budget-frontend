import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../../components/btns/Button";
import CategoryFormModal from "../../../components/categories/CategoryFormModal";
import { useCategories } from "../../../hooks/useCategories";
import { orderCategories, updateCategory } from "../../../api/categoryService";
import { categoryLabel, moveId } from "../../../utils/categories/categories";
import styles from "../../../styles/components/categories/categoriesPage.module.scss";
import i18n from "../../../configuration/i18n";

const TABS = [
  { type: "EXPENSE", label: "categories.page.expenses" },
  { type: "INCOME", label: "categories.page.incomes" },
];

// The user's categories: add, rename, emoji, hide or show, delete, order.
const CategoriesPage = () => {
  const queryClient = useQueryClient();
  const { categories, isLoading, isError } = useCategories();
  const [type, setType] = useState("EXPENSE");
  // null: closed; {}: a new category; { category }: change that one
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const list = categories.filter((c) => c.type === type);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["categories"] });
  const failed = () => setError(i18n.t("categories.page.error"));

  const toggleHidden = useMutation({
    mutationFn: (category) => updateCategory(category.id, { hidden: !category.hidden }),
    onSuccess: refresh,
    onError: failed,
  });

  const move = useMutation({
    mutationFn: (ids) => orderCategories(type, ids),
    // the backend answers with all the categories in their new order
    onSuccess: (all) => queryClient.setQueryData(["categories"], all),
    onError: failed,
  });

  const moveBy = (index, step) => {
    const ids = list.map((c) => c.id);
    const moved = moveId(ids, index, step);
    if (moved !== ids) move.mutate(moved);
  };

  if (isLoading) return <div className={styles.page}>{i18n.t("messages.loading")}</div>;
  if (isError) return <div className={styles.page}>{i18n.t("categories.page.loadError")}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.title}>{i18n.t("categories.page.title")}</h2>
        <Button text={i18n.t("categories.page.add")} onClick={() => setEditing({})} />
      </div>

      <div className={styles.tabs} role="group" aria-label={i18n.t("categories.page.title")}>
        {TABS.map((tab) => (
          <button
            key={tab.type}
            type="button"
            className={styles.tab}
            aria-pressed={type === tab.type}
            onClick={() => {
              setType(tab.type);
              setMessage(null);
            }}
          >
            {i18n.t(tab.label)}
          </button>
        ))}
      </div>

      {message && <p className={styles.message} role="status">{message}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}

      <ul className={styles.list}>
        {list.map((category, index) => (
          <li key={category.id} className={styles.row} data-hidden={category.hidden ? "true" : undefined}>
            <span className={styles.emoji} aria-hidden="true">{category.emoji}</span>
            <span className={styles.name}>
              {categoryLabel(category)}
              {category.hidden && <span className={styles.badge}>{i18n.t("categories.page.hidden")}</span>}
            </span>

            <span className={styles.actions}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label={i18n.t("categories.page.moveUp")}
                title={i18n.t("categories.page.moveUp")}
                disabled={index === 0 || move.isPending}
                onClick={() => moveBy(index, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                className={styles.iconButton}
                aria-label={i18n.t("categories.page.moveDown")}
                title={i18n.t("categories.page.moveDown")}
                disabled={index === list.length - 1 || move.isPending}
                onClick={() => moveBy(index, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                className={styles.textButton}
                disabled={toggleHidden.isPending}
                onClick={() => {
                  setError(null);
                  toggleHidden.mutate(category);
                }}
              >
                {i18n.t(category.hidden ? "categories.page.show" : "categories.page.hide")}
              </button>
              <button
                type="button"
                className={styles.textButton}
                onClick={() => {
                  setError(null);
                  setEditing({ category });
                }}
              >
                {i18n.t("categories.page.edit")}
              </button>
            </span>
          </li>
        ))}
      </ul>

      {editing && (
        <CategoryFormModal
          category={editing.category}
          type={type}
          onClose={() => setEditing(null)}
          onDone={(text) => {
            setEditing(null);
            setMessage(text);
          }}
        />
      )}
    </div>
  );
};

export default CategoriesPage;

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../modals/Modal";
import Button from "../btns/Button";
import { addCategory, deleteCategory, updateCategory } from "../../api/categoryService";
import { EMOJI_CHOICES, categoryLabel } from "../../utils/categories/categories";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import styles from "../../styles/components/categories/categoriesPage.module.scss";
import i18n from "../../configuration/i18n";

const MAX_NAME = 40;

// Add a category (category empty, type given) or change one (name, emoji, delete).
// A ready-made category with an empty name goes back to its translated name.
// onDone(message): closes; message is shown on the page (null when nothing to say).
// Rendered only while open, so every opening starts from the category.
const CategoryFormModal = ({ category, type, onClose, onDone }) => {
  const queryClient = useQueryClient();
  const isNew = !category;
  const isReadyMade = Boolean(category?.defaultKey);
  const [name, setName] = useState(category?.name ?? "");
  const [emoji, setEmoji] = useState(category?.emoji ?? EMOJI_CHOICES[0]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const done = (message) => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    onDone(message);
  };
  const failed = () => setError(i18n.t("categories.page.error"));

  const save = useMutation({
    mutationFn: () =>
      isNew
        ? addCategory({ type, name: name.trim(), emoji })
        : updateCategory(category.id, { name: name.trim(), emoji }),
    onSuccess: () => done(null),
    onError: failed,
  });

  const remove = useMutation({
    mutationFn: () => deleteCategory(category.id),
    // still used by transactions: the backend hid it instead
    onSuccess: (result) => done(result?.deleted ? null : i18n.t("categories.page.hiddenInstead")),
    onError: failed,
  });

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() && !isReadyMade) return setError(i18n.t("categories.page.nameRequired"));
    save.mutate();
  };

  const busy = save.isPending || remove.isPending;

  return (
    <Modal isOpen onClose={onClose} className={sheet.sheet}>
      <form className={sheet.form} noValidate onSubmit={submit}>
        <header className={sheet.header}>
          <h2 className={sheet.title}>
            {i18n.t(isNew ? "categories.page.add" : "categories.page.edit")}
          </h2>
        </header>

        <div className={sheet.field}>
          <label className={sheet.label} htmlFor="category-name">
            {i18n.t("categories.page.name")}
          </label>
          <input
            id="category-name"
            className={styles.input}
            value={name}
            maxLength={MAX_NAME}
            placeholder={isReadyMade ? categoryLabel({ ...category, name: null }) : i18n.t("categories.page.namePlaceholder")}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
          />
          {isReadyMade && <p className={sheet.hint}>{i18n.t("categories.page.readyMadeHint")}</p>}
        </div>

        <div className={sheet.field}>
          <label className={sheet.label} htmlFor="category-emoji">
            {i18n.t("categories.page.emoji")}
          </label>
          <div className={styles.emojiRow}>
            <input
              id="category-emoji"
              className={`${styles.input} ${styles.emojiInput}`}
              value={emoji}
              maxLength={16}
              onChange={(e) => setEmoji(e.target.value)}
            />
            <span className={sheet.hint}>{i18n.t("categories.page.emojiHint")}</span>
          </div>
          <div className={styles.emojiGrid} role="group" aria-label={i18n.t("categories.page.emoji")}>
            {EMOJI_CHOICES.map((choice) => (
              <button
                key={choice}
                type="button"
                className={styles.emojiChoice}
                aria-pressed={emoji === choice}
                onClick={() => setEmoji(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>

        {error && <p className={sheet.error}>{error}</p>}

        <div className={sheet.actions}>
          {!isNew && (
            <Button
              variant="delete"
              type="button"
              disabled={busy}
              text={i18n.t(confirmDelete ? "categories.page.confirmDelete" : "categories.page.delete")}
              onClick={() => (confirmDelete ? remove.mutate() : setConfirmDelete(true))}
            />
          )}
          <Button variant="cancel" type="button" text={i18n.t("buttons.cancel")} onClick={onClose} />
          <Button
            type="submit"
            disabled={busy}
            text={save.isPending ? i18n.t("buttons.processing") : i18n.t("categories.page.save")}
          />
        </div>
        {confirmDelete && <p className={sheet.hint}>{i18n.t("categories.page.deleteExplain")}</p>}
      </form>
    </Modal>
  );
};

export default CategoryFormModal;

import React from "react";
import styles from "../../styles/components/categories/categoryIcon.module.scss";

// The emoji of a user's category, or the picture of a built-in one (Debt);
// fallback: a picture when there is no category (still loading, or deleted).
const CategoryIcon = ({ category, fallback }) => {
  if (category?.emoji) {
    return <span className={styles.emoji}>{category.emoji}</span>;
  }
  const src = category?.icon ?? fallback;
  return src ? <img src={src} alt="" /> : null;
};

export default CategoryIcon;

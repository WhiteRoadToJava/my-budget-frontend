import React, { useState } from "react";
import styles from "../../styles/components/categories/incomeCategoryList.module.scss";
import { expenseCategoryList } from "../../assiets/categories/assits";
import FormInput from "../inputs/FormInput";

const ExpenseCategoryList = ({ expenseItem }) => {
  const list = expenseCategoryList || [];
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const handleChooseCategory = (id) => {
    if (expenseItem) {
      expenseItem(id);
      setIsOpen(false);
      if (list) {
        const category = list.find((item) => item.id === id);
        setCategory(category);
      }
    }
  };
  const handleClickOnInputarea = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.categoriesListContainer}>
      <FormInput
        className={styles.categoryInput}
        label="Category"
        placeholder="Select a category"
        name="category"
        type="text"
        readOnly
        value={category ? category.name : ""}
        style={{ cursor: "pointer" }}
        onClick={handleClickOnInputarea}
      />
      {isOpen && (
        <div
          className={styles.listContainer}
          data-type={isOpen ? "open" : "close"}
        >
          {list.map((item) => (
            <div
              key={item.id}
              className={styles.category}
              onClick={() => handleChooseCategory(item.id)}
            >
              {typeof item.icon === "string" ? (
                <img src={item.icon} alt={item.name} />
              ) : (
                <item.icon />
              )}
              <h2>{item.name}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseCategoryList;

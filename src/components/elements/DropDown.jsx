import React, { useState } from 'react';
import styles from "../../styles/components/elements/dropDown.module.scss";
import FormInput from '../inputs/FormInput';
import i18n from '../../configuration/i18n';
import { onEnterOrSpace } from '../../utils/accessibility';

// renderItem(item): how an item of the list is shown (the item itself by default)
const DropDown = ({ label, text, list, onChange, name, value, placeholder = "Select an option", renderItem }) => {
  const [viewList, setViewList] = useState(false);

  const handleSelect = (item) => {
    setViewList(false);
    // تأكد أن 'item' هنا هو الاسم (String) كما ترسله من الأب
    onChange({
      target: {
        name: name,
        value: item
      }
    });
  };

  return (
    <div className={styles.dropDownContainer}>
      <div onClick={() => setViewList(!viewList)}>
        <FormInput
          label={label}
          value={value || ""}
          name={name}
          type="text"
          text={text}
          placeholder={placeholder}
          readOnly
          style={{ cursor: 'pointer' }}
          onKeyDown={onEnterOrSpace(() => setViewList((prev) => !prev))}
        />
      </div>

      {viewList && (
        <div className={styles.dropDownList}>
          {list.length > 0 ? (
            list.map((item, index) => (
              <div
                key={index}
                className={styles.dropDownItem}
                onClick={() => handleSelect(item)}
                role="button"
                tabIndex={0}
                onKeyDown={onEnterOrSpace(() => handleSelect(item))}
              >
                {renderItem ? renderItem(item) : item}
              </div>
            ))
          ) : (
            <div className={styles.noData}>{i18n.t("messages.noOption")}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropDown;
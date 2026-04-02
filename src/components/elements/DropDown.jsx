import React, { useState } from 'react';
import styles from "../../styles/components/elements/dropDown.module.scss";
import FormInput from '../inputs/FormInput';

const DropDown = ({ label, text, list, onChange, name, value, placeholder = "Select an option" }) => {
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
              >
                {item}
              </div>
            ))
          ) : (
            <div className={styles.noData}>No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropDown;
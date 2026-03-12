import React from 'react';
import PropTypes from "prop-types";
import styles from "src/styles/elements/inputs/searchInput.module.scss";
import Search from 'src/components/icons/btns/Search'; 

export default function SearchInput({ 
    label,
    name,
    value,
    onChange,
    placeholder,
    icon = <Search color="#737379" width={14} height={14} />, 
    disabled,
    required,
    type = "text",
    error,
    success,
    ...restProps 
}) {
    return (
        <div className={`${styles.formInput} ${error ? styles.hasError : ""} ${success ? styles.success : ""}`}>
            {label && (
                <label htmlFor={name} className={styles.label}>
                    {label}
                </label>
            )}

            <div className={styles.inputWrapper}>
                {icon && <span className={styles.iconInside}>{icon}</span>}
                
                <input
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    type={type}
                    required={required}
                    className={`
                        ${styles.inputField} 
                        ${icon ? styles.withIcon : ""} 
                        ${error ? styles.inputError : ""} 
                        ${success ? styles.inputSuccess : ""}
                    `}
                    {...restProps}
                />
            </div>

            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
}

SearchInput.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    icon: PropTypes.node,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    error: PropTypes.string,
    success: PropTypes.string,
    type: PropTypes.string,
};
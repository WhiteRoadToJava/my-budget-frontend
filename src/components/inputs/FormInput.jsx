import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/inputs/formInput.module.scss";
import Error from "../../components/icons/states/Error.jsx";
import Success from "../../components/icons/states/Success.jsx";

export default function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  disabled,
  required,
  type = "text",
  error,
  success,
  ...restProps
}) {
  return (
    <div
      className={`${styles.formInput} ${error ? styles.hasError : ""} ${
        success ? styles.success : ""
      }`}
    >
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}

      {!label && icon && <span className={styles.icon}>{icon}</span>}
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        type={type}
        className={`${error ? styles.inputError : ""} ${
          success ? styles.inputSuccess : ""
        }`}
        required={required}
        {...restProps}
      />
      {error && (
        <div className={styles.errorContainer}>
          <span className={styles.errorIcon}>
            <Error />
          </span>
          <span className={styles.errorMessage}>{error}</span>
        </div>
      )}

      {success && (
        <div className={styles.successContainer}>
          <span className={styles.successIcon}>
            <Success />
          </span>
          <span className={styles.successMessage}>{success}</span>
        </div>
      )}
    </div>
  );
}

FormInput.propTypes = {
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

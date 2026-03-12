import PropTypes from "prop-types";
import styles from "src/styles/elements/inputs/formTextArea.module.scss";

export default function FormTextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows,
  cols,
}) {
  return (
    <div className={styles.formTextArea}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
      />
    </div>
  );
}

FormTextArea.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  cols: PropTypes.number,
};

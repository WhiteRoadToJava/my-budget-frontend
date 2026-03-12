import styles from "src/styles/elements/btns/button.module.scss";
import PropTypes from "prop-types";

export default function Button({
  text,
  variant,
  onClick,
  disabled = false,
  fontSize,
  paddingSize,
  borderSize,
}) {
  const classNames = `${styles.btn} ${styles[variant] || styles.primary}`;

  const buttonStyle = {
    ...(fontSize ? { fontSize } : {}),
    ...(borderSize ? { borderWidth: borderSize } : {}),
    ...(paddingSize ? { padding: paddingSize } : {}),
  };

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
    >
      {text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "cancel-outlined",
    "cancel",
    "light",
    "dark",
    "yellow-outlined",
    "purple-outlined",
    "light-outlined",
  ]).isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

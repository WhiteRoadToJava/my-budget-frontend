import styles from "src/styles/elements/btns/squareButton.module.scss";
import PropTypes from "prop-types";

export default function SquareButton({
  text,
  variant,
  onClick,
  disabled = false,
  fontSize,
  paddingSize,
  borderSize,
  backgroundColor,
  fontWeight,
}) {
  const classNames = `${styles.btn} ${styles[variant] || styles.primary}`;

  const buttonStyle = {
    ...(fontSize ? { fontSize } : {}),
    ...(borderSize ? { borderWidth: borderSize } : {}),
    ...(paddingSize ? { padding: paddingSize } : {}),
    ...(backgroundColor === "black" ? { backgroundColor: "black" } : {}),
    ...(fontWeight ? { fontWeight } : {}),
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

SquareButton.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "cancel", "light"])
    .isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

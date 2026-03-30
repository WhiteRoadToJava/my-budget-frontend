import styles from "src/styles/elements/btns/plusButton.module.scss";
import PlusIcon from "../../components/icons/btns/PlusIcon";
import PropTypes from "prop-types";

export default function PlusButton({
  text,
  variant,
  onClick,
  disabled = false,
  fontSize,
  borderSize,
  backgroundColor,
  fontWeight,
}) {
  const classNames = `${styles.btn} ${styles[variant] || styles.primary}`;

  const buttonStyle = {
    ...(fontSize ? { fontSize } : {}),
    ...(borderSize ? { borderWidth: borderSize } : {}),
    ...(backgroundColor === "black" ? { backgroundColor: "black" } : {}),
    ...(fontWeight ? { fontWeight } : {}),
  };

  let iconSize;
  if (fontSize) {
    const sizeValue = parseFloat(fontSize);
    if (!isNaN(sizeValue)) {
      iconSize = Math.max(7, sizeValue * 0.6);
    }
  }

  return (
    <button
      style={buttonStyle}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
    >
      <PlusIcon style={iconSize} width={iconSize} height={iconSize} />
      {text}
    </button>
  );
}

PlusButton.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "light"]).isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

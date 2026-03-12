import styles from "src/styles/elements/btns/arrowButton.module.scss";
import PropTypes from "prop-types";
import ArrowBtnIcon from "src/components/icons/btns/ArrowBtnIcon";

export default function ArrowButton({
  text,
  variant,
  onClick,
  disabled = false,
  fontSize,
  borderSize,
  fontWeight,
}) {
  const classNames = `${styles.btn} ${styles[variant] || styles.primary}`;

  // conditional expression that creates a style object based on whether
  // the fontSize prop is provided or not
  // if not provided it will use the font size that is set in the scss file
  const buttonStyle = {
    ...(fontSize ? { fontSize } : {}),
    ...(borderSize ? { borderWidth: borderSize } : {}),
    ...(fontWeight ? { fontWeight } : {}),
  };

  // calculate the icon size based on font size (if provided)
  // parse the fontSize value and convert to a number for icon sizing
  let iconSize;
  if (fontSize) {
    const sizeValue = parseFloat(fontSize);
    if (!isNaN(sizeValue)) {
      iconSize = Math.max(7, sizeValue * 0.6);
    }
  }

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
    >
      {text}
      <ArrowBtnIcon
        className={styles.arrowIcon}
        style={iconSize}
        width={iconSize}
        height={iconSize}
      />
    </button>
  );
}

ArrowButton.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "cancel", "light", "dark"])
    .isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  fontSize: PropTypes.string,
};

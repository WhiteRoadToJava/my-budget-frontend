import styles from "../../styles/layout/sidebar/subMenuItem.module.scss";
import { Link } from "react-router-dom";

export default function SubMenuItem({
  subItem,
  index,
  activeSubItem,
  onClick,
}) {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick(index);
  };

  const subMenuItemClasses = `${styles.subMenuItem} ${
    activeSubItem === index ? styles.active : ""
  }`;

  if (subItem.link) {
    return (
      <li className={subMenuItemClasses} onClick={handleClick}>
        <Link href={subItem.link} className={`${styles.menuText} link`}>
          {subItem.label}
        </Link>
      </li>
    );
  }

  return (
    <li className={subMenuItemClasses} onClick={handleClick}>
      <a className={`${styles.menuText} link`}>{subItem.label}</a>
    </li>
  );
}

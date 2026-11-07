import React from "react";
import LanguageSelector from "../elements/LanguageSelector";
import styles from "../../styles/pages/auth/login.module.scss";

// the language choice on the sign-in, register and password pages
const AuthLanguageBar = () => (
  <div className={styles.languageBar}>
    <LanguageSelector />
  </div>
);

export default AuthLanguageBar;

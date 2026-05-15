import React, { useState } from "react";
import UpdatePassword from "../../auth/UpdatePassword";
import styles from "../../../styles/pages/setting/settingPage.module.scss";

const SettingPage = () => {
  const [upadatePassword, setUpadatePassword] = useState(false);

  return (
    <div className={styles.settingContainer}>
      <h1 className={styles.title}>Setting</h1>
      <div className={styles.divider}></div>
      <div className={styles.content}>
        <div className={styles.switchContainer}>
          <div
            className={styles.switch}
            onClick={() => setUpadatePassword(true)}
          >
            <p>Update Password</p>
          </div>
        </div>
        <UpdatePassword display={upadatePassword} />
      </div>
    </div>
  );
};

export default SettingPage;

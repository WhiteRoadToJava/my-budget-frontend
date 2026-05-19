import React, { useState } from "react";
import UpdatePassword from "../../auth/UpdatePassword";
import styles from "../../../styles/pages/setting/settingPage.module.scss";

const SettingPage = () => {
  const [upadatePassword, setUpadatePassword] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);
  const handleSwitchOnClick = (seitchName) => {
    switch (seitchName) {
      case "updatePassword":
        setUpadatePassword(true);
        setUpdateProfile(false);
        break;
      case "updateProfile":
        setUpadatePassword(false);
        setUpdateProfile(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.settingContainer}>
      <h1 className={styles.title}>Setting</h1>
      <div className={styles.divider}></div>
      <div className={styles.content}>
        <div className={styles.switchContainer}>
          <div
            className={styles.switch}
            onClick={()=>handleSwitchOnClick("updatePassword")}
          >
            <p>Update Password</p>
          </div>
          <div className={styles.switch} onClick={()=>handleSwitchOnClick("updateProfile")}>
            <p>Update Profile</p>
          </div>
        </div>
        <UpdatePassword display={upadatePassword} />
      </div>
    </div>
  );
};

export default SettingPage;

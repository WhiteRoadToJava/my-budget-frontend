import React, { useEffect, useState } from "react";
import UpdatePassword from "../../auth/UpdatePassword";
import UpdateUser from "../../../components/user/setting/UpdateUser";
import styles from "../../../styles/pages/setting/settingPage.module.scss";
import { getUser } from "../../../api/userService";
import UserDetails from "../../../components/user/setting/UserDetails";

const SettingPage = () => {
  const [upadatePassword, setUpadatePassword] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [userDetails, setUserDetails] = useState(true);
  const [user, setUser] = useState({});
  const handleSwitchOnClick = async (seitchName) => {
    switch (seitchName) {
      case "updatePassword":
        setUpadatePassword(true);
        setUpdateProfile(false);
        setUserDetails(false);
        break;
      case "updateProfile":
        setUpadatePassword(false);
        setUpdateProfile(true);
        setUserDetails(false);
        break;
      case "userDetails":
        setUpadatePassword(false);
        setUpdateProfile(false);
        setUserDetails(true);
        break;
    }
  };
  useEffect(() => {
    const getUserDetails = async () => {
      const response = await getUser();
      const userDetials = await response.data;
      setUser(userDetials);
      return userDetials;
    };
    getUserDetails();
  }, []);

  return (
    <div className={styles.settingContainer}>
      <h1 className={styles.title}>Setting</h1>
      <div className={styles.divider}></div>
      <div className={styles.content}>
        <div className={styles.switchContainer}>
          <div
            className={styles.switch}
            onClick={() => handleSwitchOnClick("updatePassword")}
          >
            <p>Update Password</p>
          </div>
          <div
            className={styles.switch}
            onClick={() => handleSwitchOnClick("updateProfile")}
          >
            <p>Update Profile</p>
          </div>
        </div>

        <UpdatePassword
          display={upadatePassword}
          setDisplay={() => {
            setUpadatePassword(false);
            setUserDetails(true);
            setUpdateProfile(false);
          }}
        />
        <UpdateUser
          display={updateProfile}
          setDisplay={() => {
            setUpdateProfile(false);
            setUserDetails(true);
            setUpadatePassword(false);
          }}
          user={user}
        />
        <UserDetails
          display={userDetails}
          setDisplay={setUserDetails}
          userDetails={user}
          openUserUpdate={setUpdateProfile}
        />
      </div>
    </div>
  );
};

export default SettingPage;

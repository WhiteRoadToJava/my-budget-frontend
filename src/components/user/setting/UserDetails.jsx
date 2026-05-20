import React from "react";
import styles from "../../../styles/components/user/setting/userDetails.module.scss";
import Button from "../../btns/Button";

const UserDetails = ({ display, setDisplay, userDetails, openUserUpdate }) => {
  const initialedUserDetails = userDetails ? userDetails : {};

  return (
    <div
      className={styles.userDetailsContainer}
      style={{ display: display ? "block" : "none" }}
    >
      <div className={styles.userDetails}>
        <h2>User Details</h2>
        <div className={styles.details}>
          <span className={styles.label}>First Name:</span>
          <p className={styles.value}>{initialedUserDetails.firstname}</p>
        </div>
        <div className={styles.details}>
          <span className={styles.label}>Last Name:</span>
          <p className={styles.value}>{initialedUserDetails.lastname}</p>
        </div>
        <div className={styles.details}>
          <span className={styles.label}>Usernname:</span>
          <p className={styles.value}>{initialedUserDetails.username}</p>
        </div>
        <div className={styles.details}>
          <span className={styles.label}>Phone:</span>
          <p className={styles.value}>{initialedUserDetails.phone}</p>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            variant="primary"
            text="Update Profile"
            type="button"
            onClick={() => {
              setDisplay(false);
              openUserUpdate(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

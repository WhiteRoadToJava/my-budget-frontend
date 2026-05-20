import React, { useEffect, useState } from "react";
import styles from "../../../styles/components/user/setting/updateUser.module.scss";
import Modal from "../../modals/Modal";
import FormInput from "../../inputs/FormInput";
import Button from "../../btns/Button";
import { updateUser, getUser } from "../../../api/userService";
import SuccessConfirmaton from "../../modals/SuccessConfirmaton";
import validteUpdateUser from "../../../validators/validteUpdateUser";
import NavBar from "../../NavBar";

const UpdateUser = ({ display, setDisplay, user }) => {



    const [profile, setProfile] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    phone: user?.phone || "",
  });
  const [error, setError] = useState({
    hasError: false,
    message: "",
    position: "",
  });
  const [success, setSuccess] = useState({
    hasSuccess: false,
    message: "",
  });

  useEffect(() => {
    setProfile({
      firstname:user?.firstname || "", 
      lastname:user?.lastname || "", 
      phone:user?.phone || "",
    });
  }, [user]);



  const handleClearError = () => {
    setError({ hasError: false, message: "", position: "" });
    setSuccess({ hasSuccess: false, message: "" });
    setProfile(
      profile?.data?.firstname
        ? profile.data
        : JSON.parse(localStorage.getItem("profiles"))
    );
    setDisplay(false);
  };
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError({ hasError: false, message: "", position: "" });

    try {
      validteUpdateUser(profile);
      const response = await updateUser(profile);
      if (
        response.status === 200 ||
        response === "Profile updated successfully"
      ) {
        localStorage.setItem("profiles", JSON.stringify(profile));
        const successMsg =
          typeof response === "string"
            ? response
            : response.message || "Updated successfully";

        setError({ hasError: false, message: "", position: "" });
        setSuccess({ hasSuccess: true, message: successMsg });
      }
      <NavBar profile={profile} />;
    } catch (error) {
      setError({
        hasError: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile",
        position: error.position || "firstname",
      });
    }
  };
  return (
    <div
      className={styles.updateContainer}
      style={{ display: display ? "block" : "none" }}
    >
      <form className={styles.formContainer}>
        <h2>Update Profile</h2>
        <div className={styles.inputContainer}>
          <FormInput
            label="First Name"
            name="firstname"
            error={error.position === "firstname" ? error.message : ""}
            value={profile.firstname}
            onChange={(e) => setProfile({ ...profile, firstname: e.target.value })}
            type="text"
            placeholder="First Name"
          />
        </div>
        <div className={styles.inputContainer}>
          <FormInput
            label="Last Name"
            name="lastname"
            error={error.position === "lastname" ? error.message : ""}
            value={profile.lastname}
            onChange={(e) => setProfile({ ...profile, lastname: e.target.value })}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <div className={styles.inputContainer}>
          <FormInput
            label="Phone"
            name="phone"
            error={error.position === "phone" ? error.message : ""}
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            type="text"
            placeholder="Phone"
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button
            variant="primary"
            text="Update Profile"
            type="button"
            onClick={handleUpdateProfile}
          />
          <Button
            variant="cancel"
            text="Cancel"
            type="button"
            onClick={() => {
              handleClearError();
              setDisplay(false);
            }}
          />
        </div>
      </form>

      <SuccessConfirmaton
        isOpen={success.hasSuccess}
        message={success.message}
        onClose={() => {
          setSuccess({ hasSuccess: false, message: "" });
          setDisplay(false);
        }}
      />
    </div>
  );
};

export default UpdateUser;

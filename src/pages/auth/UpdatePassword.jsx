import React, { useState } from "react";
import styles from "../../styles/auth/updatePassword.module.scss";
import InputForm from "../../components/inputs/FormInput";
import { validateUpdatePassword } from "../../validators/validateUpdatePassword.JS";
import { updatePassword } from "../../api/authService";
import Button from "../../components/btns/Button";
import SuccessConfirmaton from "../../components/modals/SuccessConfirmaton";

const UpdatePassword = ({ display }) => {
  const [request, setRequest] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequest({ ...request, [name]: value });
    setError({ hasError: false, message: "", position: "" });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError({ hasError: false, message: "", position: "" });

    const validation = await validateUpdatePassword(request);

    if (validation.hasError) {
      setError(validation);
      return;
    }

    try {
      const response = await updatePassword(request);

      if (
        response.status === 200 ||
        response === "Password updated successfully"
      ) {
        const successMsg =
          typeof response.data === "string"
            ? response.data
            : response.data.message || "Updated successfully";

        setError({ hasError: false, message: "", position: "" });
        setSuccess({ hasSuccess: true, message: successMsg });

        setRequest({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      setError({
        hasError: true,
        message: error.response?.data?.message || "Failed to update password",
        position: "oldPassword",
      });
    }
  };

  const handleClearError = () => {
    setError({ hasError: false, message: "", position: "" });
    setSuccess({ hasSuccess: false, message: "" });
    setRequest({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div
      className={styles.updatePasswordContainer}
      style={{ display: display ? "block" : "none" }}
    >
     
      <form className={styles.formContainer} onSubmit={handleUpdatePassword}>
         <h2>Update Password</h2>
        <div className={styles.inputContainer}>
          <InputForm
            label="Current Password"
            name="currentPassword"
            error={error.position === "currentPassword" ? error.message : ""}
            value={request.currentPassword}
            onChange={handleInputChange}
            type="password"
            placeholder="Current Password"
          />
        </div>
        <div className={styles.inputContainer}>
          <InputForm
            label="New Password"
            name="newPassword"
            error={error.position === "newPassword" ? error.message : ""}
            value={request.newPassword}
            onChange={handleInputChange}
            type="password"
            placeholder="New Password"
          />
        </div>
        <div className={styles.inputContainer}>
          <InputForm
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            error={error.position === "confirmPassword" ? error.message : ""}
            value={request.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button variant="primary" text="Update Password" type="submit" />
          <Button
            variant="cancel"
            text="Cancel"
            type="button"
            onClick={handleClearError}
          />
        </div>
      </form>

      <SuccessConfirmaton
        isOpen={success.hasSuccess}
        message={success.message}
        onClose={() => setSuccess({ hasSuccess: false, message: "" })}
      />
    </div>
  );
};

export default UpdatePassword;

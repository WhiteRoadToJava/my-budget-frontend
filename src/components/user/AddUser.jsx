import React, { useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import styles from "../../styles/components/admin/addUser.module.scss";
import { addUser } from "../../api/admin/adminService.js";
import { validateRegisterUser } from "../../validators/validateRegisterUser.js";
import Button from "../../components/btns/Button.jsx";
import SuccessConfigration from "../../components/modals/SuccessConfirmaton.jsx";

const AddUser = () => {
  const [userRequset, setuserRequest] = useState({
    username: "",
    passsword: "",
    firstname: "",
    lastname: "",
    phone: "",
  });
  const [open, setOpen] = useState(true);
  const [error, setError] = useState({
    hasError: false,
    message: "",
    errorPosition: "",
  });
  const [success, setSuccess] = useState({
    isSucess: false,
    message: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setuserRequest({ ...userRequset, [name]: value });
    setError({
      hasError: false,
      message: "",
      errorPosition: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...userRequset };
    const validation = validateRegisterUser(payload);
    if (validation.hasError) {
      setError({
        hasError: validation.hasError,
        message: validation.message,
        errorPosition: validation.position,
        
      });
      console.log( "hte error". validation)
      return;
    }

    try {
      const response = await addUser(payload);
      if (response.status === 201) {
        setSuccess({
          isSucess: true,
          message: "register user is successfully",
        });
        setOpen(true);
      }
    } catch (err) {
      setError({
        hasError: true,
        message: "You can not register the new user \n" + err,
        errorPosition: "general",
      });
    }
  };

  const handleClearError = () => {
    setError({ hasError: false, message: "", position: "" });
    setSuccess({ hasSuccess: false, message: "" });
    setuserRequest({
      username: "",
      passsword: "",
      firstname: "",
      lastname: "",
      phosne: "",
    });
    setOpen(false);
  };

  return (
    <>
      <Modal isOpen={open} close={() => setOpen(false)}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Add new user</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <FormInput
                label="Username"
                placeholder="Type username in here..."
                name="username"
                error={
                  error.errorPosition == "username"
                    ? error.message
                    : null
                }
                type="text"
                value={userRequset.username}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputContainer}>
              <FormInput
                label="PassWord"
                placeholder="Type password in here..."
                name="password"
                type="password"
                value={userRequset.password}
                onChange={handleInputChange}
                error={
                  error.errorPosition == "password"
                    ? error.message
                    : null
                }
              />
            </div>
            <div className={styles.inputContainer}>
              <FormInput
                label="First name"
                placeholder="Type first name in here..."
                name="firstname"
                type="text"
                value={userRequset.firstname}
                onChange={handleInputChange}
                error={
                  error.errorPosition == "firstname"
                    ? error.message
                    : null
                }
              />
            </div>
            <div className={styles.inputContainer}>
              <FormInput
                label="Last name"
                placeholder="Type lastname in here..."
                name="lastname"
                type="text"
                value={userRequset.lastname}
                onChange={handleInputChange}
                error={
                  error.errorPosition == "lastname"
                    ? error.message
                    : null
                }
              />
            </div>
            <div className={styles.inputContainer}>
              <FormInput
                label="Phone number"
                placeholder="Type phone number in here..."
                name="phone"
                type="text"
                value={userRequset.phone}
                onChange={handleInputChange}
                error={
                  error.errorPosition == "phone"
                    ? error.message
                    : null
                }
              />
            </div>

            {error.errorPosition === "general" ? (
              <p className={styles.errorMessage}>{error.message}</p>
            ) : null}

            <div className={styles.buttonContainer}>
              <Button variant="primary" text="Create user" type="submit" />
              <Button
                variant="cancel"
                text="Cancel"
                type="button"
                onClick={handleClearError}
              />
            </div>
          </form>
        </div>
      </Modal>

      <SuccessConfigration
        isOpen={success.isSucess}
        onClose={() => setSuccess({
          isSucess:false
        })}
        message={success.message}
      />
    </>
  );
};

export default AddUser;

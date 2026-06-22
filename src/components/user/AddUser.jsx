import React, { useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import styles from "../../styles/components/admin/addUser.module.scss";
import { registeUser } from "../../api/userService";
import  {validateRegisterUser} from '../../validators/validateRegisterUser.js'

const AddUser = () => {
  const [userRequset, setuserRequest] = useState({
    username: "",
    passswprd: "",
    firstname: "",
    lastname: "",
    phnne: "",
  });
  const [open, setOpen] = useState(true);
  const [error, setError] = useState({
    hseError: true,
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
    console.log(userRequset);
  };

  const handleSubmit = async () => {
    const payload = { ...userRequset };
    const validation = validateRegisterUser(payload);
    if (validation.hasError) {
      setError(validation);
    }
    try {
      const response = await registeUser(payload);
      if (response.status === 200) {
        setSuccess({
          isSucess: true,
          message: "register user is successfully",
        });
      }
    } catch (err) {
      setError({
        hasError: true,
        message: "You can not register the new user" + err,
        errorPosition: "general",
      });
    }
  };

  const handleClearError = () => {
    setError({ hasError: false, message: "", position: "" });
    setSuccess({ hasSuccess: false, message: "" });
    setuserRequest({
      username: "",
      passswprd: "",
      firstname: "",
      lastname: "",
      phnne: "",
    });
    setOpen(false)
  };

  return (
    <>
      <Modal isOpen={open} close={() => setOpen(false)}>
        <div className={styles.formContainer}>
          <h2>Add new user</h2>
          <form>
            <div className={styles.inputContainer}>
              <FormInput
                label="Username"
                placeholder="Type username in here..."
                name="username"
                error={
                  error.hseError && error.errorPosition == "username"
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
                  error.hseError && error.errorPosition == "password"
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
                  error.hseError && error.errorPosition == "firstname"
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
                  error.hseError && error.errorPosition == "lastname"
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
                  error.hseError && error.errorPosition == "phone"
                    ? error.message
                    : null
                }
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
        </div>
      </Modal>

      <SuccessConfigration
        isOpen={success.isSucess}
        isClose={() => setSuccess.isSucess === false}
      />
    </>
  );
};

export default AddUser;

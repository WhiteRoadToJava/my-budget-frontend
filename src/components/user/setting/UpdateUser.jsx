import React, { useState } from 'react'
import styles from "../../styles/components/users/setting/updateUser.module.scss"
import Modal from '../../modals/Modal'
import FormInput from '../../inputs/FormInput'

const UpdateUser = ({ display }) => {
  const [profile, setProfile] = useState({
    firstname:"",
    lastname:"",
    phone:""
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
  const initializedProfile = localStorage.getItem("profile")

  return (
    <div>
      
      
    </div>
  )
}

export default UpdateUser

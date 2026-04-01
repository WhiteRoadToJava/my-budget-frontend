import React from 'react'
import styles from "../../styles/modals/successConfirmation.module.scss";
import Modal from './Modal';
import Button from '../btns/Button';

const SuccessConfirmaton = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.successConfirmationModal}>
      <div className={styles.successConfirmationContainer}>
        <h2>Success!</h2>
        <p>Your action was completed successfully.</p>
        <div className={styles.buttonContainer}>
          <Button variant="primary" text="OK" onClick={onClose} />
        </div>
      </div>
    </Modal>

  )
}

export default SuccessConfirmaton

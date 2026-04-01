import React from 'react'
import styles from "../../styles/modals/deleteConfirmation.module.scss";
import Modal from './Modal';
import Button from '../btns/Button';
const DeleteConfirmation = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.deleteConfirmationModal}>
      <div className={styles.deleteConfirmationContainer}>
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this account? This action cannot be undone.</p>
        <div className={styles.buttonContainer}>
          <Button variant="cancel" text="Cancel" onClick={onClose} />
          <Button variant="danger" text="Delete" onClick={onDelete} />
        </div>
      </div>
    </Modal>

  )
}

export default DeleteConfirmation

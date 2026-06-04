import React from 'react'
import styles from "../../styles/modals/deleteConfirmation.module.scss";
import Modal from './Modal';
import Button from '../btns/Button';
import i18n from 'i18next';
const DeleteConfirmation = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.deleteConfirmationModal}>
      <div className={styles.deleteConfirmationContainer}>
        <h2>{i18n.t('buttons.delete')}</h2>
        <p>{i18n.t('messages.deleteConfirmation')}</p>
        <div className={styles.buttonContainer}>
          <Button variant="cancel" text={i18n.t('buttons.cancel')} onClick={onClose} />
          <Button variant="danger" text={i18n.t('buttons.delete')} onClick={onDelete} />
        </div>
      </div>
    </Modal>

  )
}

export default DeleteConfirmation

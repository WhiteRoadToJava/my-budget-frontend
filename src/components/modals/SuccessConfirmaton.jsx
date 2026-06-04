import React from 'react'
import styles from "../../styles/modals/successConfirmation.module.scss";
import Modal from './Modal';
import Button from '../btns/Button';
import i18n from 'i18next';

const SuccessConfirmaton = ({ isOpen, message, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.successConfirmationModal}>
      <div className={styles.successConfirmationContainer}>
        <h2>{i18n.t('successConfirmation.title')}</h2>
        <p>{message}.</p>
        <div className={styles.buttonContainer}>
          <Button variant="primary" text={i18n.t('buttons.ok')} onClick={onClose} />
        </div>
      </div>
    </Modal>

  )
}

export default SuccessConfirmaton

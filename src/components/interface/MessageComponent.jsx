import Message from "../icons/interface/Message.jsx";
import styles from "../../styles/interface/messagComponent.module.scss";
import React from "react";

const MessageComponent = ({ messageCount =0 }) => {
  return (
    <div
      className={styles.messageContainer}
      data-type={messageCount > 0 ? "message" : "no-message"}
    >
      {messageCount > 0 && (
        <div className={styles.messageCounter}>{messageCount}</div>
      )}
      <Message className={styles.messageIcon} />
    </div>
  );
};

export default MessageComponent;

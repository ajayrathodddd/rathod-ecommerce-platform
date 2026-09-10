import React from "react";
import { Alert } from "react-bootstrap";

function Message({ variant, children, onClose }) {
  return (
    <Alert variant={variant} onClose={onClose} dismissible={!!onClose}>
      {children}
    </Alert>
  );
}

export default Message;
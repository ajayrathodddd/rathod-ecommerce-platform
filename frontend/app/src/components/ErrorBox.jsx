import React from "react";
import { Alert } from "react-bootstrap";

function ErrorBox({ errors }) {
  if (!errors) return null;
  const messages = Array.isArray(errors)
    ? errors.filter(Boolean)
    : Object.values(errors).filter(Boolean);

  if (!messages.length) return null;

  return (
    <Alert variant="danger">
      <ul className="mb-0">
        {messages.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </Alert>
  );
}

export default ErrorBox;

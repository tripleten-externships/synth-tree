import React from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import GoogleButton from "../GoogleButton/GoogleButton";

const LogInModal: React.FC = () => {
  return (
    <div>
      <ModalWithForm title="Log in">
        {/* Email */}
        <input
          className="signup-modal__input"
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          required
        ></input>
        {/* Password */}
        <input
          className="signup-modal__input"
          type="text"
          name="password"
          id="passwprd"
          placeholder="Password"
          required
        ></input>
      </ModalWithForm>
      {/* Forgot Password */}
      <button type="button">Forgot Password</button>
    </div>
  );
};

export default LogInModal;

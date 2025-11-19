import React from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

// interface SignUpModalProps {
//   title: "Sign up to start learning";
// }

const SignUpModal: React.FC = () => {
  return (
    <div className="signup-modal">
      <ModalWithForm title="Sign up to start learning">
        <form className="signup-modal__form">
          {/* Name */}
          <input
            className="signup-modal__input"
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            required
          ></input>
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
          {/* Repeat Password */}
          <input
            className="signup-modal__input"
            type="text"
            name="repeat-password"
            id="repeat-password"
            placeholder="Repeat Password"
            required
          ></input>
          {/* Sign Up Button */}
          <button className="signup-modal__btn signup-modal__btn_signup">
            Sign Up
          </button>
          {/* Log In Button */}
          <button className="signup-modal__btn signup-modal__btn_login">
            Log In
          </button>
          {/* Continue with Google Button */}
          {/* Continue with Facebook Button */}
        </form>
      </ModalWithForm>
    </div>
  );
};

export default SignUpModal;

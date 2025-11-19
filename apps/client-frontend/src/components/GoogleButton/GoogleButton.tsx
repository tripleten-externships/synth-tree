import { signInWithGoogle } from "../../lib/firebase";

const GoogleButton: React.FC = () => {
  return (
    <div className="googleButton">
      <button
        className="googleButton__btn"
        type="submit"
        onClick={signInWithGoogle}
      >
        Continue with Google
      </button>
    </div>
  );
};

export default GoogleButton;

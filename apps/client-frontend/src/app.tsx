import SignUpModal from "../src/components/SignUpModal/SignUpModal";
import LogInModal from "../src/components/LogInModal/LogInModal";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">Client Frontend Running </h1>
      <SignUpModal></SignUpModal>
      <LogInModal></LogInModal>
    </div>
  );
}

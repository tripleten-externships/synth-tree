import { initFirebaseAuth } from "@synth-tree/config/firebase";

const { app, auth } = initFirebaseAuth();

export { app, auth };
export default app;

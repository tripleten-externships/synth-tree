import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin using the .env values
admin.initializeApp({
  credential: admin.credential.cert({
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const email = "admin@fox-finance.net";
const password = "Password123";

async function ensureAdminUser() {
  try {
    // Try to fetch the user
    const user = await admin.auth().getUserByEmail(email);
    console.log(`User already exists: ${user.uid}`);

    // Show provider info (helps confirm if password provider exists)
    console.log(
      "Providers:",
      user.providerData.map((p) => p.providerId),
    );

    // Force-set password to guarantee login works
    await admin.auth().updateUser(user.uid, {
      password,
    });

    console.log("Password updated successfully!");
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      // Create the user if missing
      try {
        const newUser = await admin.auth().createUser({
          email,
          password,
        });
        console.log(`User created: ${newUser.uid}`);
      } catch (createError) {
        console.error("Error creating user:", createError);
      }
    } else {
      console.error("Error checking user:", error);
    }
  }
}

ensureAdminUser();

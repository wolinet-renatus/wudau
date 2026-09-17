const admin = require("firebase-admin");
const initializeSettings = require("../index");

const initFirebase = async () => {
  try {
    await initializeSettings;
    if (
      settingJSON &&
      settingJSON.privateKey &&
      settingJSON.privateKey.private_key &&
      settingJSON.privateKey.private_key.includes("BEGIN PRIVATE KEY")
    ) {
      admin.initializeApp({
        credential: admin.credential.cert(settingJSON.privateKey),
      });
      console.log("Firebase Admin SDK initialized successfully");
      return admin;
    } else {
      console.log("Firebase Admin SDK skipped: privateKey not configured or contains placeholder.");
      return {
        messaging: () => ({
          send: async () => ({ success: true, mock: true }),
          sendMulticast: async () => ({ responses: [], mock: true }),
        }),
      };
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK (safe mock fallback):", error.message);
    return {
      messaging: () => ({
        send: async () => ({ success: false, error: error.message }),
        sendMulticast: async () => ({ responses: [], error: error.message }),
      }),
    };
  }
};

module.exports = initFirebase();

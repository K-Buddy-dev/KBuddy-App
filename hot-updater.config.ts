import { expo } from "@hot-updater/expo";
import { firebaseDatabase, firebaseStorage } from "@hot-updater/firebase";
import "dotenv/config";
import * as admin from "firebase-admin";
import { defineConfig } from "hot-updater";

// https://firebase.google.com/docs/admin/setup?hl=en#initialize_the_sdk_in_non-google_environments
// Check your .env file and add the credentials
// Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to your credentials file path
// Example: GOOGLE_APPLICATION_CREDENTIALS=./firebase-adminsdk-credentials.json
const credential = admin.credential.applicationDefault();

export default defineConfig({
  build: expo(),
  storage: firebaseStorage({
    projectId: process.env.EXPO_PUBLIC_HOT_UPDATER_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.EXPO_PUBLIC_HOT_UPDATER_FIREBASE_STORAGE_BUCKET!,
    credential,
  }),
  database: firebaseDatabase({
    projectId: process.env.EXPO_PUBLIC_GOOGLE_APPLICATION_CREDENTIALS!,
    credential,
  }),
});

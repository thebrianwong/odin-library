const firebaseConfig = {
  apiKey: "AIzaSyD_EjULcYBq6q6cB_3vd1mxLG1NWn8FLG0",
  authDomain: "odin-library-c73fd.firebaseapp.com",
  projectId: "odin-library-c73fd",
  storageBucket: "odin-library-c73fd.appspot.com",
  messagingSenderId: "1012203865044",
  appId: "1:1012203865044:web:16b25d41b487ddde78cc41",
};

export function getFirebaseConfig() {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    throw new Error(
      "No Firebase configuration object provided." +
        "\n" +
        "Add your web app's configuration object to firebase-config.js"
    );
  } else {
    return firebaseConfig;
  }
}

import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = async () => {
  await signInWithEmailAndPassword(auth, email.value, password.value);
  location.href = "dashboard.html";
};

window.signup = async () => {
  const u = await createUserWithEmailAndPassword(auth, email.value, password.value);
  await setDoc(doc(db, "users", u.user.uid), {
    email: email.value,
    balance: 0,
    totalAdsWatched: 0,
    role: "user",
    isBlocked: false
  });
  location.href = "dashboard.html";
};

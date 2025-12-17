import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { setDoc, doc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = async () => {
  await signInWithEmailAndPassword(auth,email.value,password.value);
  location.href="dashboard.html";
};

window.signup = async () => {
  const c = await createUserWithEmailAndPassword(auth,email.value,password.value);
  await setDoc(doc(db,"users",c.user.uid),{
    balance:0, totalAdsWatched:0, role:"user"
  });
  location.href="dashboard.html";
};

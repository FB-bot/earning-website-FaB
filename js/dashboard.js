import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  // ❗ user document না থাকলে create করো
  if (!snap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      balance: 0,
      totalAdsWatched: 0,
      role: "user",
      isBlocked: false
    });
  }

  const data = (await getDoc(userRef)).data();

  document.getElementById("balance").innerText = data.balance;
  document.getElementById("ads").innerText = data.totalAdsWatched;
});

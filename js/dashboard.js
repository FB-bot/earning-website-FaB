import { auth, db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async u => {
  const s = await getDoc(doc(db, "users", u.uid));
  balance.innerText = s.data().balance;
  ads.innerText = s.data().totalAdsWatched;
});

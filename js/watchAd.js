import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let sec = 15;
let active = true;

document.addEventListener("visibilitychange", () => {
  if (document.hidden) active = false;
});

// 🔥 LOAD MONETAG FROM FIRESTORE
const cfg = await getDoc(doc(db, "adsConfig", "main"));
if (!cfg.exists()) {
  alert("Ads config missing");
}

adBox.innerHTML = cfg.data().monetagScript;

// ⏱ TIMER
const t = setInterval(async () => {
  if (!active) {
    clearInterval(t);
    alert("Ad skipped");
    return;
  }

  timer.innerText = sec--;
  if (sec < 0) {
    clearInterval(t);

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      balance: increment(cfg.data().rewardPerAd),
      totalAdsWatched: increment(1)
    });

    await addDoc(collection(db, "adHistory"), {
      uid: auth.currentUser.uid,
      time: serverTimestamp()
    });

    alert("✅ Reward Added");
  }
}, 1000);

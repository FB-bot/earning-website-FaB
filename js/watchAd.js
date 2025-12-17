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

// ❌ tab change হলে cancel
document.addEventListener("visibilitychange", () => {
  if (document.hidden) active = false;
});

// 🔥 WAIT FOR AUTH FIRST
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    alert("Please login first");
    location.href = "index.html";
    return;
  }

  await loadAdAndStart(user);
});

async function loadAdAndStart(user) {
  // ✅ adsConfig read
  const cfgSnap = await getDoc(doc(db, "adsConfig", "main"));
  if (!cfgSnap.exists()) {
    alert("Ads config missing");
    return;
  }

  const cfg = cfgSnap.data();

  if (!cfg.adsEnabled) {
    alert("Ads disabled");
    return;
  }

  document.getElementById("adBox").innerHTML = cfg.monetagScript;

  const t = setInterval(async () => {
    if (!active) {
      clearInterval(t);
      alert("Ad skipped");
      return;
    }

    document.getElementById("timer").innerText = sec--;
    if (sec < 0) {
      clearInterval(t);

      // ✅ update user balance
      await updateDoc(doc(db, "users", user.uid), {
        balance: increment(cfg.rewardPerAd),
        totalAdsWatched: increment(1)
      });

      await addDoc(collection(db, "adHistory"), {
        uid: user.uid,
        time: serverTimestamp()
      });

      alert("✅ Reward Added");
    }
  }, 1000);
}

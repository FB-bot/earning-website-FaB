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

async function loadAdAndStart() {
  // 🔥 Firestore থেকে Monetag code আনছি
  const cfgSnap = await getDoc(doc(db, "adsConfig", "main"));

  if (!cfgSnap.exists()) {
    alert("Ads config পাওয়া যায়নি");
    return;
  }

  const cfg = cfgSnap.data();

  if (!cfg.adsEnabled) {
    alert("Ads বন্ধ আছে");
    return;
  }

  // 👉 এখানেই Monetag ad বসে
  document.getElementById("adBox").innerHTML = cfg.monetagScript;

  // ⏱ Timer
  const t = setInterval(async () => {
    if (!active) {
      clearInterval(t);
      alert("Ad skip করা হয়েছে");
      return;
    }

    document.getElementById("timer").innerText = sec--;
    if (sec < 0) {
      clearInterval(t);

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        balance: increment(cfg.rewardPerAd),
        totalAdsWatched: increment(1)
      });

      await addDoc(collection(db, "adHistory"), {
        uid: auth.currentUser.uid,
        time: serverTimestamp()
      });

      alert("✅ Reward যোগ হয়েছে");
    }
  }, 1000);
}

loadAdAndStart();

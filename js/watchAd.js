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
let started = false;

document.addEventListener("visibilitychange", () => {
  if (document.hidden) active = false;
});

const btn = document.getElementById("showAdBtn");

btn.onclick = async () => {
  if (started) return;
  started = true;

  const cfgSnap = await getDoc(doc(db, "adsConfig", "main"));
  const cfg = cfgSnap.data();

  // 🔥 Dynamically create script
  const s = document.createElement("script");
  s.src = cfg.monetagScript
    .replace('<script src="', '')
    .replace('"></script>', '');

  document.body.appendChild(s);

  // ⏱ Start timer AFTER click
  startTimer(cfg.rewardPerAd);
};

function startTimer(reward) {
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
        balance: increment(reward),
        totalAdsWatched: increment(1)
      });

      await addDoc(collection(db, "adHistory"), {
        uid: auth.currentUser.uid,
        time: serverTimestamp()
      });

      alert("✅ Reward added");
    }
  }, 1000);
}

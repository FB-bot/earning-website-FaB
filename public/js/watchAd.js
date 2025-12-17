import { auth, db } from "./firebase.js";
import { doc, updateDoc, increment } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let t=15;
const i=setInterval(async()=>{
  timer.innerText=--t;
  if(t<=0){
    clearInterval(i);
    await updateDoc(doc(db,"users",auth.currentUser.uid),{
      balance:increment(0.02),
      totalAdsWatched:increment(1)
    });
    alert("Reward Added");
  }
},1000);

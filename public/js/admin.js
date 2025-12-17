import { auth, db } from "./firebase.js";
import { getDocs, collection, updateDoc, doc, increment } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const snap = await getDocs(collection(db,"withdrawRequests"));
snap.forEach(d=>{
  const w=d.data();
  withdrawList.innerHTML+=`
    <p>${w.uid} - ${w.amount}
    <button onclick="approve('${d.id}','${w.uid}',${w.amount})">Approve</button></p>`;
});

window.approve=async(id,uid,amt)=>{
  await updateDoc(doc(db,"withdrawRequests",id),{status:"Approved"});
  await updateDoc(doc(db,"users",uid),{balance:increment(-amt)});
};

import { auth, db } from "./firebase.js";
import { addDoc, collection } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.withdraw = async ()=>{
  await addDoc(collection(db,"withdrawRequests"),{
    uid:auth.currentUser.uid,
    amount:amount.value,
    method:method.value,
    number:number.value,
    status:"Pending"
  });
  alert("Request Sent");
};

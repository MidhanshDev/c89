import firebase from "firebase";
require("@firebase/firestore");
var firebaseConfig = {
  apiKey: "AIzaSyD6DNZLmNK3HOSq1LZYXHAROHe65IMpk5I",
  authDomain: "book-santa-acea0.firebaseapp.com",
  projectId: "book-santa-acea0",
  storageBucket: "book-santa-acea0.appspot.com",
  messagingSenderId: "590715521211",
  appId: "1:590715521211:web:196ae05ed25ac63e88c19e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase.firestore();

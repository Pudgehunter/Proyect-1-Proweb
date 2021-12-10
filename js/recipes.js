// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();


//Recibir datos
const getUserInfo = async (userId) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch (e) {
        console.log(e);
    }
}

const loginButton = document.getElementById("loginButton");
const username = document.getElementById("username");
const logOutButton = document.getElementById("logOut");

logOutButton.addEventListener("click", e => {
    logOut();
});

const logOut = async () => {
    try {
        await signOut(auth);
    } catch (e) {
        console.log(e);
    }
}

const admin = document.getElementById("admin");

onAuthStateChanged(auth, async (user) => {
    if(user){
        loginButton.classList.add("hidden");
        const userInfo = await getUserInfo(user.uid);
        username.innerHTML = userInfo.name;
        if(userInfo.isAdmin == true){
            admin.classList.add("visible");
        } else if(userInfo.isAdmin == false){
                admin.classList.remove("visible");
        }
        
        username.classList.remove("hidden");  
        username.classList.add("visible");
        logOutButton.classList.add("visible");
    } else {
        admin.classList.remove("visible");
        logOutButton.classList.remove("visible");
        loginButton.classList.remove("hidden");
        username.classList.add("hidden");
        username.classList.remove("visible");
    }
});
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD2gLD-eFCLZxeW2BQYWpd_haUwW8B1LwA",
    authDomain: "proweb-1.firebaseapp.com",
    projectId: "proweb-1",
    storageBucket: "proweb-1.appspot.com",
    messagingSenderId: "608825969113",
    appId: "1:608825969113:web:28149248158158f2a5f1c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

//Firebase createuser
const createUser = async (email, password, userFields) => {
    try{
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const userId = user.uid;

        await setDoc(doc(db, "users", userId), userFields);

        alert("Enhorabuena te registraste "+ email);
    }catch{
        alert("correo ya existe");
    }
}

const registerBtn = document.getElementById("register");

registerBtn.addEventListener("submit", e => {
    e.preventDefault();
    const name = registerBtn.name.value;
    const email = registerBtn.email.value;
    const password = registerBtn.password.value;
    const city = registerBtn.city.value;
    const address = registerBtn.address.value;


    if(email && password){
        createUser(email,password, {
            name,
            city,
            address,
            isAdmin: false,
        });
    } else {
        alert("completa todos los campos");
    }
    //window.location.href="./login.html";
    
}
)






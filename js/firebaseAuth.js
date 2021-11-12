// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";


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
const auth = getAuth();

//Firebase createuser
const createUser = async (email, password) => {
    try{
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Enhorabuena te registraste "+ email);
    }catch{
        alert("correo ya existe");
    }
}

const registerBtn = document.getElementById("register");

registerBtn.addEventListener("submit", e => {
    e.preventDefault();
    const email = registerBtn.email.value;
    const password = registerBtn.password.value;

    if(email && password){
        createUser(email,password);
    }
    console.log("registerBtn");
}
)

//Firebase Ingresar
const logIn = async (email, password) => {
    try{
        await signInWithEmailAndPassword(auth, email, password);
        alert("Pues supuestamente ingresaste we");
    }catch(e){
        console.log(e);
        if(e.code === "auth/wrong-password"){
            alert("La contraseña no coinciden");
        } else if(e.code === "auth/user-not-found"){
            alert("El usuario no existe");
        }
    }
}

const logOut = async () => {
    try{
        await signOut(auth);
    }catch(e){
        console.log(e);
    }
}

const ingresarBtn = document.getElementById("logIn");

ingresarBtn.addEventListener("submit", e => {
    e.preventDefault();
    const email = ingresarBtn.email.value;
    const password = ingresarBtn.password.value;

    if(email && password){
        logIn(email,password);
    }
    console.log("aaa");
}
);

const logOutButton = document.getElementById("logOut");

logOutButton.addEventListener("click", e => {
    logOut();
    console.log("Cerro sesión el usuario");
});

onAuthStateChanged(auth, (user) => {
    if(user){
        ingresarBtn.classList.add("hidden");
        logOutButton.classList.remove("hidden");
        logOutButton.classList.add("visible");
    } else {
        ingresarBtn.classList.remove("hidden");
        logOutButton.classList.add("hidden");
        logOutButton.classList.remove("visible");
    }
});
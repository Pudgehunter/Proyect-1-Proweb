// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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


//Firebase Ingresar
const logIn = async (email, password) => {
    try{
        const {user} = await signInWithEmailAndPassword(auth, email, password);
        const userInfo = await getUserInfo(user.uid);

        console.log(`Bienvenido ${userInfo.name}`);

        alert("Pues supuestamente ingresaste we");

        window.location ="./index.html";
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
    } else {
        alert("completa todos los campos");
    }
}
);

const logOutButton = document.getElementById("logOut");

logOutButton.addEventListener("click", e => {
    logOut();
    console.log("Cerro sesión el usuario");
});

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
        loginButton.classList.remove("hidden");
        logOutButton.classList.remove("visible");
        username.classList.add("hidden");
        username.classList.remove("visible");
    }
});


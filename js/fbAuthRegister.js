// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

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

//Firebase createuser
const createUser = async (email, password, userFields) => {
    try{
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const userId = user.uid;

        await setDoc(doc(db, "users", userId), userFields);

        alert("Enhorabuena te registraste "+ email);

        window.location ="./login.html";

    }catch{
        alert("correo ya existe");
    }
}

const registerBtn = document.getElementById("register");

registerBtn.addEventListener("submit", e => {
    e.preventDefault();
    console.log("asdfasdfdsf");
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
    
}
)

const loginButton = document.getElementById("loginButton");
const username = document.getElementById("username");

onAuthStateChanged(auth, async (user) => {
    if(user){
        loginButton.classList.add("hidden");
        const userInfo = await getUserInfo(user.uid);
        username.innerHTML = userInfo.name;
        username.classList.remove("hidden");  
        username.classList.add("visible");
    } else {
        loginButton.classList.remove("hidden");
        username.classList.add("hidden");
        username.classList.remove("visible");
    }
});




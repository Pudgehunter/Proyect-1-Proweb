// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
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


const menu = document.getElementById("menu");

const buttonMenu = document.getElementById("openMenu");
const menulist = document.getElementById("menulist");
const close = document.getElementById("close");

buttonMenu.addEventListener("click", e => {
    menulist.classList.add("menu__list--mobile");
})

close.addEventListener("click", e => {
    menulist.classList.remove("menu__list--mobile");
})

var swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});


const logOutButton = document.getElementById("logOut");
const admin = document.getElementById("admin");

logOutButton.addEventListener("click", e => {
    logOut();
});

const logOut = async () => {
    try {
        await signOut(auth);
        window.location = "./login.html";
    } catch (e) {
        console.log(e);
    }
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        loginButton.classList.add("hidden");
        const userInfo = await getUserInfo(user.uid);
        username.innerHTML = userInfo.name;
        if (userInfo.isAdmin == true) {
            admin.classList.add("visible");
        } else if (userInfo.isAdmin == false) {
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

// window.onscroll = function (e) {
//     const posY = document.documentElement.scrollTop;
//     if (posY >= 150) {
//         menu.classList.add('menu--scroll');
//     } else {
//         menu.classList.remove('menu--scroll');
//     }
// }




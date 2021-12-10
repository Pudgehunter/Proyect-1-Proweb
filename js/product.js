import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getFirestore, getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

let userLogged = null;
let cart = [];
let getProductAll;
let productIdAll;

//Función para agregar carrito
const addProductsCart = async (products) => {
    await setDoc(doc(db, "cart", userLogged.uid), {
        products
    });
};

//Recibir datos del usuario
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

//Recibir los datos del carrito
const getFirebaseCart = async (userId) => {
    const docRef = doc(db, "cart", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {
        products: []
    }
};

//Lectura de Firebase
const getProduct = async () => {
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
    const productId = searchParams.get("id");
    productIdAll = productId;

    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    productSection.classList.add("loaded");
    spinner.classList.add("loaded");

    // disabled que no me funciono sadmente
    const isAdded = cart.some(productCart => productCart.id === productId);
    
    if (isAdded) {
        productCartButton.classList = "disabled";
    }

    loadProductInfo(data);
    getProductAll = data;

    
}



//const product = products.find(product => product.id == productId);
const productSection = document.getElementById("product");
const spinner = document.getElementById("spinner");
const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productDescription = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");
const productGallery = document.getElementById("gallery");
const productCartButton = product.querySelector(".product__cart");



const loadProductInfo = (product) => {
    productName.innerText = product.name;
    productDescription.innerText = product.description;
    productPrice.innerText = `$  ${product.price}`;

    productImage.setAttribute("src", product.image);

    if (product.images) {
        createGallery(product.images);
    }
}


const createGallery = (images) => {

    const gallery = document.createElement("div");

    gallery.innerHTML = `<img src="${product.image}">`;

    images.forEach(image => {
        gallery.innerHTML += `<img src="${image}">`
    });

    productGallery.appendChild(gallery);

    const productGalleryImages = document.querySelector(".product__image > #gallery > div");

    productGalleryImages.addEventListener("click", e => {
        if (e.target.tagName === "IMG") {
            const imageSource = e.target.currentSrc;
            productImage.setAttribute("src", imageSource);
        }
    })
}

// Cuando haga click en el botón del carrito:
productCartButton.addEventListener("click", async e => {

    // Evita un comportamiento por defecto
    // Dirigirme a otra página (enlace - a) && Refrescar la página (form)
    e.preventDefault();

    // const url = window.location.search;
    // const searchParams = new URLSearchParams(url);
    // const productId = searchParams.get("id");

    // const docRef = doc(db, "products", productId);
    // const docSnap = await getDoc(docRef);
    // const data = docSnap.data();

    //console.log(productIdAll);

    const productAdded = {
        //...getProduct()
        id: productIdAll,
        name: getProductAll.name,
        image: getProductAll.image,
        price: getProductAll.price
    };

    cart.push(productAdded);

    if (userLogged) {
        addProductsCart(cart);
    }

    // Deshabilito el botón
    productCartButton.setAttribute("disabled", true);
    productCartButton.innerHTML = "Producto añadido";
});



getProduct();


const logOutButton = document.getElementById("logOut");

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

const admin = document.getElementById("admin");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        //Los datos del firebase carrito
        const result = await getFirebaseCart(user.uid);
        if (cart != null) {
            cart = result.products;
        } else {
            //cart.getMyCart();
        }

        userLogged = user;

        loginButton.classList.add("hidden");
        //Los datos del firebase del usuario
        const userInfo = await getUserInfo(user.uid);
        username.innerHTML = userInfo.name;
        if (userInfo.isAdmin == true) {
            admin.classList.add("visible");
        } else if (userInfo.isAdmin == false) {
            admin.classList.remove("visible");
        }
        logOutButton.classList.add("visible");
        username.classList.remove("hidden");
        username.classList.add("visible");
    } else {
        cart = [];
        admin.classList.remove("visible");
        loginButton.classList.remove("hidden");
        logOutButton.classList.remove("visible");
        username.classList.add("hidden");
        username.classList.remove("visible");
    }
});

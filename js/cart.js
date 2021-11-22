import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, collection, deleteDoc, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

//Recibir los datos del HTML
const cartSection = document.getElementById("cart");
const totalSection = document.getElementById("total");
const checkoutForm = document.getElementById("checkout");
const autocompleteFields = document.getElementById("autofill");

let total = 0;
let cart = [];
let userLogged = {};

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

const getMyCart = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
};

//Remove Cart datas
const removeProduct = async (productId) => {

    const cityRef = doc(db, 'cart', userLogged.uid);

    console.log(cityRef);

    console.log(cityRef.id);

    console.log(cityRef.path);

    //Buscar una manera que encuentre el order osea, literalmente que me quede products/0: deleteField() para poder borrar estas vainas porque no me funcionan, además, me borran todo literalmente.

    // await updateDoc(cityRef, {
    //     products: deleteField()
    // });

    renderMyCart(cart);

};

//Recibir los datos del carrito
const getFirebaseCart = async (userId) => {
    const docRef = doc(db, "cart", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {
        products: []
    }
};

const renderProduct = (product) => {

    const newProduct = document.createElement("li");
    newProduct.className = "product product--cart";
    newProduct.innerHTML = `
        <img src="${product.image}" alt="" class="product__thumbnail">
        <div class="product__info">
            <h2 class="product__name">${product.name}</h2>
            <p class="product__price">${formatCurrency(parseInt(product.price))}</p>
            <button class="product__cart-cart product__cart--thumb">Remove</button>
        </div>
    `;

    cartSection.appendChild(newProduct);

    newProduct.addEventListener("click", e => {
        if (e.target.tagName === "BUTTON") {
            removeProduct(product.id);
            console.log(product.id);
        }
    });

};

//Spinner
const spinner = document.getElementById("spinner");


const renderMyCart = (cart) => {
    total = 0;
    cartSection.innerHTML = "";

    cartSection.classList.add("loaded");
    spinner.classList.add("loaded");

    cart.forEach(product => {
        total += parseInt(product.price);
        renderProduct(product);
    });

    totalSection.innerText = `Total: ${formatCurrency(total)}`;
};


//Remove
const deleteCart = async () => {
    try {
        console.log(userLogged.uid);
        await deleteDoc(doc(db, "cart", userLogged.uid));
        renderMyCart([]);
        console.log("Carrito de compras actualizado...");
    } catch (e) {
        console.log(e);
    }
};


const createOrder = async (userFields) => {
    try {
        const order = await addDoc(collection(db, "orders"), {
            ...userFields, // spread 
            products: cart,
            total,
            email: userLogged.email,
            status: "pending",
        });
        alert(`Muchas gracias, tu pedido con ID: ${order.id} ha quedado registrado.`);

        deleteCart();
    } catch (e) {
        console.log(e)
    }
};

//Nuevo
autocompleteFields.addEventListener("click", e => {
    checkoutForm.name.value = userLogged.name;
    checkoutForm.address.value = userLogged.address;
    checkoutForm.city.value = userLogged.city;
});


//Nuevo
checkoutForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = checkoutForm.name.value;
    const address = checkoutForm.address.value;
    const city = checkoutForm.city.value;

    const userFields = {
        name,
        city,
        address
    };

    if (cart.length) {
        if (name && city && address) {
            createOrder(userFields);
        } else {
            alert("Completa todos los campos...");
        }
    } else {
        alert("Selecciona algunos productos...")
    }
});





window.onscroll = function (e) {
    const posY = document.documentElement.scrollTop;
    if (posY >= 150) {
        menu.classList.add('menu--scroll');
    } else {
        menu.classList.remove('menu--scroll');
    }
}

const logOutButton = document.getElementById("logOut");

logOutButton.addEventListener("click", e => {
    logOut();
    console.log("Cerro sesión el usuario");
});

const logOut = async () => {
    try {
        await signOut(auth);
        window.location ="./login.html";
    } catch (e) {
        console.log(e);
    }
}

const admin = document.getElementById("admin");

//Usuario
onAuthStateChanged(auth, async (user) => {
    if (user) {
        //Los datos del firebase carrito
        const result = await getFirebaseCart(user.uid);
        console.log(result);
        cart = result.products;
        //console.log(cart);
        renderMyCart(cart);

        const userInfo = await getUserInfo(user.uid);
        userLogged = {
            ...user,
            ...userInfo
        };
        //console.log(userInfo);

        loginButton.classList.add("hidden");
        //Los datos del firebase del usuario
        if(userInfo.isAdmin == true){
            admin.classList.add("visible");
        } else if(userInfo.isAdmin == false){
                admin.classList.remove("visible");
        }

        username.innerHTML = userInfo.name;
        logOutButton.classList.add("visible");
        username.classList.remove("hidden");
        username.classList.add("visible");

    } else {
        cart = getMyCart();
        admin.classList.remove("visible");
        logOutButton.classList.remove("visible");
        loginButton.classList.remove("hidden");
        username.classList.add("hidden");
        username.classList.remove("visible");
        renderMyCart(cart);
    }
});

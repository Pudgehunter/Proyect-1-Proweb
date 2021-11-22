import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getFirestore, doc, collection, getDoc, getDocs , setDoc} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

let products = [];
let userLogged = null;
let cart = [];

const logOutButton = document.getElementById("logOut");


window.onscroll = function (e) {
    const posY = document.documentElement.scrollTop;
    if (posY >= 150) {
      menu.classList.add('menu--scroll');
    } else {
      menu.classList.remove('menu--scroll');
    }
  }

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
  
const spinner = document.getElementById("spinner");

//Lectura de firebase
const getAllProducts = async () => {
    const collectionRef = collection(db, "products");
    const { docs } = await getDocs(collectionRef);

    productsSection.classList.add("loaded");
    spinner.classList.add("loaded");

    const products = docs.map((doc) => {
        return {
            ...doc.data(),
            id: doc.id,
        }
    });
    // Recorro cada uno de los 4 productos que tengo en mi arreglo
    products.forEach(product => {
        // Llamo la funcion productTemplate para cada product.
        productTemplate(product);
    });
    return products;
};


// Elementos que añadí a mi carrito

const getMyCart = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
};


const addProductsCart = async (products) => {
    await setDoc(doc(db,"cart",userLogged.uid),{
        products
    });
};


//const cart = getMyCart();
//const firebaseCart = getFirebaseCart();


// Añadir cada producto a un elemento contenedor
const productsSection = document.getElementById("products");

// Se ejecuta para cada producto
// item = product
const productTemplate = (item) => {

    // Creamos un elemento a, le agregamos la clase "product"
    const product = document.createElement("a");
    product.className = "product"; //La clase css .product

    // Seteamos el atributo href con una url dinámica, donde le pasamos el id del producto
    product.setAttribute("href", `./product.html?id=${item.id}`);

    // Lógica de nuestro tag, botón de Recomendado o Más vendido
    let tagHtml;
    if (item.isRecommended) {
        tagHtml = `<span class="product__tag product__tag--recommended">Recomendado</span>`;
    } else if (item.isBestSeller) {
        tagHtml = `<span class="product__tag product__tag--best-seller">Más vendido</span>`;
    } else {
        tagHtml = `<span class="product__tag">Normal</span>`;
    }

    // Lógica para saber si un producto ya fue añadido al carrito
    // para deshabilitar el botón.
    //console.log(cart);
    const isAdded = cart.some(productCart => productCart.id === item.id);
    let buttonHtml;

    if (isAdded) {
        buttonHtml = `<button class="product__cart" disabled>Producto añadido</button>`
    } else {
        buttonHtml = `<button class="product__cart">Añadir al carrito</button>`;
    }

    const thumbnail = 'https://user-images.githubusercontent.com/101482/29592647-40da86ca-875a-11e7-8bc3-941700b0a323.png';

    // Añadir el HTML a nuestro elemento product.
    product.innerHTML = `
    <div class="product__description">
        <h2 class="product__name">${item.name}</h2>
        ${tagHtml}
        <img src="${item.image !== '' ? item.image : thumbnail}" alt="${item.name}" class="product__image">
            <h3 class="product__price">$ ${item.price}</h3>
            ${buttonHtml}
    </div>
    `;

    // Agregar cada producto a nuestro contenedor
    productsSection.appendChild(product);


    // Busco el botón del carrito en el producto (.product__cart)
    const productCartButton = product.querySelector(".product__cart");

    // Cuando haga click en el botón del carrito:
    productCartButton.addEventListener("click", e => {

        // Evita un comportamiento por defecto
        // Dirigirme a otra página (enlace - a) && Refrescar la página (form)
        e.preventDefault();

        console.log(item.id);

        const productAdded = {
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price
        };

        cart.push(productAdded);

        if(userLogged){
            addProductsCart(cart);
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));

        // Deshabilito el botón
        productCartButton.innerHTML = "Producto añadido";
        productCartButton.setAttribute("disabled", true);
    });

};

const filterByCategory = document.getElementById("categories");
const orderBySelect = document.getElementById("orderBy");

const loadProducts = () => {
    const category = filterByCategory.value || "";
    const order = orderBySelect.value || "";

    //Borra los productos de antes
    productsSection.innerHTML = "";

    let filteredProductsByCategory;

    console.log(category);

    if (category !== "") {
        filteredProductsByCategory = products.filter((product) => product.type === category);
        console.log(products);
    } else {
        filteredProductsByCategory = products;
    }

    if (order === "asc"){
        filteredProductsByCategory = filteredProductsByCategory.sort((a, b) => a.price - b.price);
    }
    if (order === "desc"){
        filteredProductsByCategory = filteredProductsByCategory.sort((a, b) => b.price - a.price);
    }

    filteredProductsByCategory.forEach(product => {
        productTemplate(product);
    });
}

filterByCategory.addEventListener("change", e => {
    loadProducts();
});

orderBySelect.addEventListener("change", e => {
    loadProducts();
});


const getFilteredProduct = () => {
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
    //console.log(searchParams.get("type"));

    return searchParams.get("type") || null;
}

// Recorro cada uno de los productos que tengo en mi arreglo
if (getFilteredProduct()) {
    const filteredProductsByCategory = products.filter((product) => product.type === getFilteredProduct());
    filteredProductsByCategory.forEach(product => {
        // Llamo la funcion productTemplate para cada product.
        console.log(product);
        productTemplate(product);
    });
}

logOutButton.addEventListener("click", e => {
    logOut();
    console.log("Cerro sesión el usuario");
});

const logOut = async () => {
    try {
        await signOut(auth);
    } catch (e) {
        console.log(e);
    }
}


onAuthStateChanged(auth, async (user) => {
    if(user){
        //Los datos del firebase carrito
        const result = await getFirebaseCart(user.uid);
        if(cart != null){
            cart = result.products;
        }
        userLogged = user;
        loginButton.classList.add("hidden");
        //Los datos del firebase del usuario
        const userInfo = await getUserInfo(user.uid);
        username.innerHTML = userInfo.name;
        logOutButton.classList.add("visible");
        username.classList.remove("hidden");  
        username.classList.add("visible");
    } else {
        cart = getMyCart();
        loginButton.classList.remove("hidden");
        logOutButton.classList.remove("visible");
        username.classList.add("hidden");
        username.classList.remove("visible");
    }
    getAllProducts();
});


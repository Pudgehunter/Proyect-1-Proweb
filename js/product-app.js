import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getFirestore, doc, collection, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

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
  
//Lectura de firebase
const getAllProducts = async () => {
    const collectionRef = collection(db, "products");
    const { docs } = await getDocs(collectionRef);

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

let products = getAllProducts();

// Elementos que añadí a mi carrito
const cart = [];

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
        tagHtml = "";
    }

    // Lógica para saber si un producto ya fue añadido al carrito
    // para deshabilitar el botón.
    const isAdded = cart.some(productCart => productCart.id === item.id);
    let buttonHtml;

    if (isAdded) {
        buttonHtml = `<button class="product__cart" disabled>Producto añadido</button>`
    } else {
        buttonHtml = `<button class="product__cart">Añadir al carrito</button>`;
    }

    // Añadir el HTML a nuestro elemento product.
    product.innerHTML = `
    <div class="product__description">
        <h2 class="product__name">${item.name}</h2>
        <img src="${item.image}" alt="${item.name}" class="product__image">
            ${tagHtml}
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

        const productAdded = {
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price
        };

        cart.push(productAdded);

        // Deshabilito el botón
        productCartButton.setAttribute("disabled", true);
    });

};



const filterByCategory = document.getElementById("categories");
const orderBySelect = document.getElementById("orderBy");

const loadProducts = () => {

    const category = filterByCategory.value || "";
    const order = orderBySelect.value || "";

    productsSection.innerHTML = "";

    let filteredProductByCategory;

    if (category !== "") {
        filteredProductByCategory = products.filter((product) => product.type === category);
    } else {
        filteredProductByCategory = products;
    }

    if (order === "asc") {
        filteredProductByCategory = filteredProductByCategory.sort((a, b) => a.price - b.price);
    }

    if (order === "desc") {
        filteredProductByCategory = filteredProductByCategory.sort((a, b) => b.price - a.price);
    }

    filteredProductByCategory.forEach(product => {
        productTemplate(product);
    });

}

orderBySelect.addEventListener("change", e => {
    loadProducts();
});

filterByCategory.addEventListener("change", e => {
    loadProducts();
});

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


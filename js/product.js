import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//Lectura de Firebase
const getProduct = async () => {
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
    const productId = searchParams.get("id");

    const docRef = doc(db, "products" , productId );
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    productSection.classList.add("loaded");
    spinner.classList.add("loaded");

    loadProductInfo(data);
}


const url = window.location.search;
const searchParams = new URLSearchParams(url);

const productId = searchParams.get("id");

//const product = products.find(product => product.id == productId);
const productSection = document.getElementById("product");
const spinner = document.getElementById("spinner");
const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productDescription = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");
const productGallery = document.getElementById("gallery");

const loadProductInfo = (product) => {
    productName.innerText = product.name;
    productDescription.innerText = product.description;
    productPrice.innerText = `$  ${product.price}`;
    
    productImage.setAttribute("src", product.image);

    if(product.images){
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
        if(e.target.tagName === "IMG"){
            const imageSource = e.target.currentSrc;
            productImage.setAttribute("src", imageSource);
        }
    })
}


getProduct();
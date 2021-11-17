const url = window.location.search;
const searchParams = new URLSearchParams(url);

const productId = searchParams.get("id");

const product = products.find(product => product.id == productId);

const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productDescription = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");
const productGallery = document.getElementById("gallery");

productName.innerText = product.name;
productDescription.innerText = product.description;
productPrice.innerText = `$  ${product.price}`;

productImage.setAttribute("src", product.image);

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
createGallery(product.images);
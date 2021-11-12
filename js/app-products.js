//Aquí llamo la vaina de la interacción de products. Ojala funcione para no crear tantos js.
// Elementos a mostrar en mi HTML (DOM)
const products = [
    {
        id: 1,
        name: "Berenjenas",
        price: "2400",
        image: "./img/gallery/eggplant.png",
        isRecommended: true,
        isBestSeller: false,
        description: "Berenjenas saludables, ricas y sabrosas. Sacadas de la granja Magokoro con muchos atributos positivos para que tengas el mejor producto en tus manos",
        type: "vegetables",
    },
    {
        id: 2,
        name: "Pepino",
        price: "3200",
        image: "https://http2.mlstatic.com/D_NQ_NP_810041-MLA47739386563_102021-W.webp",
        isRecommended: false,
        isBestSeller: true,
        description: "Pepinos japoneses, son muy saludables, pequeños y sabrosos, son muy buenos para comer ensaladas o solas",
        type: "vegetables",
    },
    {
        id: 3,
        name: "Okra",
        price: "5400",
        image: "https://http2.mlstatic.com/D_NQ_NP_682739-MLA47727283112_102021-W.webp",
        isBestSeller: false,
        isRecommended: true,
        description: "Okra es una verdura africana, que se produce también en japón por lo rico y saludable que es, hay muchas formas de prepararlo y lo mejor es cuando se combina con arroz",
        type: "vegetables",
    },
    {
        id: 4,
        name: "Limones",
        price: "4200",
        image: "https://http2.mlstatic.com/D_NQ_NP_835108-MLA45733317338_042021-W.webp",
        isBestSeller: true,
        isRecommended: false,
        description: "Limones bien jugosos, no tiene tanto semillas y muy dulces. Son muy buenos para hacer limonadas ya que sacan mucho jugo. También para las personas que le gustan el acidez solo, se pueden tomarselo sin nada ya que son muy jugosos",
        type: "fruit",
    },
    {
        id: 5,
        name: "Chinese Cabbage",
        price: "6500",
        image: "https://http2.mlstatic.com/D_NQ_NP_835108-MLA45733317338_042021-W.webp",
        isBestSeller: true,
        isRecommended: false,
        description: "La Lechuga de china, la más clasica para la comida japonesa, se puede usarse en la mayoria de comida que existe en la comida asiatica.",
        type: "vegetables",
    },
    {
        id: 6,
        name: "Japanese Radish",
        price: "5500",
        image: "https://http2.mlstatic.com/D_NQ_NP_835108-MLA45733317338_042021-W.webp",
        isBestSeller: false,
        isRecommended: true,
        description: "Kabu, un tubérculo muy común en japón, es saludable, salado y muy bueno para el acompañamiento con el arroz.",
        type: "tuber",
    }
];


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

// Recorro cada uno de los 4 productos que tengo en mi arreglo
products.forEach(product => {
    // Llamo la funcion productTemplate para cada product.
    productTemplate(product);
});

const filterByCategory = document.getElementById("categories");
const orderBySelect = document.getElementById("orderBy");

const loadProducts = () => {

    const category = filterByCategory.value || "";   
    const order = orderBySelect.value || "";

    productsSection.innerHTML ="";

    let filteredProductByCategory;
    
    if(category !== ""){
        filteredProductByCategory = products.filter((product) => product.type === category);
    }else{
        filteredProductByCategory = products;
    }

    if(order === "asc"){
        filteredProductByCategory = filteredProductByCategory.sort((a, b) => a.price - b.price);
    }

    if(order === "desc"){
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


products.forEach(product => {
    productTemplate(product);
});
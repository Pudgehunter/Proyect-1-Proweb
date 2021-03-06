import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// const products = [
//     {
//         id: 1,
//         name: "Berenjenas",
//         price: "2400",
//         image: ["./img/gallery/eggplant.png",
//             "https://http2.mlstatic.com/D_NQ_NP_810041-MLA47739386563_102021-W.webp",
//             "https://http2.mlstatic.com/D_NQ_NP_810041-MLA47739386563_102021-W.webp"],
//         isRecommended: true,
//         isBestSeller: false,
//         description: "Berenjenas saludables, ricas y sabrosas. Sacadas de la granja Magokoro con muchos atributos positivos para que tengas el mejor producto en tus manos",
//         type: "vegetables",
//     },
//     {
//         id: 2,
//         name: "Pepino",
//         price: "3200",
//         image: "https://http2.mlstatic.com/D_NQ_NP_810041-MLA47739386563_102021-W.webp",
//         isRecommended: false,
//         isBestSeller: true,
//         description: "Pepinos japoneses, son muy saludables, pequeños y sabrosos, son muy buenos para comer ensaladas o solas",
//         type: "vegetables",
//     },
//     {
//         id: 3,
//         name: "Okra",
//         price: "5400",
//         image: "https://http2.mlstatic.com/D_NQ_NP_682739-MLA47727283112_102021-W.webp",
//         isBestSeller: false,
//         isRecommended: true,
//         description: "Okra es una verdura africana, que se produce también en japón por lo rico y saludable que es, hay muchas formas de prepararlo y lo mejor es cuando se combina con arroz",
//         type: "vegetables",
//     },
//     {
//         id: 4,
//         name: "Limones",
//         price: "4200",
//         image: "https://http2.mlstatic.com/D_NQ_NP_835108-MLA45733317338_042021-W.webp",
//         isBestSeller: true,
//         isRecommended: false,
//         description: "Limones bien jugosos, no tiene tanto semillas y muy dulces. Son muy buenos para hacer limonadas ya que sacan mucho jugo. También para las personas que le gustan el acidez solo, se pueden tomarselo sin nada ya que son muy jugosos",
//         type: "fruit",
//     },
//     {
//         id: 5,
//         name: "Chinese Cabbage",
//         price: "6500",
//         image: "./img/gallery/eggplant.png",
//         isBestSeller: true,
//         isRecommended: false,
//         description: "La Lechuga de china, la más clasica para la comida japonesa, se puede usarse en la mayoria de comida que existe en la comida asiatica.",
//         type: "vegetables",
//         images: [
//             "./img/gallery/eggplant.png",
//             "https://www.selwo.es/sites/selwo.es/files/uploads/styles/adaptive/public/swa_panda_rojo_5.jpg?itok=5T-DRj4m",
//             "./img/gallery/eggplant.png",
//         ]
//     },
//     {
//         id: 6,
//         name: "Japanese Radish",
//         price: "5500",
//         image: "https://http2.mlstatic.com/D_NQ_NP_835108-MLA45733317338_042021-W.webp",
//         isBestSeller: false,
//         isRecommended: true,
//         description: "Kabu, un tubérculo muy común en japón, es saludable, salado y muy bueno para el acompañamiento con el arroz.",
//         type: "tuber",
//     }
// ];

products.forEach(async (product) => {
    await setDoc(doc(db, "products", `344324dfr${product.id}`), product);
});
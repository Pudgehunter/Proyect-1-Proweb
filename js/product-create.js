import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-storage.js";
import { getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const createProductForm = document.getElementById("createProduct");

//Upload Images URL
const uploadMainImage = async (file) => {
    try {
        const storageRef = ref(storage, `products/images/${file.name}`);
        const image = await uploadBytes(storageRef, file);
        console.log(image);
        return await getDownloadURL(ref(storage, image.ref.fullPath));
    } catch (e) {
        console.log(e);
    }
};

const createProduct = async () => {
    const name = createProductForm.name.value;
    const price = createProductForm.price.value;
    const description = createProductForm.description.value;
    const type = createProductForm.type.value;
    const mainImage = createProductForm.image.files[0];

    const urlMainImage = await uploadMainImage(mainImage);

    if(name && price && description && type){
        await addDoc(collection(db, "products"), {
            name,
            price,
            description,
            type,
            isRecommended: false,
            isBestSeller: false,
            image: urlMainImage,
            images: [],
        });
    } else {
        console.log("completa todos los datos...")
    }
}

createProductForm.addEventListener("submit", e => {
    e.preventDefault();
    createProduct();
});


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-storage.js";
import { getFirestore, doc, getDoc, collection, addDoc} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

const createProductForm = document.getElementById("createProduct");
const feedback = document.getElementById("feedback");

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


const imageUploadedReference = async (file) => {
    const storageRef = ref(storage, `products/images/${file.name}`);
    return await uploadBytes(storageRef, file);
};



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

const uploadGallery = async (files) => {

    const images = files.map(async (file) => {
        const image = await imageUploadedReference(file);
        return getDownloadURL(ref(storage, image.ref.fullPath));
    });

    return images;

}

const createProduct = async () => {
    const name = createProductForm.name.value;
    const price = createProductForm.price.value;
    const description = createProductForm.description.value;
    const type = createProductForm.type.value;
    const mainImage = createProductForm.image.files[0];
    const gallery = createProductForm.image.files;

    if(name && price && description && type && mainImage){
        
        feedback.innerText = "Subiendo el producto...";

        try {

            const urlMainImage = await uploadMainImage(mainImage);
            let galleryImages = [];

            if (gallery.length) {
                const galleryUrls = await uploadGallery([...gallery]);
                galleryImages = await Promise.all(galleryUrls);
            }        

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
            feedback.innerText = "¡Producto añadido correctamente!";
        } catch (e) {
            feedback.innerText = "Ups, algo salio mal...";
        }
    } else {
        console.log("completa todos los datos...")
    }
}

createProductForm.addEventListener("submit", e => {
    e.preventDefault();
    createProduct();
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




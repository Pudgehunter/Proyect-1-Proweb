// Find the latest version by visiting https://cdn.skypack.dev/three.     
import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';

import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js';

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();


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

const loginButton = document.getElementById("loginButton");
const username = document.getElementById("username");
const logOutButton = document.getElementById("logOut");

logOutButton.addEventListener("click", e => {
    logOut();
});

const logOut = async () => {
    try {
        await signOut(auth);
    } catch (e) {
        console.log(e);
    }
}

const admin = document.getElementById("admin");

onAuthStateChanged(auth, async (user) => {
    if(user){
        loginButton.classList.add("hidden");
        const userInfo = await getUserInfo(user.uid);
        username.innerHTML = userInfo.name;
        if(userInfo.isAdmin == true){
            admin.classList.add("visible");
        } else if(userInfo.isAdmin == false){
                admin.classList.remove("visible");
        }
        
        username.classList.remove("hidden");  
        username.classList.add("visible");
        logOutButton.classList.add("visible");
    } else {
        admin.classList.remove("visible");
        logOutButton.classList.remove("visible");
        loginButton.classList.remove("hidden");
        username.classList.add("hidden");
        username.classList.remove("visible");
    }
});
      
// Our Javascript will go here.
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xbfe3dd );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
//camera.position.set = (0.025,0.025,0.025);
camera.position.x = 0;
camera.position.y = 3;
camera.position.z = 6;
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

renderer.gammaOuyput = true;
document.body.appendChild( renderer.domElement );

//const light = new THREE.DirectionalLight(0xffffff, 1);
//light.position.set(2,2,5);
//scene.add(light);

const loader = new GLTFLoader();

const controls = new OrbitControls( camera, renderer.domElement );
			controls.target.set( 0, 0.5, 0 );
			controls.update();
			controls.enablePan = false;
			controls.enableDamping = true;

let rice;

loader.load( 'models/cupcake/cupcake.gltf', function (gltf) {

    //console.log(gltf);
    rice = gltf.scene;
	//rice.scale.set(0.7, 0.7, 0.7);
	scene.add( rice );

}, undefined, function ( error ) {

	console.error( error );

} );

function animate(){
    requestAnimationFrame(animate);

	rice.rotation.x += 0.001;
    rice.rotation.z += 0.001;
	rice.rotation.y += 0.001;

	// rice.rotation.x += 1;
    // rice.rotation.z += 1;
	// rice.rotation.y += 1;
    controls.update();

    renderer.render(scene, camera);
}

animate();
// Find the latest version by visiting https://cdn.skypack.dev/three.     
import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';

import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js';
      
// Our Javascript will go here.
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xbfe3dd );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000  );

//camera.position.set = (0.025,0.025,0.025);
camera.position.x = 2;
camera.position.y = 4;
camera.position.z = 5;
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

loader.load( 'models/fryingpan/scene.gltf', function (gltf) {

    //console.log(gltf);
    rice = gltf.scene;
	rice.scale.set(0.03, 0.03, 0.03);

	scene.add( rice );

}, undefined, function ( error ) {

	console.error( error );

} );

function animate(){
    requestAnimationFrame(animate);

    rice.rotation.x += 0.01;
	rice.rotation.y += 0.01;
	rice.rotation.z += 0.01;
    controls.update();

    renderer.render(scene, camera);
}

animate();
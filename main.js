import './style.css'

import * as THREE from 'three';
import { render } from 'react-dom';
import { AmbientLight } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';



// 1. SCENE 2. CAMERA 3. RENDERER

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),

});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(110);
camera.position.setY(18);


// SUN
const sunGeo = new THREE.SphereGeometry(55,64,32);
const sunMap = new THREE.TextureLoader().load('sun.png',);
const sunMaterial = new THREE.MeshStandardMaterial({map:sunMap});
const sun = new THREE.Mesh(sunGeo, sunMaterial);
scene.add(sun);

// FLOOR
const floorGeo = new THREE.PlaneGeometry(200,200,1,1);
const floorMaterial = new THREE.MeshStandardMaterial({color:0x000000, side: THREE.DoubleSide});
const floor = new THREE.Mesh(floorGeo, floorMaterial);
scene.add(floor);


const controls = new OrbitControls(camera, renderer.domElement);


// LIGHT AND WIREFRAME
const ambientLight = new THREE.AmbientLight(0xffffff);
const gridHelper = new THREE.GridHelper(200, 50, 0xb169fa, 0xb169fa);
scene.add(ambientLight, gridHelper);

// BACKGROUND
const spaceTexture = new THREE.TextureLoader().load('./gradient.png');
scene.background = spaceTexture;

// MOUNTAINS
function addMountains(){
  const mountainGeo = new THREE.ConeGeometry(THREE.MathUtils.randFloat(15,30),THREE.MathUtils.randFloat(25, 80), 5);
  const mountainMap = new THREE.TextureLoader().load('wireframe.png',);
  const mountainTexture = new THREE.MeshStandardMaterial({map:mountainMap,});
  const mountain = new THREE.Mesh(mountainGeo, mountainTexture);
  const z = THREE.MathUtils.randFloatSpread(200);
  mountain.position.set(THREE.MathUtils.randFloat(40, 100), 10, z);
  const mountainLeft = new THREE.Mesh(mountainGeo, mountainTexture);
  mountainLeft.position.set(THREE.MathUtils.randFloat(-100,-40), 10, z);
  scene.add(mountainLeft);
  scene.add(mountain);
}

Array(30).fill().forEach(addMountains);

// BADTV SHADER




// EFFECTS
const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

const glitchPass = new GlitchPass();
composer.addPass( glitchPass );

// composer = new THREE.EffectComposer( renderer);
// renderPass = new THREE.RenderPass( scene, camera );
// badTVPass = new THREE.ShaderPass( THREE.BadTVShader );
// composer.addPass( renderPass );
// composer.addPass( badTVPass );
// badTVPass.renderToScreen = true;






// ANIMATE
function animate() {
  requestAnimationFrame( animate );

  sun.rotation.y = 0.01;
  sun.position.z = -160;
  sun.position.y = 14;
  floor.rotation.x = 1.57079633;

  controls.update();
  composer.render();

}

animate()

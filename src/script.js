import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/simpleShadow.jpg");
bakedShadow.colorSpace = THREE.SRGBColorSpace;
const basektball = textureLoader.load("/textures/basketball.png");
basektball.colorSpace = THREE.SRGBColorSpace;
const basektballCourt = textureLoader.load("/textures/basketballcourt.jpg");
basektballCourt.colorSpace = THREE.SRGBColorSpace;
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

/**
 * Materials
 */
const basketMaterial = new THREE.MeshStandardMaterial({ map: basektballCourt });

const material = new THREE.MeshStandardMaterial({ map: basektball });
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), basketMaterial);

const planeShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    alphaMap: bakedShadow,
    transparent: true,
  })
);

plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

planeShadow.rotation.x = -Math.PI * 0.5;
planeShadow.position.y = plane.position.y + 0.01;

scene.add(sphere, plane, planeShadow);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let jumpSpeed = 3;
let stopJumping = true;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   sphere.position.y = Math.abs(Math.sin(elapsedTime * jumpSpeed));
  const CurrentJump =
    Math.abs(
      Math.sin(elapsedTime * 1.5 * Math.PI) *
        Math.pow(Math.E, -0.01 * elapsedTime)
    ) * 3;
  planeShadow.material.opacity = (1 - sphere.position.y) * 0.5;
  planeShadow.position.x = sphere.position.x;
  planeShadow.position.z = sphere.position.z;
  sphere.position.y = CurrentJump;
  //   jumpSpeed += 0.01;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

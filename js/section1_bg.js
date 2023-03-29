

//////////////////////////////////////////////////////////////////////////////////
// Building scene
//////////////////////////////////////////////////////////////////////////////////
// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera(65, document.documentElement.clientWidth / window.innerHeight, 0.1, 100);
camera.position.z = 7;
camera.position.y = 6;
camera.lookAt(0, 0, -10);

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('#background')
});

// Configure renderer clear color
renderer.setClearColor("#f5efe6");

// Configure renderer ratio
renderer.setPixelRatio(window.devicePixelRatio);

// Configure renderer size
renderer.setSize(document.documentElement.clientWidth, window.innerHeight);

// handle blender gamma correction
renderer.outputEncoding = THREE.sRGBEncoding;

//////////////////////////////////////////////////////////////////////////////////
// Building scene
//////////////////////////////////////////////////////////////////////////////////
// helpers
// const gridHelper = new THREE.GridHelper(200, 200);
// scene.add(gridHelper);

// point Light
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(0, 1, 1);

// Ambient light
const lightAmbient = new THREE.AmbientLight(0xf5efe6, 0.5);
scene.add(light, lightAmbient);

// load desktop
const loader = new THREE.GLTFLoader();

const deskLoaderPromise = new Promise((resolve, reject) => {
  loader.load('assets/models/desk/desk.gltf', function(gltf) {
    // Get the mesh object from the loaded model
    const model = gltf.scene.children[0];

    model.position.set(3, 0, 0); 
    model.rotation.set(0, -Math.PI / 5, 0); 
    
    // Resolve the promise with the mesh object
    resolve(model);
  }, undefined, reject);
});

// load pc
const pcLoaderPromise = new Promise((resolve, reject) => {
  loader.load('assets/models/pc/pc.gltf', function(gltf) {
    // Get the mesh object from the loaded model
    const model = gltf.scene.children[0];

    model.position.set(3, 0, 0); 
    model.rotation.set(0, -Math.PI / 5, 0); 
    
    // Resolve the promise with the mesh object
    resolve(model);
  }, undefined, reject);
});

// load Character
var mixer = new THREE.AnimationMixer;
const characterLoaderPromise = new Promise((resolve, reject) => {
  loader.load('assets/models/character/character.gltf', function(gltf) {
    // Get the mesh object from the loaded model
    const model = gltf.scene.children[0];

    model.position.set(1, 0, 2); 
    model.rotation.set(0, 0, 0); 

    mixer = new THREE.AnimationMixer(gltf.scene)
    const animationAction = gltf.animations[0];
    var action = mixer.clipAction(animationAction);
    action.setLoop(THREE.LoopRepeat);
    action.play();

    action.setEffectiveTimeScale(1);
    
    // const skeletonHelper = new THREE.SkeletonHelper(model);
    // scene.add(skeletonHelper);
    
    // Resolve the promise with the mesh object
    resolve(model);
  }, undefined, reject);
});

//////////////////////////////////////////////////////////////////////////////////
// Main loop
//////////////////////////////////////////////////////////////////////////////////
// Wait for both promises to resolve
Promise.all([deskLoaderPromise, pcLoaderPromise, characterLoaderPromise]).then((meshes) => {
  // Add desk mesh to the scene
  const deskMesh = meshes[0];
  scene.add(deskMesh);
  // Add pc mesh to the scene
  const pcMesh = meshes[1];
  scene.add(pcMesh);
  // Add character mesh to the scene
  const characterMesh = meshes[2];
  scene.add(characterMesh);

  // Render Loop
  var clock = new THREE.Clock();
  var render = function () {
    requestAnimationFrame(render);

    mixer.update(clock.getDelta());

    // deskMesh.rotation.y -= 0.01;
    // pcMesh.rotation.y -= 0.01;
    // characterMesh.rotation.y -= 0.01;

    // Render the scene
    renderer.render(scene, camera);
  };

  render();
});

//////////////////////////////////////////////////////////////////////////////////
// Event listners
//////////////////////////////////////////////////////////////////////////////////
// on screen resized
window.addEventListener("resize", () => {
  camera.aspect = document.documentElement.clientWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(document.documentElement.clientWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// on mouse moved
document.getElementById('landing-page').addEventListener("mousemove", (e) => {
  let x = e.screenX;
  let y = e.screenY;

  camera.position.z = 7 - (x / document.documentElement.clientWidth - 0.5) * 0.5;
  camera.position.y = 6 + (y / window.innerHeight - 0.5) * 0.5;
});

//////////////////////////////////////////////////////////////////////////////////
// more
//////////////////////////////////////////////////////////////////////////////////

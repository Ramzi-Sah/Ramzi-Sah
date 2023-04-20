// config
var NEXT_PAGE_TIME = 1000;
var PADDING = 100;

//////////////////////////////////////////////////////////////////////////////////
// Building scene
//////////////////////////////////////////////////////////////////////////////////
// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera(65, document.documentElement.clientWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 6, 7);
camera.lookAt(0, 0, -10);

// Create a renderer with Antialiasing
var canvas = document.querySelector('#background_1');
var canvaHalfSize = false;

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
  alpha: true,
  preserveDrawingBuffer: true
});

function canvasSize() {
  if (canvaHalfSize) {
    // canvas size
    var canvas_width = (document.documentElement.clientWidth/2 - 100);
    var canvas_height = window.innerHeight - 100;

    canvas.style.left = "50vw";
    canvas.style.width = canvas_width + "px";

    camera.aspect = canvas_width / canvas_height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas_width, canvas_height);
    renderer.setPixelRatio(window.devicePixelRatio);  
  } else {
    // canvas size
    var canvas_width = (document.documentElement.clientWidth);
    var canvas_height = window.innerHeight;

    canvas.style.left = "0";
    canvas.style.width = canvas_width + "px";

    camera.aspect = canvas_width / canvas_height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas_width, canvas_height);
    renderer.setPixelRatio(window.devicePixelRatio);
  }
}

// Configure renderer clear color
renderer.setClearColor(0x000000, 0);

// Configure renderer ratio
renderer.setPixelRatio(window.devicePixelRatio);

// Configure renderer size
renderer.setSize(document.documentElement.clientWidth, window.innerHeight);

// handle blender gamma correction
renderer.outputEncoding = THREE.sRGBEncoding;

/* 
// helpers
const gridHelper = new THREE.GridHelper(200, 200);
scene.add(gridHelper);
*/

// point Light
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(0, 5, 5);

// Ambient light
const lightAmbient = new THREE.AmbientLight(0xf5efe6, 0.5);
scene.add(light, lightAmbient);

const loader = new THREE.GLTFLoader();

//////////////////////////////////////////////////////////////////////////////////
// Event listners
//////////////////////////////////////////////////////////////////////////////////
// on screen resized
window.addEventListener("resize", () => {
  canvasSize();
  /*
  camera.aspect = document.documentElement.clientWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(document.documentElement.clientWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  */
});

// on mouse moved
var moveSceneWithMouse = true;
window.addEventListener("mousemove", (e) => {
  if (!moveSceneWithMouse) return;
  let x = e.screenX;
  let y = e.screenY;

  // update camera position
  TweenLite.to(camera.position, 
    1,
    {
      x: x / document.documentElement.clientWidth - 0.5,
      y: 6 - (y / window.innerHeight - 0.5),
    }
  )
});

//////////////////////////////////////////////////////////////////////////////////
// more
//////////////////////////////////////////////////////////////////////////////////

// get loading screen
var loadingDiv = document.getElementById('loading-screen');

// load Character
var mixer = new THREE.AnimationMixer;
loader.load('assets/models/scene1.gltf', function(gltf) {
  // Get the mesh object from the loaded model
  scene.add(gltf.scene);

  scene.position.set(3, 0, -2); 
  scene.rotation.set(0, -Math.PI / 5, 0); 

  // console.log(gltf.scene);
  // console.log(gltf.animations);
  
  var model_bureau = gltf.scene.getObjectByName("Bureau");
  var model_PC = gltf.scene.getObjectByName("PC");
  var model_chair = gltf.scene.getObjectByName("Chair");
  var model_character = gltf.scene.getObjectByName("Character");

  // set transparency
  model_bureau.children.forEach((model_child) => {
    if(model_child instanceof THREE.Mesh) {
      model_child.material.format = THREE.RGBAFormat
      model_child.material.transparent = true;
    }
  });
  model_PC.children.forEach((model_child) => {
    if(model_child instanceof THREE.Mesh) {
      model_child.material.format = THREE.RGBAFormat
      model_child.material.transparent = true;
    }
  });
  model_chair.children.forEach((model_child) => {
    model_child.children.forEach((model_child_2) => {
      if(model_child_2 instanceof THREE.Mesh) {
        model_child_2.material.format = THREE.RGBAFormat
        model_child_2.material.transparent = true;
      }
    });
  });
  model_character.children.forEach((model_child) => {
    if(model_child instanceof THREE.Mesh) {
      model_child.material.format = THREE.RGBAFormat
      model_child.material.transparent = true;
    }
  });

  // init animations
  mixer = new THREE.AnimationMixer(gltf.scene);

  // character start animation
  let characterClip = gltf.animations.find(clip => clip.name === 'character');
  let characterAction = mixer.clipAction(characterClip);
  characterAction.play();
  characterAction.loop = THREE.LoopOnce;
  characterAction.clampWhenFinished = true;

  // character chair loop action
  let characterLoopClip = gltf.animations.find(clip => clip.name === 'character.loop');
  let characterLoopAction = mixer.clipAction(characterLoopClip);

  // character chair loop action
  let characterTPoseClip = gltf.animations.find(clip => clip.name === 'character.TPose');
  let characterTPoseAction = mixer.clipAction(characterTPoseClip);

  // Chair start animation
  let chairClip = gltf.animations.find(clip => clip.name === 'chair');
  let chairAction = mixer.clipAction(chairClip);
  chairAction.play();
  chairAction.loop = THREE.LoopOnce;
  chairAction.clampWhenFinished = true;

  // chair loop action
  let chairLoopClip = gltf.animations.find(clip => clip.name === 'chair.loop');
  let chairLoopAction = mixer.clipAction(chairLoopClip);

  mixer.addEventListener('finished', async function (e) {
    if (e.action._clip.name == 'character') {
      characterLoopAction.reset();
      characterLoopAction.play();
      characterAction.stop();
    };

    if (e.action._clip.name == 'chair') {
      chairLoopAction.play();
    };
  });
  //////////////////////////////////////////////////////////////////////////////////
  // handle scroll
  //////////////////////////////////////////////////////////////////////////////////

  // setup hover change color
  var falling_contacts_icons = document.getElementsByClassName("falling-contact-icon");
  var rotate_char = false;


  $(".main").onepage_scroll({
    sectionContainer: "section",
    easing: "ease",
    animationTime: NEXT_PAGE_TIME,
    pagination: false,
    updateURL: false,
    loop: false, 
    keyboard: true,
    responsiveFallback: false,
    direction: "vertical",
    beforeMove: function(index) {
      // console.log("moving to " + index);

      model_character.rotation.y = 0;

      for (var i = 0; i < falling_contacts_icons.length; i++) {
        let element = falling_contacts_icons[i];
        element.addEventListener("mouseenter", function() {
          if (index == 2) {
            element.getElementsByTagName("svg")[0].style.fill = 'rgb(255 255 255 / 50%)';
          } else {
            element.getElementsByTagName("svg")[0].style.fill = 'rgb(0 0 0 / 50%)';
          }
        });
        element.addEventListener("mouseleave", function() {
          if (index == 2) {
            element.getElementsByTagName("svg")[0].style.fill = 'rgb(255 255 255 / 30%)';
          } else {
            element.getElementsByTagName("svg")[0].style.fill = 'rgb(0 0 0 / 30%)';
          }
        });
      }


      if (index == 1) {
        // canvas size
        canvaHalfSize = false;
        canvasSize(canvaHalfSize);
        
        // visibility and mouse move
        moveSceneWithMouse = true;
        model_chair.visible = true;
        model_PC.visible = true;
        model_bureau.visible = true;

        rotate_char = false;

        // falling contacts handle color
        var color = {shade: 255};
        TweenLite.to(color, 
          NEXT_PAGE_TIME / 2000,
          {
            shade: 0,
            onUpdate: () => {
              document.getElementsByClassName("falling-contact-line")[0].style.backgroundColor  = 'rgb(' + color.shade +' ' + color.shade +' ' + color.shade +' / 30%)';
              
              for (var i = 0; i < falling_contacts_icons.length; i++) {
                falling_contacts_icons[i].getElementsByTagName("svg")[0].style.fill  = 'rgb(' + color.shade +' ' + color.shade +' ' + color.shade +' / 30%)'
              }
            }
          }
        ).delay(0.1);

        // set opacity
        model_bureau.children.forEach((model_child) => {
          TweenLite.to(model_child.material, 
            NEXT_PAGE_TIME / 2000,
            {
              ease: Power1.easeIN,
              opacity: 1,
            }
          )
        });
        model_PC.children.forEach((model_child) => {
          TweenLite.to(model_child.material, 
            NEXT_PAGE_TIME / 2000,
            {
              ease: Power1.easeIN,
              opacity: 1,
            }
          )
        });

        model_chair.children.forEach((model_child) => {
          model_child.children.forEach((model_child_2) => {
            if(model_child_2 instanceof THREE.Mesh) {
              TweenLite.to(model_child_2.material, 
                NEXT_PAGE_TIME / 2000,
                {
                  ease: Power1.easeIN,
                  opacity: 1,
                }
              )
            }
          });
        });

        model_character.children.forEach((model_child) => {
          if(model_child instanceof THREE.Mesh) {
            TweenLite.to(model_child.material, 
              NEXT_PAGE_TIME / 2000,
              {
                opacity: 1,
              }
            )
          }
        });

        // character disable wireframe
        model_character.children.forEach((model_child) => {
          if(model_child instanceof THREE.Mesh) {
            model_child.material.wireframe = false;
          }
        });

        // rotate scene
        TweenLite.to(scene.rotation, 
          NEXT_PAGE_TIME / 1000,
          {
            y: - Math.PI / 5,
          }
        )
        
        // position scene
        TweenLite.to(scene.position, 
          NEXT_PAGE_TIME / 1000,
          {
            x: 3,
          }
        )
        
        TweenLite.to(camera.position, 
          NEXT_PAGE_TIME / 2000,
          {
            x: 0,
            y: 6,
            z: 7,
          }
        )
        camera.lookAt(0, 0, -10);

        // set animation
        characterTPoseAction.reset();
        characterTPoseAction.stop();
        characterAction.reset();
        characterAction.stop();
        characterLoopAction.play();
        
        chairAction.reset();
        chairAction.stop();
        chairLoopAction.play();
      } else if (index == 2) {
        // canvas size
        canvaHalfSize = true;
        canvasSize(canvaHalfSize);

        // visibility and mouse move
        moveSceneWithMouse = false;
        model_chair.visible = false;
        model_PC.visible = false;
        model_bureau.visible = false;

        rotate_char = true;
        

        // falling contacts handle color
        var color = {shade: 0};
        TweenLite.to(color, 
          NEXT_PAGE_TIME / 2000,
          {
            shade: 255,
            onUpdate: () => {
              document.getElementsByClassName("falling-contact-line")[0].style.backgroundColor  = 'rgb(' + color.shade +' ' + color.shade +' ' + color.shade +' / 30%)';
              
              for (var i = 0; i < falling_contacts_icons.length; i++) {
                falling_contacts_icons[i].getElementsByTagName("svg")[0].style.fill  = 'rgb(' + color.shade +' ' + color.shade +' ' + color.shade +' / 30%)'
              }
            }
          }
        ).delay(0.3);
        
        // character to wireframe
        model_character.children.forEach((model_child) => {
          if(model_child instanceof THREE.Mesh) {
            model_child.material.wireframe = true;
          }
        });

        // set opacity
        model_bureau.children.forEach((model_child) => {
          TweenLite.to(model_child.material, 
            NEXT_PAGE_TIME / 2000,
            {
              opacity: 0,
            }
          )
        });
        model_PC.children.forEach((model_child) => {
          TweenLite.to(model_child.material, 
            NEXT_PAGE_TIME / 2000,
            {
              opacity: 0,
            }
          )
        });

        model_chair.children.forEach((model_child) => {
          model_child.children.forEach((model_child_2) => {
            if(model_child_2 instanceof THREE.Mesh) {
              TweenLite.to(model_child_2.material, 
                NEXT_PAGE_TIME / 2000,
                {
                  opacity: 0,
                }
              )
            }
          });
        });

        model_character.children.forEach((model_child) => {
          if(model_child instanceof THREE.Mesh) {
            TweenLite.to(model_child.material, 
              NEXT_PAGE_TIME / 2000,
              {
                opacity: 0.2,
              }
            )
          }
        });

        // rotate scene
        TweenLite.to(scene.rotation, 
          NEXT_PAGE_TIME / 2000,
          {
            y: 0,
          }
        )
        
        TweenLite.to(scene.position, 
          NEXT_PAGE_TIME / 2000,
          {
            x: 0,
          }
        )

        TweenLite.to(camera.position, 
          NEXT_PAGE_TIME / 2000,
          {
            x: 0,
            y: 5,
            z: 6,
          }
        )
        camera.lookAt(0, 5, 0);

        // set animation
        characterLoopAction.reset();
        characterLoopAction.stop();
        characterAction.reset();
        characterAction.stop();
        characterTPoseAction.play();
      } else if (index == 3) {
        // falling contacts handle color
        var color = {shade: 255};
        TweenLite.to(color, 
          NEXT_PAGE_TIME / 2000,
          {
            shade: 0,
            onUpdate: () => {
              document.getElementsByClassName("falling-contact-line")[0].style.backgroundColor  = 'rgb(' + color.shade +' ' + color.shade +' ' + color.shade +' / 30%)';
              
              for (var i = 0; i < falling_contacts_icons.length; i++) {
                falling_contacts_icons[i].getElementsByTagName("svg")[0].style.fill  = 'rgb(' + color.shade +' ' + color.shade +' ' + color.shade +' / 30%)'
              }
            }
          }
        ).delay(0.3);

        model_character.children.forEach((model_child) => {
            if(model_child instanceof THREE.Mesh) {
              TweenLite.to(model_child.material, 
                NEXT_PAGE_TIME / 2000,
                {
                  opacity: 0,
                }
              )
            }
        });
      }

    },  // This option accepts a callback function. The function will be called before the page moves.
    afterMove: function(index) {
        // console.log("moved to " + index);

        if (index == 2) {

        } else {

        }
    },
 });

  //////////////////////////////////////////////////////////////////////////////////
  // Render Loop
  //////////////////////////////////////////////////////////////////////////////////
  var clock = new THREE.Clock();
  var render = function () {
    requestAnimationFrame(render);

    // update animation mixer
    mixer.update(clock.getDelta());

    if (rotate_char)
      model_character.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);
  };

  render();
  
  // loading screen
  var loadingDivPos = {top: 0};
  TweenLite.to(loadingDivPos, 
    0.5,
    {
      top: -100,
      onUpdate: () => {
        loadingDiv.style.top = loadingDivPos.top + 'vh';
      }
    }
  )
}, undefined, undefined);

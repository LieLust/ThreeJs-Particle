const container = document.getElementById('container')
let camera,
  scene,
  renderer,
  mouseX = 0,
  mouseY = 0,
  particles = [];
//const color = Math.random() * 0xFF0000
let particlesLimit = 1000;
let particlesCount = 10; // real particle count particlesLimit / particlesCount. Example: 1000/10 = 100
let particleSizeX = 5,
  particleSizeY = 5;

init();

function init() {
  camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    1,
    4000
  );
  camera.position.z = particlesLimit * 2;

  scene = new THREE.Scene();
  scene.add(camera);

  if (window.WebGLRenderingContext) renderer = new THREE.WebGLRenderer();
  else renderer = new THREE.CanvasRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  makeParticles();

  // add the mouse move listener
  document.addEventListener("mousemove", onMouseMove, false);

  setInterval(update, 1000 / 30);
}

function update() {
  updateParticles();
  renderer.render(scene, camera);
}

function makeParticles() {
  let particle, material, geometry, rectShape;
  for (
    let zpos = -Math.abs(particlesLimit);
    zpos < particlesLimit;
    zpos += particlesCount
  ) {
    rectShape = new THREE.Shape();
    rectShape.moveTo(0, 0);
    rectShape.lineTo(0, particleSizeY);
    rectShape.lineTo(particleSizeX, particleSizeY);
    rectShape.lineTo(particleSizeX, 0);
    rectShape.lineTo(0, 0);

    geometry = new THREE.BoxGeometry(5, 5, 5);
    material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: /*Math.random() * 0x808080 + 0x808080*/'#00D455',
      fog: true
    });
    particle = new THREE.Mesh(geometry, material);

    scene.add(particle);

    // give it a random x and y position between -500 and 500
    particle.position.x = Math.random() * particlesLimit - particlesLimit / 2;
    particle.position.y = Math.random() * particlesLimit - particlesLimit / 2;

    particle.position.z = zpos;
    particle.scale.x = particle.scale.y = 1;
    scene.add(particle);

    particles.push(particle);
  }
}

function updateParticles() {
  for (let i = 0; i < particles.length; i++) {
    particle = particles[i];
    if (mouseY < 50) particle.position.z += 50 * 0.05;
    else particle.position.z += mouseY * 0.05;

    camera.rotation.z += 0.0001;

    if (particle.position.z > particlesLimit * 2) {
      particle.scale.x = particle.scale.y = 1;

      particle.position.z -= particlesLimit * 2;
      particle.position.x = Math.random() * particlesLimit - particlesLimit / 2;
      particle.position.y = Math.random() * particlesLimit - particlesLimit / 2;
    }

    particle.scale.x = particle.scale.y =
      particle.position.z / particlesLimit * 2;
  }
}

function onMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

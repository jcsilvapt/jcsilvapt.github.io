var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var render = new THREE.WebGLRenderer();

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
var light = new THREE.AmbientLight(0x404040, 1);
scene.add(cube);
scene.add(light);

camera.position.z = 5;

render.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(render.domElement);

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  render.render(scene, camera);
}
animate();

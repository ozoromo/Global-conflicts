import './style.css'
import * as THREE from 'three';

// @ts-ignore
import vertexShader from './shaders/vertex.glsl';
// @ts-ignore
import fragmentShader from './shaders/fragment.glsl';

// @ts-ignore
import atmosphereVertexShader from './shaders/atmosphere_vertex.glsl';
// @ts-ignore
import atmosphereFragmentShader from './shaders/atmosphere_fragment.glsl';

//scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer({antialias: true});
camera.position.z = 10;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);


var speed = 0.1 ;
var delta = 0;

//Stolen fom stack overflow
// @ts-ignore
function placeObjectOnPlanet(object, lat, lon, radius) {
    var latRad = lat * (Math.PI / 180);
    var lonRad = -lon * (Math.PI / 180);
    object.position.set(
        Math.cos(latRad) * Math.cos(lonRad) * radius,
        Math.sin(latRad) * radius,
        Math.cos(latRad) * Math.sin(lonRad) * radius
    );
    object.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
}

//Marker setup
const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 50, 50),
    new THREE.MeshBasicMaterial( {color: 0xea4f20} )
)


//Sphere setup
const planet = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50 ,50),
    //new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`src/img/earth.jpg`)})
    new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            globeTexture: {
                value: new THREE.TextureLoader().load('src/img/earth.jpg')
            }
        }
    })
);

//Atmosphere setup
const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50 ,50),
    new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    })
);
atmosphere.scale.set(1.1, 1.1, 1.1);

scene.add(planet);
scene.add(atmosphere);





function animate() {
    requestAnimationFrame( animate );

    delta = clock.getDelta();

    planet.rotation.y += speed * delta;

    renderer.render( scene, camera );
}
animate();
import * as THREE from 'three';

import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let container;
let camera, cameraTarget, scene, renderer;
let group, textMesh1, textMesh2, textGeo, material;

let text = 'Dante Rigoli';
const depth = 20,
  size = 35,
  hover = 30,
  curveSegments = 4,
  bevelThickness = 2,
  bevelSize = 1.5;

let font = null;
const mirror = true;

init();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // CAMERA

  camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
  camera.position.set( 0, 400, 700 );

  cameraTarget = new THREE.Vector3( 0, 150, 0 );

  // SCENE

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );
  scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

  // LIGHTS

  const dirLight1 = new THREE.DirectionalLight( 0xffffff, 0.4 );
  dirLight1.position.set( 0, 0, 1 ).normalize();
  scene.add( dirLight1 );

  const dirLight2 = new THREE.DirectionalLight( 0xffffff, 2 );
  dirLight2.position.set( 0, hover, 10 ).normalize();
  dirLight2.color.setHSL( Math.random(), 1, 0.5, THREE.SRGBColorSpace );
  scene.add( dirLight2 );

  material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

  group = new THREE.Group();
  group.position.y = 100;

  scene.add( group );

  const loader = new TTFLoader();

  loader.load( 'assets/fonts/kenpixel.ttf', function ( json ) {

    font = new Font( json );
    createText();

  } );

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry( 10000, 10000 ),
    new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
  );
  plane.position.y = 100;
  plane.rotation.x = - Math.PI / 2;
  scene.add( plane );

  // RENDERER

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop( animate );
  container.appendChild( renderer.domElement );

  // EVENTS

  container.style.touchAction = 'none';
  window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}


function createText() {

  textGeo = new TextGeometry( text, {
    font: font,
    size: size,
    depth: depth,
    curveSegments: curveSegments,
    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: true

  } );

  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();

  const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

  textMesh1 = new THREE.Mesh( textGeo, material );

  textMesh1.position.x = centerOffset;
  textMesh1.position.y = hover;
  textMesh1.position.z = 0;

  textMesh1.rotation.x = 0;
  textMesh1.rotation.y = Math.PI * 2;

  group.add( textMesh1 );

  if ( mirror ) {

    textMesh2 = new THREE.Mesh( textGeo, material );

    textMesh2.position.x = centerOffset;
    textMesh2.position.y = - hover;
    textMesh2.position.z = depth;

    textMesh2.rotation.x = Math.PI;
    textMesh2.rotation.y = Math.PI * 2;

    group.add( textMesh2 );

  }

}

function animate() {

  group.rotation.y += 0.01;
  camera.lookAt( cameraTarget );
  renderer.render( scene, camera );

}
var camera, scene, renderer;
var geometry, material, mesh;
//var floorPlane;
var controls;

var objects = [];

var raycaster;
var build1;

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

	var element = document.body;

	var pointerlockchange = function ( event ) {

		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

			controlsEnabled = true;
			controls.enabled = true;

			blocker.style.display = 'none';

		} else {

			controls.enabled = false;

			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';

			instructions.style.display = '';

		}

	}

	var pointerlockerror = function ( event ) {

		instructions.style.display = '';

	}

	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	instructions.addEventListener( 'click', function ( event ) {

		instructions.style.display = 'none';

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		if ( /Firefox/i.test( navigator.userAgent ) ) {

			var fullscreenchange = function ( event ) {

				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

					element.requestPointerLock();
				}

			}

			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

			element.requestFullscreen();

		} else {

			element.requestPointerLock();

		}

	}, false );

} else {

	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var prevTime = performance.now();

//Initilize  scene
init();

function init() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );

	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

	var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
	light.position.set( 0.5, 1, 0.75 );
	scene.add( light );

	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );

	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
	var VIEW_ANGLE = 75, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	//camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	//scene.add(camera);
	camera.position.set(0,75,200);
	

	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

	

	// note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
	//var floorTexture = new THREE.ImageUtils.loadTexture( '../../js/duke.jpg' );
	var floorTexture = new THREE.ImageUtils.loadTexture( 'js/images/checkerboard.jpg' );
	floorTexture.wraps = floorTexture.wrapT = THREE.RepeatWrapping; 
	//floorTexture.repeat.set( 100, 100 );
	// DoubleSide: render texture on both sides of mesh
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(500, 500, 100, 100);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	



	var urls = [
	  'js/images/bluesky_left.jpg', //left
	  'js/images/bluesky_right.jpg',  //right
	  'js/images/bluesky_top.jpg', //top
	  'js/images/bluesky_top.jpg', //bottom
	  'js/images/bluesky_back.jpg', //back
	  'js/images/bluesky_front.jpg'  //front
	];

	var cubemap = THREE.ImageUtils.loadTextureCube(urls); // load textures
	cubemap.format = THREE.RGBFormat;

	var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
	shader.uniforms['tCube'].value = cubemap; // apply textures to shader

	// create shader material
	var skyBoxMaterial = new THREE.ShaderMaterial( {
	  fragmentShader: shader.fragmentShader,
	  vertexShader: shader.vertexShader,
	  uniforms: shader.uniforms,
	  depthWrite: false,
	  side: THREE.BackSide
	});

	// create skybox mesh
	var skybox = new THREE.Mesh(
	  new THREE.CubeGeometry(2000, 2000, 2000),
	  skyBoxMaterial
	);

	scene.add(skybox);




	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//

	window.addEventListener( 'resize', onWindowResize, false );

	//


	var axes = new THREE.AxisHelper(200);
	scene.add( axes );

	var test = new THREE.BoxGeometry( 50, 50, 10);
	var materialTest = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	var testMesh = new THREE.Mesh( test, materialTest);
	//testMesh.position.x = testMesh.position.x +30;
	//testMesh.position.z = testMesh.position.z +30;
	testMesh.position.y = testMesh.position.y +25;
	scene.add( testMesh )
	objects.push( testMesh );


	var test2 = new THREE.BoxGeometry( 50, 50, 10);
	var materialTest2 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	var testMesh2 = new THREE.Mesh( test, materialTest2);
	testMesh2.position.y = testMesh2.position.y +25;
	testMesh2.position.x = testMesh2.position.x +50;
	scene.add( testMesh2 )
	objects.push( testMesh2 );


	build1 = new building();
	console.log(build1);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}
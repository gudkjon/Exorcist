var camera, scene, renderer;
var geometry, material, mesh;
//var floorPlane;
var controls;

var objects = [];

var raycaster;

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
init();


var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var prevTime = performance.now();

function init() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

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
/*
	player = new Player({
		controls : controls,
		caster : raycaster
	});*/
	
	// floor
/*	geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	

	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

		var face = geometry.faces[ i ];

		face.vertexColors[ 0 ] = new THREE.Color().setRGB( i/l-0.2,0,i/l-0.2 );
		face.vertexColors[ 1 ] = new THREE.Color().setRGB( i/l-0.2,0,i/l-0.2 );
		face.vertexColors[ 2 ] = new THREE.Color().setRGB( i/l-0.2,0,i/l-0.2 );

	}

	material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

	var plane = new THREE.Mesh( geometry, material );
	scene.add( plane );
*/
	

	// note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
	var floorTexture = new THREE.ImageUtils.loadTexture( 'js/images/checkerboard.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	// DoubleSide: render texture on both sides of mesh
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(300, 300, 1, 1);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	//

//	var skyGeometry = new THREE.SphereGeometry(3000, 60, 40);  
//	var skyMaterial = new THREE.ImageUtils.loadTexture('js/images/sky.jpg');
/*
	var uniforms = {  
  		texture: { type: 't', value: THREE.ImageUtils.loadTexture('js/images/sky.jpg') }
	};

	var skyMaterial = new THREE.ShaderMaterial( {  
		  uniforms:       uniforms,
		  vertexShader:   document.getElementById('sky-vertex').textContent,
		  fragmentShader: document.getElementById('sky-fragment').textContent
	});

	var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);  
	skyBox.scale.set(-1, 1, 1);  
	skyBox.eulerOrder = 'XZY';  
	skyBox.renderDepth = 1000.0;  
	scene.add(skyBox); 


	var imagePrefix = "js/images/bluesky_";
	var directions  = ["back", "front", "left", "right", "back"];
	var imageSuffix = ".jpg";
	var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );	
	
	var materialArray = [];
	for (var i = 0; i < 5; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	scene.add( skyBox );
*/
/*
	var vertexShader = document.getElementById( 'vertexShader' ).textContent;
	var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
	var uniforms = {
	topColor:      { type: "c", value: new THREE.Color(0x000000) },
	bottomColor: { type: "c", value: new THREE.Color( 0x262626 ) },
	offset:         { type: "f", value: 100 },
	exponent:     { type: "f", value: 0.7 }
	}

	//skydome

	var skyGeo = new THREE.SphereGeometry( 2000, 32, 15 );
	var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

	var sky = new THREE.Mesh( skyGeo, skyMat );
	scene.add( sky );

	//
*/


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


}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}
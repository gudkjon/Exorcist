var camera, scene, renderer, player;
var geometry, material, mesh;
var floorPlane;
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
	
	var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
	light.position.set( 0.5, 1, 0.75 );
	scene.add( light );

	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );



	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
	
	player = new Player({
		controls : controls,
		caster : raycaster
	});
	
	// floor

	geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
		var vertex = geometry.vertices[ i ];
		vertex.x += Math.random() * 20 - 10;
		vertex.y += Math.random() * 20 - 10;
		vertex.z += Math.random() * 20 - 10;
	}

	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

		var face = geometry.faces[ i ];

		face.vertexColors[ 0 ] = new THREE.Color().setRGB( i/l-0.2,0,i/l-0.2 );
		face.vertexColors[ 1 ] = new THREE.Color().setRGB( i/l-0.2,0,i/l-0.2 );
		face.vertexColors[ 2 ] = new THREE.Color().setRGB( i/l-0.2,0,i/l-0.2 );

	}

	material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

	floorPlane = new THREE.Mesh( geometry, material );
	//floorPlane.position.y = 100;
	scene.add( floorPlane );


	//

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//

	window.addEventListener( 'resize', onWindowResize, false );


	geometry = new THREE.BoxGeometry( 50, 50, 50 );
	var texture = THREE.ImageUtils.loadTexture('js/duke.jpg', {}, function() {
    	renderer.render(scene);
	});
	material = new THREE.MeshBasicMaterial({map: texture});
	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
/*
		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );*/

	}

	for ( var i = 0; i < 500; i ++ ) {

		//material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = Math.floor( Math.random() * 200 - 100 ) * 50;
		mesh.position.y = 25;
		mesh.position.z = Math.floor( Math.random() * 200 - 100 ) * 50;
		scene.add( mesh );

		material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

		objects.push( mesh );

/*
		var test = new THREE.BoxGeometry( 50, 50, 10);
		var materialTest = new THREE.MeshBasicMaterial( { color: 0x000088 } );
		var testMesh = new THREE.Mesh( test, materialTest);
		testMesh.position.x = testMesh.position.x +30;
		testMesh.position.z = testMesh.position.z +30;
		scene.add( testMesh)
		objects.push( testMesh );*/

	}

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


function updatePlayer(delta) {
	velocity.x -= velocity.x * 10.0 * delta;
	velocity.z -= velocity.z * 10.0 * delta;

	velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

	if ( keys[38] || keys[keyCode('W')] ) velocity.z -= 400.0 * delta;
	if ( keys[40] || keys[keyCode('S')] ) velocity.z += 400.0 * delta;
	if ( keys[37] || keys[keyCode('A')] ) velocity.x -= 400.0 * delta;
	if ( keys[39] || keys[keyCode('D')] ) velocity.x += 400.0 * delta;
	if( keys[keyCode(' ')]) {
		if ( canJump === true ) velocity.y += 550;
		canJump = false;
	}

	if ( isOnObject === true ) {
		/*velocity.y = Math.max( 0, velocity.y );

		canJump = true;*/
	}

	controls.getObject().translateX( velocity.x * delta );
	controls.getObject().translateY( velocity.y * delta );
	controls.getObject().translateZ( velocity.z * delta );

	if ( controls.getObject().position.y < 10 ) {

		velocity.y = 0;
		controls.getObject().position.y = 10;

		canJump = true;

	}
}
var isOnObject, i = false;
function iterGame() {

	requestAnimationFrame( iterGame );

	if ( controlsEnabled ) {
		raycaster.ray.origin.copy( controls.getObject().position );
		raycaster.ray.origin.y -= 10;

		var intersections = raycaster.intersectObjects( objects );
		var isOnObject = intersections.length > 0;

		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;

		updatePlayer(delta);

		prevTime = time;

	}

	renderer.render( scene, camera );

}
iterGame();

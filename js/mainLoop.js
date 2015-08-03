

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
	collision();

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

var collision = function () {
    //'use strict';
    var collisions, i,
      // Maximum distance from the origin before we consider collision
      distance = 32;
    // For each ray
    for (i = 0; i < rays.length; i += 1) {
      // We reset the raycaster to this direction
      raycaster.set(controls.getObject().position, rays[i]);
      // Test if we intersect with any obstacle mesh
      collisions = raycaster.intersectObjects(objects);
      // And disable that direction if we do
      if (collisions.length > 0 && collisions[0].distance <= distance) {
        // Yep, controls.getObject().rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
        if ((i === 0 || i === 1 || i === 7) && velocity.z > 0) {
          velocity.z = 0;
        } else if ((i === 3 || i === 4 || i === 5) && velocity.z < 0) {
          velocity.z = 0;
        }
        if ((i === 1 || i === 2 || i === 3) && velocity.x > 0) {
          velocity.x = 0;
        } else if ((i === 5 || i === 6 || i === 7) && velocity.x < 0) {
          velocity.x = 0;
        }
      }
    }
  }

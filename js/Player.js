function Player(descr) {

/*
    // Diagnostics to check inheritance stuff
    this._PlayerProperty = true;
    console.dir(this);
*/
this.setup(descr);

};
Player.prototype.setup = function (descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
};
Player.prototype.radius = 1;
Player.prototype.height = 2;
Player.prototype.caster = null;
Player.prototype.controls = null;
Player.prototype.rays = [
    new THREE.Vector3(0, 0, this.radius),
    new THREE.Vector3(this.radius, 0, this.radius),
    new THREE.Vector3(this.radius, 0, 0),
    new THREE.Vector3(this.radius, 0, -this.radius),
    new THREE.Vector3(0, 0, -this.radius),
    new THREE.Vector3(-this.radius, 0, -this.radius),
    new THREE.Vector3(-this.radius, 0, 0),
    new THREE.Vector3(-this.radius, 0, this.radius),
    new THREE.Vector3(0, -this.height, 0)
];
Player.prototype.canJump = true;
Player.prototype.velocity = new THREE.Vector3;
Player.prototype.collision = function () {
    //'use strict';
    var collisions, i,
      // Maximum distance from the origin before we consider collision
      distance = 32;
    // For each ray
    for (i = 0; i < rays.length; i += 1) {
      // We reset the this.caster to this direction
      this.caster.set(this.controls.getObject().position, this.rays[i]);
      // Test if we intersect with any obstacle mesh
      collisions = this.caster.intersectObjects(objects);
      // And disable that direction if we do
      if (collisions.length > 0 && collisions[0].distance <= distance) {
        // this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
        if ((i === 0 || i === 1 || i === 7) && this.velocity.z > 0) {
          this.velocity.z = 0;
        } else if ((i === 3 || i === 4 || i === 5) && this.velocity.z < 0) {
          this.velocity.z = 0;
        }
        if ((i === 1 || i === 2 || i === 3) && this.velocity.x > 0) {
          this.velocity.x = 0;
        } else if ((i === 5 || i === 6 || i === 7) && this.velocity.x < 0) {
          this.velocity.x = 0;
        }
        if(i == 8 && this.velocity.y < 0) {
            this.velocity.y = 0;
            this.canJump = true;
        }
      }
    }
};
Player.prototype.keyUp = keyCode('W');
Player.prototype.keyDown = keyCode('S');
Player.prototype.keyLeft = keyCode('A');
Player.prototype.keyRight = keyCode('D');
Player.prototype.keyJump = keyCode(' ');
Player.prototype.updatePlayer = function(delta) {
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;

    this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    if ( keys[this.keyUp] ) this.velocity.z -= 400.0 * delta;
    if ( keys[this.keyDown] ) this.velocity.z += 400.0 * delta;
    if ( keys[this.keyLeft] ) this.velocity.x -= 400.0 * delta;
    if ( keys[this.keyRight] ) this.velocity.x += 400.0 * delta;
    if( keys[this.keyJump] ) {
        if ( this.canJump === true ) this.velocity.y += 550;
        this.canJump = false;
    }

    /*if ( isOnObject === true ) {
        this.velocity.y = Math.max( 0, this.velocity.y );

        this.canJump = true;
    }*/
    this.collision();

    this.controls.getObject().translateX( this.velocity.x * delta );
    this.controls.getObject().translateY( this.velocity.y * delta );
    this.controls.getObject().translateZ( this.velocity.z * delta );

    if ( this.controls.getObject().position.y < 10 ) {

        this.velocity.y = 0;
        this.controls.getObject().position.y = 10;

        this.canJump = true;

    }
}
var isOnObject, i = false;


function NPC(descr) {
/*
    // Diagnostics to check inheritance stuff
    this._NPCProperty = true;
    console.dir(this);
*/
this.setup(descr);

}
NPC.prototype.setup = function (descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
};
NPC.prototype.radius = 1;
NPC.prototype.height = 2;
NPC.prototype.caster = null;
NPC.prototype.mesh = null;
NPC.prototype.rays = [
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(1, 0, 1),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(1, 0, -1),
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(-1, 0, -1),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(-1, 0, 1),
    new THREE.Vector3(0, -1, 0)
];
NPC.prototype.canJump = true;
NPC.prototype.velocity = new THREE.Vector3();
NPC.prototype.collision = function () {
    //'use strict';
    var collisions, i,
      // Maximum distance from the origin before we consider collision
      distance = 32;
    // For each ray
    for (i = 0; i < this.rays.length; i += 1) {
        // We reset the this.caster to this direction
        this.caster.set(this.mesh.position, this.rays[i]);
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
        }
        if(i == 8 && this.velocity.y < 0) {
            if(collisions.length > 0 && collisions[0].distance <= 100) {
                this.velocity.y = 0;
                this.canJump = true;
                break;
            }
        }
    }
};
NPC.prototype.randomizeMovement = function(delta) {
    this.velocity.x = (Math.random() * 20-10)*delta;
    this.velocity.y = (Math.random() * 4 - 6)*delta;
    this.velocity.z = (Math.random() * 20-10)*delta;
};
NPC.prototype.updateNPC = function(delta) {
    var tempmesh = this.mesh;

    this.velocity.y -= 9.8 * 100.0; // 100.0 = mass
    this.randomizeMovement(delta);

    //this.collision();

    this.mesh.translateX( this.velocity.x );
    this.mesh.translateY( this.velocity.y );
    this.mesh.translateZ( this.velocity.z );

    if ( this.mesh.position.y < 10 ) {

        this.velocity.y = 0;
        this.mesh.position.y = 10;

        this.canJump = true;

    }
};

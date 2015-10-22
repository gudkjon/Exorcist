function wall(descr) {
	this.setup();
}

wall.prototype.setup = function (descr) {
    // Apply all setup properies from the (optional) descriptor
	for (var property in descr) {
	this[property] = descr[property];
	}
	var test = new THREE.BoxGeometry( 50, 50, 10);
	var materialTest = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	var testMesh = new THREE.Mesh( test, materialTest);
	//testMesh.position.x = testMesh.position.x +30;
	//testMesh.position.z = testMesh.position.z +30;
	testMesh.position.y = testMesh.position.y +25;
	scene.add( testMesh ) ;
	objects.push( testMesh );

	var test2 = new THREE.BoxGeometry( 50, 50, 10);
	var materialTest2 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	var testMesh2 = new THREE.Mesh( test, materialTest2);
	testMesh2.position.y = testMesh2.position.y +25;
	testMesh2.position.x = testMesh2.position.x +50;
	scene.add( testMesh2 ) ;
	objects.push( testMesh2 );
};
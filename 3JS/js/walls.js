function walls(descr) {
	this.setup();
}

walls.prototype.setup = function (descr) {
    // Apply all setup properies from the (optional) descriptor
	for (var property in descr) {
	this[property] = descr[property];
	}
	/*
	geom: {xv:50,yv: 50,zv: 10},
	loca: this.location
	*/
	//createWalls();
	/*
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
	testMesh2.rotateY(Math.PI / 2);
	scene.add( testMesh2 );
	objects.push( testMesh2 );

	var col = new THREE.Color("rgb(0, 0, 255)");
	var test3 = new THREE.BoxGeometry( 50, 50, 10);
	var materialTest3 = new THREE.MeshBasicMaterial( { color: col } );
	var testMesh3 = new THREE.Mesh( test, materialTest3);
	testMesh3.position.y = testMesh3.position.y +25;
	testMesh3.position.x = testMesh3.position.x -50;
	testMesh3.rotateY(Math.PI / 2);
	scene.add( testMesh3 );
	objects.push( testMesh3 );
	*/
};

walls.prototype.test = function(){
	console.log("createWalls succesfuly called");
	var geo1 = new THREE.BoxGeometry( this.xv, this.yv, this.zv );
	var material1 = new THREE.MeshBasicMaterial({ color: 0xffffff });
	var mesh1 = new THREE.Mesh( geo1, material1);
	scene.add(mesh1);
	objects.push(mesh1);

	/*
	var test = new THREE.BoxGeometry( 50, 50, 10);
	var materialTest = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	var testMesh = new THREE.Mesh( test, materialTest);
	//testMesh.position.x = testMesh.position.x +30;
	//testMesh.position.z = testMesh.position.z +30;
	testMesh.position.y = testMesh.position.y +25;
	scene.add( testMesh ) ;
	objects.push( testMesh );
	*/
}

walls.prototype.rays = [
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
function iterGame() {
	update();
	render();
	requestAnimationFrame( iterGame );
}
function update() {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
}
function render() {
	renderer.render( scene, camera );
}
iterGame();
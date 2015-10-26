function iterGame() {

	requestAnimationFrame( iterGame );
	update();
	render();
}
//var prevTime = performance.now();
function update() {
	//if ( controlsEnabled ) {
		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;
		npc.updateNPC(delta);
		prevTime = time;
	//}
}
function render() {
	renderer.render( scene, camera );
}
iterGame();
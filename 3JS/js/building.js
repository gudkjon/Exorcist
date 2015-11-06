function building(descr) {
	this.setup();
}

building.prototype.setup = function (descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
};


building.prototype.location = [0, 0, 0];
building.prototype.doors = ["true"];
building.prototype.npcsInside = ["true"];
building.prototype.playersInside = ["true"];
building.prototype.containers = ["true"];
building.prototype.updateBuilding = function(delta){
	return true;
};

building.prototype.walls = new walls(
	{
		xv:50,
		yv: 50,
		zv: 10,
		loca: this.location
	}
);


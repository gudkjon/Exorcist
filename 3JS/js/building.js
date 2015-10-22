function building(descr) {
	this.setup();
}

building.prototype.setup = function (descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
};

var w = new wall();
building.prototype.location = ["X", "Y", "Z"];
building.prototype.walls = ["true", "true", "true", "true", "true"];
building.prototype.doors = ["true"];
building.prototype.npcsInside = ["true"];
building.prototype.playersInside = ["true"];
building.prototype.containers = ["true"];
building.prototype.updateBuilding = function(delta){
	return true;
};



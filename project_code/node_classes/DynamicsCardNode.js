
var DynamicsCardNode = function() {

};

var EventEmitter = require('events').EventEmitter;

var p = DynamicsCardNode.prototype = new EventEmitter();

p.setup = function(aUniqueName, aCardData, aUpdateFunction, aExpiryInterval) {

	this.name = aUniqueName;
	this.description = aCardData.description;
	this.type = aCardData.type;
	this.expiryTime = Date.now() + aExpiryInterval;
	this.updateCallback = aUpdateFunction;

	this.connectedClients = [];



	// set automatic expiry callback if there is one
	if (aExpiryInterval > 0)
		setTimeout(this._onExpiry.bind(this), aExpiryInterval);

};

p.setState = function(aData, aFromUser){

	try {
		this.updateCallback.call(this, aData, aFromUser);	
	} catch(e){

		console.log("DynamicsCardNode :: Error calling update callback : ", e);

	}

	this.emit('stateChanged', aData);

};

p.clientConnect = function(aClientName){

	this.connectedClients.push(aClientName);

};

p.clientDisconnect = function(aClientName){

	var index = this.connectedClients.indexOf(aClientName);
	if (index > 0){
		this.connectedClients.splice(index, 1);
	}

}

p.expire = function() {
	// forces an expire event, e.g. when the song changes
	this._onExpiry();
}

p._onExpiry = function() {

	console.log("DynamicsCardNode :: " + this.name + " expired");

	this.emit('expired', this.name);
};


module.exports = DynamicsCardNode;

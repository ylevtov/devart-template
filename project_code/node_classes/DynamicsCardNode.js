
var DynamicsCardNode = function() {

	this.connectedClients = [];

};

var EventEmitter = require('events').EventEmitter;

var p = DynamicsCardNode.prototype = new EventEmitter();

p.setup = function(aUniqueName, aCardData, aExpiryInterval, aMidiInterface) {

	this.name = aUniqueName;
	this.description = aCardData.description;
	this.type = aCardData.type;
	this.cardData = aCardData;
	this.expiryTime = Date.now() + aExpiryInterval;
	this.expiryInterval = aExpiryInterval;
	this.midiInterface = aMidiInterface;

	this.hasBeenAltered = false;

	// set automatic expiry callback if there is one
	// if (aExpiryInterval > 0)
	// 	setTimeout(this._onExpiry.bind(this), aExpiryInterval);

};

p.setState = function(aData, aFromUser){

	try {
		this._update(aData, aFromUser);	
	} catch(e){

		console.log("DynamicsCardNode :: Error calling update callback : ", e);

	}

	this.emit('stateChanged', aData);

};

p._update = function(aData, aFromUser){

	// override this method

};

p.clientCardUpdate = function(aData){

	this.emit('clientCardUpdate', { name : this.name, data : aData});
};

p.clientConnect = function(aClientObject){

	console.log("DynamicsCardNode :: client connected  :" + aClientObject.username);

	this.connectedClients.push(aClientObject);

};

p.clientDisconnect = function(aClientObject){

	var index = this.connectedClients.indexOf(aClientObject);
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

var DynamicsCardNode = require('../DynamicsCardNode.js');


var DynamicsCardNodeMomentaryAcceleration = function() {

	this._timerClientUpdateBound = this._timerClientUpdate.bind(this);
	this.timeSinceFirstInteraction = 0;
	this.clientUpdateInterval = 100;

	this.clientUpdateIntervalId = -1;
};


var p = DynamicsCardNodeMomentaryAcceleration.prototype = new DynamicsCardNode();
var s = DynamicsCardNode.prototype;

p.setup = function(aUniqueName, aCardData, aExpiryInterval, aMidiInterface) {

	s.setup.call(this, aUniqueName, aCardData, aExpiryInterval, aMidiInterface);

};

p._update = function(aData, aFromUser){

	console.log("DynamicsCardNodeMomentaryAcceleration :: status change from user : " + aData);

	// super simple for now
	this.midiInterface.sendMessage(this.cardData.midimessage_1, this.cardData.midimessage_2, aData);

	if (!this.hasBeenAltered){
		this.hasBeenAltered = true;		

		this.clientUpdateIntervalId =  setInterval(this._timerClientUpdateBound, this.clientUpdateInterval);
	}
	

};

p._timerClientUpdate = function() {

	this.timeSinceFirstInteraction += this.clientUpdateInterval;

	var value = this.timeSinceFirstInteraction / this.expiryInterval;

	console.log("DynamicsCardNodeMomentaryAcceleration :: " + this.name + " updating client " + value);



	this.clientCardUpdate(value);

	if (this.timeSinceFirstInteraction > this.expiryInterval){

		clearInterval(this.clientUpdateIntervalId);

		this.expire();
	}

};


module.exports = DynamicsCardNodeMomentaryAcceleration;

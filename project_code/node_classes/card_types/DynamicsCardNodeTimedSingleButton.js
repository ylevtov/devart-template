var DynamicsCardNode = require('../DynamicsCardNode.js');


var DynamicsCardNodeTimedSingleButton = function() {

	this._timerClientUpdateBound = this._timerClientUpdate.bind(this);
	this.timeSinceFirstInteraction = 0;
	this.clientUpdateInterval = 100;

	this.clientUpdateIntervalId = -1;
};


var p = DynamicsCardNodeTimedSingleButton.prototype = new DynamicsCardNode();
var s = DynamicsCardNode.prototype;

p.setup = function(aUniqueName, aCardData, aExpiryInterval, aMidiInterface) {

	s.setup.call(this, aUniqueName, aCardData, aExpiryInterval, aMidiInterface);

};

p._update = function(aData, aFromUser){

	console.log("DynamicsCardNodeTimedSingleButton :: status change from user : " + aData);

	// super simple for now
	this.midiInterface.sendMessage(this.cardData.midimessage_1, this.cardData.midimessage_2, this.cardData.midimessage_3);

	if (!this.hasBeenAltered){
		this.hasBeenAltered = true;	

		this.clientUpdateIntervalId =  setInterval(this._timerClientUpdateBound, this.clientUpdateInterval);
	}
	

};

p._timerClientUpdate = function() {

	this.timeSinceFirstInteraction += this.clientUpdateInterval;

	var value = this.timeSinceFirstInteraction / this.expiryInterval;

	console.log("DynamicsCardNodeTimedSingleButton :: " + this.name + " updating client " + value);



	this.clientCardUpdate(value);

	if (this.timeSinceFirstInteraction > this.expiryInterval){

		clearInterval(this.clientUpdateIntervalId);

		// clear the value
		this.midiInterface.sendMessage(this.cardData.midimessage_1, this.cardData.midimessage_2, 0);

		this.expire();
	}

};


module.exports = DynamicsCardNodeTimedSingleButton;


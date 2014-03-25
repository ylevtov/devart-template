var DynamicsCardNode = require('../DynamicsCardNode.js');


var DynamicsCardNodeTimedSingleButton = function() {

};


var p = DynamicsCardNodeTimedSingleButton.prototype = new DynamicsCardNode();
var s = DynamicsCardNode.prototype;

p.setup = function(aUniqueName, aCardData, aExpiryInterval, aMidiInterface) {

	s.setup.call(this, aUniqueName, aCardData, aExpiryInterval, aMidiInterface);

};

p._update = function(aData, aFromUser){

	
	// super simple for now
	this.midiInterface.sendMessage(this.cardData.midimessage_1, this.cardData.midimessage_2, this.cardData.midimessage_3);

	// send the cc again with 0 as the last arg to turn it off

	setTimeout(function() {

		console.log("turning off timed control");

		this.midiInterface.sendMessage(this.cardData.midimessage_1, this.cardData.midimessage_2, 0);
	
	}.bind(this), 5000);

};



module.exports = DynamicsCardNodeTimedSingleButton;

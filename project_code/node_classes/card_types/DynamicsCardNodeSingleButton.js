var DynamicsCardNode = require('../DynamicsCardNode.js');


var DynamicsCardNodeSingleButton = function() {

};


var p = DynamicsCardNodeSingleButton.prototype = new DynamicsCardNode();
var s = DynamicsCardNode.prototype;

p.setup = function(aUniqueName, aCardData, aExpiryInterval, aMidiInterface) {

	s.setup.call(this, aUniqueName, aCardData, aExpiryInterval, aMidiInterface);

};

p._update = function(aData, aFromUser){

	// super simple for now
	this.midiInterface.sendMessage(this.cardData.midimessage_1, this.cardData.midimessage_2, this.cardData.midimessage_3);

};



module.exports = DynamicsCardNodeSingleButton;

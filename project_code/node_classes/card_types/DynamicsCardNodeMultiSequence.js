var DynamicsCardNode = require('../DynamicsCardNode.js');


var DynamicsCardNodeMultiSequence = function() {

	this.numClientsInSequence = 4;
	this.sequence = "";
	this.codeForClient = [];

	this.receivedSequence = "";
};


var p = DynamicsCardNodeMultiSequence.prototype = new DynamicsCardNode();
var s = DynamicsCardNode.prototype;

p.setup = function(aUniqueName, aCardData, aExpiryInterval, aMidiInterface) {

	s.setup.call(this, aUniqueName, aCardData, aExpiryInterval, aMidiInterface);

	this.isMultiUserCard = true;

	var codes = [
		"A", "B", "C", "D"
	];

	function randOrd(){
	  return (Math.round(Math.random())-0.5);
	}

	codes.sort(randOrd);

	for (var i=0; i< this.numClientsInSequence; i++){

		this.sequence += i + codes[i];
		this.codeForClient.push(codes[i]);
	}

	console.log("DynamicsCardNodeMultiSequence :: created sequence ", this.sequence);

};




p._update = function(aData, aFromUser){


	this.receivedSequence += aData;

	if (this.receivedSequence.indexOf(this.sequence) != -1){

		console.log("DynamicsCardNodeMultiSequence :: RECEIVED CORRECT SEQUENCE");
		
		// super simple for now
		this.midiInterface.sendMessage(this.cardData.midimessage_1, this.cardData.midimessage_2, this.cardData.midimessage_3);

		this.expire();

	} else {

		console.log("DynamicsCardNodeMultiSequence :: No sequence yet, current user seq : " + this.receivedSequence + " searching for " + this.sequence);

	}


	

};

p.clientConnect = function(aClientObject){

	s.clientConnect.call(this, aClientObject);

	var whichClient = this.connectedClients.length - 1;
	var codeForClient = this.codeForClient[whichClient];

	console.log("sending code " + codeForClient + " to client " + whichClient);

	aClientObject._cardClientUpdate({ 
		"name" : this.name, 
		"data" : {	
			"order" : whichClient,
			"code" : codeForClient
				}
			});

}



module.exports = DynamicsCardNodeMultiSequence;

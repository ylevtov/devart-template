
var DynamicsClientNode = function(aSocket, aUsername) {

	this.socket = aSocket;
	this.username = aUsername;
	this.connectedTimestamp = Date.now();
	this.lastLevelUpTimestamp = this.connectedTimestamp;

	this.currentLevel = 0;
	this.activeCards = {};

	this.socket.on('disconnect', this._didDisconnect.bind(this));
	this.socket.on('cardAltered', this._didAlterCard.bind(this));

};

var EventEmitter = require('events').EventEmitter;

var p = DynamicsClientNode.prototype = new EventEmitter();

p.assignCard = function(aCard){

	this.activeCards[aCard.name] = aCard;
	aCard.on('expired', this._cardExpired.bind(this));

	this.socket.emit("assignCard", {
		name : aCard.name,
		description : aCard.description,
		type : aCard.type
	});

};

p.setLevel = function(aNewLevel) {
	this.lastLevelUpTimestamp = Date.now();
	this.currentLevel = aNewLevel;
	console.log("DynamicsClientNode :: setting user " + this.username + " to new level " + aNewLevel);

};

p.beat = function(aValue){

	this.socket.emit('beat', aValue);

};

p.otherClientStateChanged = function(aData){

	this.socket.emit('otherClientStateChanged', aData);

};

p._cardExpired = function(aName){

	delete this.activeCards[aName];

	this.socket.emit('cardExpired', aName);

}

p._didAlterCard = function(aData){

	var CardName = aData.name;
	var newCardState = aData.state;
	var cardAltered;
	if (this.activeCards[CardName]){

		cardAltered = this.activeCards[CardName];

		console.log("DynamicsClientNode :: user " + this.username + " setting Card " + CardName + " to state ", newCardState);

		cardAltered.setState(newCardState, this.username);

		this.emit('stateChanged', aData);

		if (cardAltered.type == "single"){
			cardAltered.expire();
		}

	} else {

		console.log("DynamicsClientNode :: Error, Card " + CardName + " not found in active Cards for " + this.username);

	}

};


p._didDisconnect = function() {

	
	for (var i=0; i < this.activeCards.length; i++){
		this.activeCards[i].clientDisconnect(this.username);
	}
	

	this.emit('disconnected', this);
};



module.exports = DynamicsClientNode;

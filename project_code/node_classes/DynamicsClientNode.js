
var DynamicsClientNode = function(aSocket, aUsername) {

	this.socket = aSocket;
	this.username = aUsername;
	this.connectedTimestamp = Date.now();
	this.lastLevelUpTimestamp = this.connectedTimestamp;

	this.hasMultiUserCard = false;

	this.currentLevel = 0;
	this.activeCards = {};

	
	this._cardExpiredBound = this._cardExpired.bind(this);
	this._cardClientUpdateBound = this._cardClientUpdate.bind(this);
	this._clientDisconnectBound = this._didDisconnect.bind(this);
	this._cardAlteredBound  = this._didAlterCard.bind(this);

	this.socket.on('disconnect', this._clientDisconnectBound);
	this.socket.on('cardAltered', this._cardAlteredBound);

};

var EventEmitter = require('events').EventEmitter;

var p = DynamicsClientNode.prototype = new EventEmitter();

p.assignCard = function(aCard){

	console.log(this.activeCards);

	console.log("Username : " + this.username + " assigned card : " + aCard.name);

	if (this.hasMultiUserCard) {
		console.log("This user already has a multi-user card, not assigning any more");
		return;

	}

	if (aCard.isMultiUserCard){
		this.hasMultiUserCard = true;
	}

	this.activeCards[aCard.name] = aCard;
	this.activeCards[aCard.name].once('expired', this._cardExpiredBound);
	this.activeCards[aCard.name].on('clientCardUpdate', this._cardClientUpdateBound);

	this.socket.emit("assignCard", {
		name : aCard.name,
		description : aCard.description,
		type : aCard.type
	});

	aCard.clientConnect(this);

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

p._cardClientUpdate = function(aData){

	this.socket.emit('clientCardUpdate', aData);

}

p._cardExpired = function(aName){

	var expiredCard = this.activeCards[aName];

	if (expiredCard){

		console.log("DynamicsClientNode :: card " + aName + " expired");

		this.socket.emit('cardExpired', aName);

		if (expiredCard.isMultiUserCard){
			this.hasMultiUserCard = false;
		}
		
		expiredCard.removeListener("expired", this._cardExpiredBound);
		expiredCard.removeListener('clientCardUpdate', this._cardClientUpdateBound);

		expiredCard.clientDisconnect(this);

		delete this.activeCards[aName];

	}


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

			console.log("Immediately expiring card : " + cardAltered.name);

			cardAltered.expire();
		}

	} else {

		console.log("DynamicsClientNode :: Error, Card " + CardName + " not found in active Cards for " + this.username);

	}

};


p._didDisconnect = function() {

	this.socket.removeListener('disconnect', this._clientDisconnectBound);
	
	for (var i=0; i < this.activeCards.length; i++){
		this.activeCards[i].clientDisconnect(this.username);
	}
	

	this.emit('disconnected', this);
};



module.exports = DynamicsClientNode;

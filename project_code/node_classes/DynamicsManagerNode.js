var DynamicsClient = require('./DynamicsClientNode.js');
var DynamicsCardNode = require('./DynamicsCardNode.js');
var DynamicsMidiInterface = require("./DynamicsMidiInterface.js");

var DynamicsCardNodeSingleButton = require("./card_types/DynamicsCardNodeSingleButton.js");
var DynamicsCardNodeTimedSingleButton = require("./card_types/DynamicsCardNodeTimedSingleButton.js");
var DynamicsCardNodeMomentaryAcceleration = require("./card_types/DynamicsCardNodeMomentaryAcceleration.js");
var DynamicsCardNodeMultiSequence = require("./card_types/DynamicsCardNodeMultiSequence.js");

var dynamicsData = require("../data/DynamicsData.json");

var MULTI_CARD_NUM_USERS = 4;

var DynamicsManagerNode = function() {

	this.midiInterface = new DynamicsMidiInterface();
	this.midiInterface.connectToPort();

	this.connectedClients = [];
	this.activeCards = [];

	this.cardsPerLevel = [];

	this.controlData = dynamicsData;
	this.currentSong = null;
	this.currentSongIndex = -1;
	this.numSongs = dynamicsData.songs.length-1;
	this.lastSongStartTime = null;
	this.canChangeSong = true;


	this._clientDisconnectedBound = this._clientDisconnected.bind(this);
	this._clientStateChangedBound = this._clientStateChanged.bind(this);

	setInterval(this._checkClientLevels.bind(this), 5000);
	// setInterval(this._checkSongStatus.bind(this), 5000);

	this._startNextSong();
};

var EventEmitter = require('events').EventEmitter;

var p = DynamicsManagerNode.prototype = new EventEmitter();

p.addUser = function(aSocket, aUsername){

	console.log("DynamicsManagerNode :: adding new user : " + aUsername);

	var newClient = new DynamicsClient(aSocket, aUsername);

	this.connectedClients.push(newClient);

	newClient.on('disconnected', this._clientDisconnectedBound);
	newClient.on('stateChanged', this._clientStateChangedBound);

	this._handleClientLevelUpgrade(newClient);

};



p._clientDisconnected = function(aClientObject){

	aClientObject.removeListener("disconnected", this._clientDisconnectedBound);
	aClientObject.removeListener("stateChanged", this._clientStateChangedBound);
	
	var clientIndex = -1;
	for (var i=0; i< this.connectedClients.length; i++){

		var client = this.connectedClients[i];

		if (client.username == aClientObject.username){
			
			clientIndex = i;
			break;
		}

	}


	if (clientIndex != -1){
		this.connectedClients.splice(clientIndex, 1);



	} else {
		console.log("DynamicsManagerNode :: ERROR, could not find ", aClientObject.username, " in connected clients list" );

	}

};

p._clientStateChanged = function(aData){

	// notifies all clients when another client has changed their state - for visualisations

	for (var i=0; i < this.connectedClients.length; i++){
		this.connectedClients[i].otherClientStateChanged(aData);
	}

};

p._checkClientLevels = function(){

	var timeNow = Date.now();
	var client, currentClientLevel, durationAtInterval;

	var levelIntervals = DynamicsManagerNode.LEVEL_INTERVALS_SECONDS;

	for (var i=0; i < this.connectedClients.length; i++){

		client = this.connectedClients[i];
		currentClientLevel = client.currentLevel;

		durationAtInterval = timeNow - client.lastLevelUpTimestamp;

		console.log("Client " + client.username + " duration at level : " + durationAtInterval);

		if (currentClientLevel < levelIntervals.length - 1){

			// if we're below the total number of levels, and the client has been active for long enough
			// we increment their level by 1

			if ((durationAtInterval / 1000) > levelIntervals[currentClientLevel]){	

				console.log("DynamicsManagerNode :: upgrading client " + client.username + " to level " + (currentClientLevel + 1));
				client.setLevel(currentClientLevel + 1);

				this._handleClientLevelUpgrade(client);
			}

		}
	}
};


p._handleClientLevelUpgrade = function(aClient) {

	// Main Card assigning logic
	
	var currentLevel = aClient.currentLevel;

	// DEBUG : keep everything on level 0

	currentLevel = 0;

	// DEBUG : reload song data

	this._reloadDynamicsData();
	this.controlData = dynamicsData;
	this.currentSong = this.controlData.songs[this.currentSongIndex];
	this._loadCardsForLevel();



	var availableCards = this.cardsPerLevel[currentLevel];
	
	// for now, just take a random card and assign it to the client

	if (!availableCards){
		console.log("DynamicsManagerNode :: No Available Cards for level " + currentLevel);
		return;
	}

	var hasValidCard = false;
	var cardIndex, newCardData;

	while(!hasValidCard){
		cardIndex = getRandomInt(0, availableCards.length-1);
		newCardData = availableCards[cardIndex];

		if (newCardData.type == "multi-sequence")
			hasValidCard = this._canSupportMultiCard();
		else
			hasValidCard = true;
	}



	var newCardObject;

	switch(newCardData.type) {

		case "single":

		case "toggle":
			newCardObject = new DynamicsCardNodeSingleButton();
		break;

		case "timed":
			newCardObject = new DynamicsCardNodeTimedSingleButton();

		break;

		case "momentary-accel":

			newCardObject = new DynamicsCardNodeMomentaryAcceleration();

		break;

		case "multi-sequence":

			newCardObject = new DynamicsCardNodeMultiSequence();

		break;

	}

	

	var newCardName = newCardData.name + "-" + guid();

	newCardObject.setup(newCardName, newCardData, newCardData.expiry, this.midiInterface);
	
	console.log("DynamicsManagerNode :: creating new card for client " + aClient.username + " : " + newCardName);

	aClient.assignCard(newCardObject);


	// SOME HORRIBLE CODE FOR MULTI USER SEQUENCES

	if (newCardData.type == "multi-sequence"){

		var currentClientIndex = this.connectedClients.indexOf(aClient);
		var availableClients = [];
		for (var i=0; i < this.connectedClients.length; i++){
			if ((i != currentClientIndex) && !this.connectedClients[i].hasMultiUserCard){
				availableClients.push(this.connectedClients[i]);
			}
		}

		function randOrd(){
		  return (Math.round(Math.random())-0.5);
		} 

		availableClients.sort(randOrd);

		for (var i=0; i < MULTI_CARD_NUM_USERS-1; i++){

			availableClients[i].assignCard(newCardObject);

		}

	}

};

p._canSupportMultiCard = function() {

	var availableClients = [];
	for (var i=0; i < this.connectedClients.length; i++){
		if (!this.connectedClients[i].hasMultiUserCard){
			availableClients.push(this.connectedClients[i]);
		}
	}

	if (availableClients.length >= MULTI_CARD_NUM_USERS)
		return true;
	else
		return false;
}


p._checkSongStatus = function() {

	var currentDurationMS = this.currentSong.duration_minutes * 60 * 1000;
	var timeDiff = Date.now() - this.lastSongStartTime;

	if (timeDiff > currentDurationMS) {
		this._startNextSong();
	}

};


p._startNextSong = function() {

	console.log("DynamicsManagerNode :: Starting next song");

	// deactivate all cards 

	// TODO - dont' deactivate master cards

	for (var i=0; i< this.activeCards.length; i++){
		this.activeCards[i].expire();
	}

	var nextSongIndex = this.currentSongIndex + 1;
	if (this.currentSongIndex >= this.numSongs) this.currentSongIndex = 0;

	var nextSong = this.controlData.songs[nextSongIndex];

	// TODO : implement start song MIDI instructions

	// TODO : implement stop song MIDI instructions	

	this.currentSongIndex = nextSongIndex;
	this.currentSong = nextSong;

	console.log("DynamicsManagerNode :: starting song index " + this.currentSongIndex);

	this._loadCardsForLevel();
	
	this.lastSongStartTime = Date.now();

};

p._loadCardsForLevel = function() {

	this.cardsPerLevel = {};
	for (var i=0; i < this.currentSong.cards.length; i++){
		var card = this.currentSong.cards[i];
		var cardLevel = card.level;

		if (!this.cardsPerLevel[cardLevel]) this.cardsPerLevel[cardLevel] = [];

		// console.log("adding card " + card.name + " for song " + this.currentSong.name + " at level " + card.level);

		this.cardsPerLevel[cardLevel].push(card);

	}

};

p._reloadDynamicsData = function() {

	for (var cacheIndex in require.cache){
		if (cacheIndex.indexOf("DynamicsData.json") != -1){
			delete require.cache[cacheIndex];
		}
	}

	dynamicsData = require("../data/DynamicsData.json");	
}


DynamicsManagerNode.LEVEL_INTERVALS_SECONDS = [10, 10, 10, 10, 10, 10];


function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = DynamicsManagerNode;

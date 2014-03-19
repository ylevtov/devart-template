var midi = require("midi");


var DynamicsMidiInterface = function() {

	this.midiOutput = new midi.output();

};

var EventEmitter = require('events').EventEmitter;

var p = DynamicsMidiInterface.prototype = new EventEmitter();

p.connectToPort = function() {

	for (var p = 0; p < this.midiOutput.getPortCount(); p++) {
	  midiPortName = this.midiOutput.getPortName(p);
	  if (midiPortName.indexOf("IAC") != -1) {

	    console.log("Opening "+p+" - "+midiPortName);

	    this.midiOutput.openPort(p);

	  }else{

	    console.log("ERROR : Not opening "+p+" - "+midiPortName);
	  }
	}

};

p.sendMessage = function(aMessageNumber, aValue1, aValue2) {

	console.log("DynamicsMidiInterface :: sending midi message : " + aMessageNumber, aValue1, aValue2);

	this.midiOutput.sendMessage([aMessageNumber, aValue1, aValue2]);
}


module.exports = DynamicsMidiInterface;

var osc = require('osc-min');
var dgram = require('dgram');
var udp = dgram.createSocket('udp4');


var DynamicsOSCInterface = function() {

	this.oscOutport = 41234;

	this.socket = dgram.createSocket("udp4", function(msg, rinfo) {

	  var oscIn = osc.fromBuffer(msg);
	  // Receive beats in from Live via OSC
	  if (oscIn.address == "/beat") {
	    var oscInArgs = oscIn.args;
	    var oscInValue = oscInArgs[0].value;
	  
	    this.emit("beat", oscInValue);

	  }else{
	    console.log(oscIn.address);
	  }
	});

	this.socket.bind(9001);

};

var EventEmitter = require('events').EventEmitter;

var p = DynamicsOSCInterface.prototype = new EventEmitter();

p.sendOSC = function(oscAddress, state) {
	var buf;
	if (oscAddress !== undefined) {
		var address = "/" + oscAddress;
		buf = osc.toBuffer({
		  address: address,
		  args: [state]
		});
		// console.log(address, state);
		return udp.send(buf, 0, buf.length, this.oscOutport, "localhost");
	} else {
		return null;
	}
}


module.exports = DynamicsOSCInterface;

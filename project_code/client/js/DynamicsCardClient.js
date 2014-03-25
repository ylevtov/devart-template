(function() {

	var DynamicsCardExpiryClient = window.DynamicsCardExpiryClient;
	
	var DynamicsCardClient = function(aSocket, aName, aType, aDescription) {

		this.element = null;
		this.titleElement = null;
		this.controlElement = null;


		this.socket = aSocket;
		this.name = aName;
		this.type = aType;
		this.description = aDescription;

		this.order = 0;

		this.state = null;

		this.socket.on('cardExpired', this._onCardExpire.bind(this));
		this.socket.on('clientCardUpdate', this.onRemoteUpdate.bind(this));

		this.onAccelChangeBound = this.onAccelChange.bind(this);

	};

	window.DynamicsCardClient = DynamicsCardClient;

	var p = DynamicsCardClient.prototype;


	p.show = function(aCardContainerElement) {

		console.log("DynamicsCardClient :: created new card : " + this.name);

		this.element = document.createElement("div")
		this.element.className= "card";
		this.element.setAttribute("id", this.name);

		

		switch(this.type){

			case "single":

				this.controlElement = document.createElement("a");
				this.controlElement.className = "control hexButton";

				var buttonClickHandler = function() {

					this.state = !this.state;
					this.onStateChange();

					this.element.removeEventListener("click", buttonClickHandler);

				}.bind(this);

				this.element.addEventListener("click", buttonClickHandler);

			break;

			case "momentary-accel":

				this.state = 0;

				this.controlElement = document.createElement("a");
				this.controlElement.className = "control hexButton";

				this.feedbackElement = document.createElement("div");
				this.feedbackElement.className = "feedbackElement";
				this.element.appendChild(this.feedbackElement);

				// window.addEventListener("devicemotion", this.onAccelChangeBound, true);

				this.controlElement.addEventListener("touchstart", function(){

					window.addEventListener("devicemotion", this.onAccelChangeBound, true);

				}.bind(this));

				this.controlElement.removeEventListener("touchout", function(){

					window.removeEventListener("devicemotion", this.onAccelChangeBound, true);

				}.bind(this));

				this.expiryElement = new DynamicsCardExpiryClient();
				this.expiryElement.show(this.element);

				this._doRemoteUpdate = function(aUpdateData){

					this.expiryElement.setValue(aUpdateData);

				}

			break;

			case "multi-sequence":

				this.state = "";
				this.multiSequenceNumber = -1;
				this.multiSequenceCodeToSend = "";

				this.identifier = document.createElement("div");
				this.identifier.className = "multiIdentifier purple";
				this.element.appendChild(this.identifier);

				this.controls = [];
				this.codes = [
					"A", "B", "C", "D"
				];

				// TODO: make this dynamic

				this.controlElement = document.createElement("div");
				this.controlElement.className = "controlsContainer multi";

				for (var i = 0; i < 4; i++){

					var selectedCode = this.codes[i];
					var controlElement = document.createElement("a");
					controlElement.className = "control multi";
					controlElement.innerHTML = selectedCode;

					var that = this;
					controlElement.addEventListener("click", function() {

						var code = this.innerHTML;

						that.state = that.multiSequenceNumber + code;
						that.onStateChange();

					});

					this.controls.push(controlElement);

					this.controlElement.appendChild(controlElement);

				}

				this._doRemoteUpdate = function(aUpdateData){

					// receving instructions from server

					console.log("multi-user, received code data");
					console.log(aUpdateData);

					this.multiSequenceNumber = aUpdateData.order;
					this.multiSequenceCodeToSend = aUpdateData.code;

					var suffix;
					switch(this.multiSequenceNumber){
						case 0:
							suffix = "st";
						break;
						case 1:
							suffix = "nd";
						break;
						case 2:
							suffix = "rd";
						break;	
						default:
							suffix = "th";
						break;

					}

					this.titleElement.innerHTML += "<br/>Press " + this.multiSequenceCodeToSend + " " + (this.multiSequenceNumber + 1) + suffix + " in line";

				}


			break;

		}

		this.element.appendChild(this.controlElement);

		this.titleElement = document.createElement("div");
		this.titleElement.className = "title";
		this.titleElement.innerHTML = this.description;

		this.element.appendChild(this.titleElement);

		aCardContainerElement.appendChild(this.element);

		setTimeout(function() {
			this.element.className = "card active";
		}.bind(this), 100);

	}

	p.setOrder = function(aOrder) {

		console.log("Card : " + this.name + " set to order " + aOrder);

		this.order = aOrder;

		this.element.style.marginTop = this.order * -5 + "%";
		// this.element.style.webkitFilter = (this.order ? "blur(" + this.order * 2 + "px)" : "");
		this.element.style.opacity = Math.max(1 - (this.order / 5), 0);
		this.element.style.webkitTransform = "scale(" + (1 - (this.order * 0.1)) + ")";
		
		
	};

	p.onStateChange = function() {

		console.log("Card : " + this.name + " state changed to " + this.state);

		this.socket.emit('cardAltered', {
			name : this.name,
			state : this.state
		});

	};

	p.onRemoteUpdate = function(aData){

		if (aData.name == this.name){

			console.log("Card : " + this.name + " remotely updated ", aData.data);
			
			this._doRemoteUpdate(aData.data)
		}

		

	};

	p._doRemoteUpdate = function(aUpdateData){

		// override this function

	};


	p.onAccelChange = function(aEvent) {

		var yAxisScaled = event.accelerationIncludingGravity.y/10;

		var midiScaled = Math.floor(Math.min((Math.max(yAxisScaled, 0) * 127), 127));

        this.feedbackElement.innerHTML = midiScaled;

		this.state = midiScaled;

		this.onStateChange();

	};


	p._onCardExpire = function(aData) {

		if (aData == this.name){

				console.log("DynamicsCardClient :: Card " + this.name + " expired");

			this.destroy();

		}

	};

	p.performLayout = function(){

		var cardHeight = this.element.clientHeight;

		if (this.titleElement){

			var minFontSize = (this.titleElement.innerHTML.length > 15) ? 12 : 16;

			this.titleElement.style.fontSize = Math.min(Math.floor(cardHeight / 8), minFontSize) + "px";
		}

	}

	p.destroy = function() {

		this.element.className = "card";
		this.element.style.opacity = 0;
		this.element.style.webkitTransform = "scale(2)";

		// remove all event listeners

		try {
			window.removeEventListener("devicemotion", this.onAccelChangeBound, true);
		} catch(e){
			//
		}

		

		setTimeout(function() {

			this.element.parentElement.removeChild(this.element);

		}.bind(this), 2000);

	};


})();
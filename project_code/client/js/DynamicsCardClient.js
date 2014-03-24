(function() {
	
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

		this.onAccelChangeBound = this.onAccelChange.bind(this);

	};

	window.DynamicsCardClient = DynamicsCardClient;

	var p = DynamicsCardClient.prototype;


	p.show = function(aCardContainerElement) {

		this.element = document.createElement("div")
		this.element.className= "card";
		this.element.setAttribute("id", this.name);

		this.titleElement = document.createElement("div");
		this.titleElement.className = "title";
		this.titleElement.innerHTML = this.description;

		this.element.appendChild(this.titleElement);

		switch(this.type){

			case "button":

				this.controlElement = document.createElement("a");
				this.controlElement.className = "control hexButton";

				this.controlElement.addEventListener("click", function() {

					this.state = !this.state;
					this.onStateChange();

				}.bind(this));

			break;

			case "momentary-accel":

				this.state = 0;

				this.controlElement = document.createElement("a");
				this.controlElement.className = "control hexButton";

				this.feedbackElement = document.createElement("div");
				this.element.appendChild(this.feedbackElement);

				// window.addEventListener("devicemotion", this.onAccelChangeBound, true);

				this.controlElement.addEventListener("touchstart", function(){

					window.addEventListener("devicemotion", this.onAccelChangeBound, true);

				}.bind(this));

				this.controlElement.removeEventListener("touchout", function(){

					window.removeEventListener("devicemotion", this.onAccelChangeBound, true);

				}.bind(this));

			break;

		}

		this.element.appendChild(this.controlElement);

		aCardContainerElement.appendChild(this.element);

	}

	p.reduceOrder = function() {

		this.order--;

		this.element.style.marginTop = this.order * 20 + "px";
		this.element.style.opacity = Math.max(1 + (this.order / 10), 0);

	};

	p.increaseOrder = function() {

		this.order++;

		this.element.style.marginTop = this.order * 20 + "px";
		this.element.style.opacity = Math.max(1 + (this.order / 10), 0);

	}


	p.onStateChange = function() {

		this.socket.emit('cardAltered', {
			name : this.name,
			state : this.state
		});

	};


	p.onAccelChange = function(aEvent) {

		var yAxisScaled = event.accelerationIncludingGravity.y/10;

		var midiScaled = Math.floor(Math.min((Math.max(yAxisScaled, 0) * 127), 127));

        this.feedbackElement.innerHTML = midiScaled;

		this.state = midiScaled;

		this.onStateChange();

	};


	p._onCardExpire = function() {

		console.log("DynamicsCardClient :: Card " + this.name + " expired");

		this.destroy();

	};


	p.destroy = function() {

		$(this.element).fadeOut();

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
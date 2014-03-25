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

		}



		this.element.appendChild(this.controlElement);
		

		aCardContainerElement.appendChild(this.element);
		
		setTimeout(function() {
			this.element.className = "card active";
		}.bind(this), 100)

		console.log("added card : " + this.name);

	}

	p.reduceOrder = function() {

		this.order--;

		this.element.style.marginTop = this.order * 20 + "px";
		this.element.style.webkitTransform = "scale(" + (1 + (this.order * 0.05)) + ")";
		this.element.style.opacity = Math.max(1 + (this.order / 5), 0);

	};

	p.increaseOrder = function() {

		this.order++;
		
		if (this.order > 0) this.order = 0;


		this.element.style.marginTop = this.order * 20 + "px";
		this.element.style.webkitTransform = "scale(" + (1 + (this.order * 0.05)) + ")";
		this.element.style.opacity = Math.max(1 + (this.order / 5), 0);

	}


	p.onStateChange = function() {

		this.socket.emit('cardAltered', {
			name : this.name,
			state : this.state
		});

	};


	p._onCardExpire = function(aData) {

		if (aData == this.name){
			console.log("DynamicsCardClient :: Card " + this.name + " expired");

			this.destroy();
		}
	};


	p.destroy = function() {

		this.element.style.opacity = 0;

		setTimeout(function() {

			if (this.element.parentElement)
				this.element.parentElement.removeChild(this.element);

		}.bind(this), 2000);

	};


})();
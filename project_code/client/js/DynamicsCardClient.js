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


	p._onCardExpire = function() {

		console.log("DynamicsCardClient :: Card " + this.name + " expired");

		this.destroy();

	};


	p.destroy = function() {

		$(this.element).fadeOut();

		setTimeout(function() {

			this.element.parentElement.removeChild(this.element);

		}.bind(this), 2000);

	};


})();
(function() {
	
	var DynamicsCardExpiryClient = function() {

		this.element = document.createElement("div");
		this.element.className = "expiryIndicator";

	};

	window.DynamicsCardExpiryClient = DynamicsCardExpiryClient;

	var p = DynamicsCardExpiryClient.prototype;


	p.show = function(aContainerElement) {

		this.innerElement = document.createElement("div");
		this.innerElement.className = "expiryIndicatorInner";

		this.element.appendChild(this.innerElement);

		aContainerElement.appendChild(this.element);

		this.element.style.opacity = 0;		

	}

	p.setValue = function(aValue){

		this.element.style.opacity = 1;

		console.log("DynamicsCardExpiryClient : setting value : " + aValue);

		this.innerElement.style.width = Math.floor((aValue * 100)) + "%";

	}

	p.destroy = function() {

		setTimeout(function() {

			this.element.parentElement.removeChild(this.element);

		}.bind(this), 100);

	};


})();
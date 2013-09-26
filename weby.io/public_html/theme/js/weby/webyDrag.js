var WebyDrag = function (el) {
	el = $('#workspace');
	var FF = !(window.mozInnerScreenX == null);
	// Used to fine tune dragging speed
	var deltaFactor = 1;
	// Used to fine tune release distance
	var velocityFactor = 0.7;
	// Is drag started
	var drag = false;
	// Last mouse position
	var lastX;
	var lastY;
	// Previous position
	var prevX;
	var prevY;
	// If this is set to true - current animation in progress will be aborted

	var onSelectStart = false;

	this.contentMouseDown = function (event) {
		drag = true;
		stopRelease = true;
		setTimeout(function () {
			stopRelease = false;
		}, 15);
		lastX = prevX = event.clientX;
		lastY = prevY = event.clientY;
	}

	this.contentMouseMove = function (event) {
		if (!drag || !event.which) {
			return;
		}

		App.getContent().addClass('hide-content grabbing');

		var deltaX = (event.clientX - lastX) * deltaFactor;
		var deltaY = (event.clientY - lastY) * deltaFactor;

		el.scrollLeft(el.scrollLeft() - deltaX);
		el.scrollTop(el.scrollTop() - deltaY);

		// Save previous position
		prevX = lastX;
		prevY = lastY;

		// Save where the cursor currently is
		lastX = event.clientX;
		lastY = event.clientY;

		event.stopPropagation();
		event.preventDefault();
	}

	this.stopDrag = function () {
		drag = false;
		App.getContent().removeClass('hide-content grabbing');
	}

	this.contentMouseUp = function (event) {
		if (drag) {
			this.stopDrag();
			//_animate(event);
		}
	}

	this.contentMouseWheel = function (event) {
		stopRelease = true;
		setTimeout(function () {
			stopRelease = false;
		}, 15);
	}

	var _release = function (velocity, elMethod) {
		velocity *= velocityFactor;
		var animateInterval = setInterval(function () {
			if (Math.abs(velocity) < 1 || stopRelease) {
				return clearInterval(animateInterval);
			}
			el[elMethod](el[elMethod]() + (velocity *= 0.96));
		}, 10);
	}

	var _animate = function (event) {
		var velocityX = FF ? prevX - lastX : lastX - event.clientX;
		var velocityY = FF ? prevY - lastY : lastY - event.clientY;

		_release(velocityX, 'scrollLeft');
		_release(velocityY, 'scrollTop');
	}
};

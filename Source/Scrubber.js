Scrubber = function() {
	var Subscrubber = function(options, x, y) {
		for (var key in options)
			if (options.hasOwnProperty(key))
				this[key] = options[key];
		if (x != null || y != null)
			this.handle(x, y);
	};
	if (!this.handle) {
		Subscrubber.prototype = new Scrubber;
		return Subscrubber;
	} else {
		return Subscrubber.apply(this, arguments);
	}
};

Scrubber.prototype.object = true;
Scrubber.prototype.x = null;
Scrubber.prototype.y = null;
Scrubber.prototype.thresholdX = 0;
Scrubber.prototype.thresholdY = 0;
Scrubber.prototype.currentX = 0;
Scrubber.prototype.currentY = 0;
Scrubber.prototype.overflowX = 0;
Scrubber.prototype.overflowY = 0;
Scrubber.prototype.minX = -Infinity;
Scrubber.prototype.minY = -Infinity;
Scrubber.prototype.maxX = Infinity;
Scrubber.prototype.maxY = Infinity;
Scrubber.prototype.setX = null;
Scrubber.prototype.setY = null;
Scrubber.prototype.lockX = false;
Scrubber.prototype.lockY = false;
Scrubber.prototype.startX = null;
Scrubber.prototype.startY = null;
Scrubber.prototype.next = null;
Scrubber.prototype.previous = null;


Scrubber.prototype.handle = function(x, y, event, force) {
	if (x && x.originalEvent) {
		event = x
		x = event.position.x;
		y = event.position.y;
	}
	if (!this.get('object')) return;
	if (y != null) {
		var startY = this.get('startY');
		if (force && startY == null) 
			this.startY = startY = 0;
		if (startY == null) {
			this.startY = startY = y;
		} else {
			y -= startY;
			if (this.y != null 
			|| (Math.abs(y) > Math.abs(this.get('thresholdY')))) {
				if (this.y == null 
				&& (y > 0 ? this.thresholdY > 0 : this.thresholdY < 0))
					this.thresholdY = - this.thresholdY;
				y += this.get('currentY');
				y += this.thresholdY;
				var oY = this.overflowY = Math.max(0, y - this.get('maxY'));
				if (this.overflowY) {
					y = this.maxY;
				} else {
					oY = this.overflowY = Math.min(0, y - this.get('minY'))
					if (this.overflowY)
						y = this.minY
				}
				if (this.y != null || (y != this.maxY && y != this.minY)) {
					this.y = y;
					if (this.setY)
						this.setY(this.y);
				}
			}
		}
	}
	if (x != null) {
		var startX = this.get('startX');
		if (force && startX == null)
			this.startX = startX = 0;
		if (startX == null) {
			this.startX = startX = x;
		} else {
			x -= startX;
			if (this.x != null 
			|| (Math.abs(x) > Math.abs(this.get('thresholdX')))) {
				if (this.x == null 
				&& (x > 0 ? this.thresholdX > 0 : this.thresholdX < 0))
					this.thresholdX = - this.thresholdX;
				x += this.get('currentX');
				x += this.thresholdX;
				var oX = this.overflowX = Math.max(0, x - this.get('maxX'));
				if (this.overflowX) {
					x = this.maxX;
				} else {
					oX = this.overflowX = Math.min(0, x - this.get('minX'))
					if (this.overflowX)
						x = this.minX
				}
				if (this.x != null || (x != this.maxX && x != this.minX)) {
					this.x = x;
					if (this.setX)
						this.setX(this.x);
				}
			}
		}
	}

	if (event 
	&& ((this.lockY && this.y != null) || (this.lockX && this.x != null)))
		event.originalEvent.preventDefault();

	if (this.previous && (oX < 0 || oY < 0))
		this.previous.handle(oX < 0 ? oX : null, oY < 0 ? oY : null, event, true)
	if (this.next && (oX > 0 || oY > 0))
		this.next.handle(oX > 0 ? oX : null, oY > 0 ? oY : null, event, true)
}

Scrubber.prototype.get = function(property) {
	var val = this[property];
	if (typeof val == 'function') {
		val = val.apply(this, Array.prototype.slice.call(arguments, 1));
		if (val != null)
			this[property] = val;
	}
	return val;
}
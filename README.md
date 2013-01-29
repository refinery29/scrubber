=== Scrubber

I developed three projects for refinery29 (pipeline, corporate, slideshow) and each of them involved some scrolling/touch interactions. Slideshow was the hardest, because it combined gestures in two axis with some customization. Mobile carousel is powered by the same code, but has its own behavior (doesnt lock vertical scrolling, while locking horizontal movements).

Scrubbing is a name for a technique that plays animation in real time according to pointer movements. For example scrolling is a form of scrubbing. The concept is simple and usually easy to implement. But there're multiple gotchas that make up for that simplicity:

=== Why

(Jump to code examples: https://gist.github.com/4657637)

1) It's hard to make multiple scrubbers work together.

And example would be a caption in slideshow.

!http://i.imgur.com/DWsxks4.jpg!

Vertical swipe slides the caption out until it hits the limit, and then it start scrolling the content instead all within a single gesture. So a long enough swipe scrubs one thing (panel appearance) and then start scrubbing another thing (scrolling the content).

2) It's hard to calculate pointer movements within scrubbing limits.

Libraries that unify pointer events (like hammer.js) are godsend and save a lot of time. But they work on a low level, so they only calculate movements, that's it. Libraries dont know if a movement actually does something or it's off limit.

Say, there's a box with a vertical scrollbar, and it's current position is at 100px. If a user swipes the box up for 100px, the box scrolls up to 0 and can't go beyond that. If a user does not release the finger and scrolls up 100px more, the box doesnt react, because it can't scroll past 0. But the gesture library still registers the movement as if there was no limit. If a user moves finger 100px down now, it would be reasonable to expect the scrollbar be set at 100px, but in fact it is still at 0. Sometimes the fact that UI does not respond to gestures is disorienting.

Hammer.js is also very naive about detecting a direction of movement. If a user swipes up and down to return to the same exact point where gesture started, hammer will go crazy and detect horizontal movements.

These problems can be solved by wrapping hammer's data and applying all the domain specific logic/restrictions we want.

3) There're no helpers to implement momentum/sticky scrolling out of the box.

Again, using a standalone library for gesture inputs makes developer do all the busywork like velocity calculation, running animation to scrub to the nearest "notch", etc.

So I know exactly what is a good solution to the problem. Following is a proposed API: 

=== Example

	// Scrubber: Animate stuff based on touch input. 
	// Customize scrubbers, set limits, handle stuff dynamically
	// Combine scrubbers together
	 
	var SlideOut = Scrubber({
	  // start only after 15px of movement
	  thresholdY: 15,
		// a callback called on each frame to render the change
		setY: function(y) {
			this.element.marginTop = y + 'px';
		},
		// set a dynamic limit for gesture
		maxY: function() {
			return this.element.offsetHeight;
		},
		// prevent going under 0
		minY: 0
	});
	var ScrollY = Scrubber({
		setY: function(y) {
			this.element.scrollTop = y;
		},
		maxY: function() {
			return this.element.scrollHeight - this.element.offsetHeight;
		},
		minY: 0
	});
	 
	 
	// combine two scrubbers, returns a new scrubber
	SlideScroll = SlideOut.concat(ScrollY);
	 
	// set options for a combinator scrubber 
	// these options can be applied to each scrubber separately
	SlideScroll.setOptions({
		// find element dynamically
		// we dont need to add scrubber for every scrollable element
		// instead we use one and check if pointer was on one of the elements
		// if it was not, we just 
		element: function(event) {
			for (var node = event.target; node; node = node.parentNode) {
				if (node.className == 'caption')
					return node;
			}
		},
		// only handles vertical movements
		axis: 'y',
		// ignore horizontal movements 
		lock: true
	});
	 
	// use hammer to capture pointer events
	hammer.ondragstart = function(event) {
		// handle movement, may return false 
		// (e.g. if movement was not in specific area)
		// all intermediate values are stored in a returned object
		hammer.scrubber = SlideScroll(event);
	 
	}
	 
	hammer.ondrag = function(event) {
		// update scrubber with new values
		if (hammer.scrubber) 
			hammer.scrubber.set(event)
	};
	 
	hammer.ondragend = function(event) {
		// finish scrubber
		if (hammer.scrubber) {
			hammer.scrubber.finish(event)
			delete hammer.scrubber;
		}
	}

1) It allows creating a single scrubber for multiple elements 
2) It allows to calculate scrubbing limits dynamically 
3) It allows combining two or more scrubbers 
4) It encapsulates all the boring stuff and leaves all the fun to developer

So here I'm asking to do this stuff at work part-time. It'll help us a lot in future and also a good thing to release as open source.


=== Inspiration

https://docs.google.com/document/d/1vRUo_g1il-evZs975eNzGPOuJS7H5UBxs-iZmXHux48/edit CSS3 animation scrubbing proposal. Doesnt really help us with anything, but it makes a point that the problem exists and may have a good declarative solution.
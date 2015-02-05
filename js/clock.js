(function() {
	'use strict';

	var Clock = function() { this.init(); };
	var p = Clock.prototype;

	/**
	 * DOM elements
	 */

	/**
	 * Parameters
	 */

	/**
	 * Initialisation
	 */
	p.init = function() {
		p.initPixi();
	};

	/**
	 * Initialisation of pixi
	 */
	p.initPixi = function() {
		p.stage = new PIXI.Stage(0xF0F0F0, true);
		p.renderer = PIXI.autoDetectRenderer(800, 300, {antialias: true});
		document.body.appendChild(p.renderer.view);

		p.createClock();

		requestAnimFrame(p.animate);
	};

	/**
	 * Create clock
	 */
	p.createClock = function() {
		// clock container
		p.clock = new PIXI.DisplayObjectContainer();
		p.clock.x = 100;
		p.clock.y = 100;
		p.stage.addChild(p.clock);
				
		// clock base
		p.base = new PIXI.Graphics();
		p.base.beginFill(0xffffff);
		p.base.drawCircle(0, 0, 50);
		p.clock.addChild(p.base);

		// minute hand
		p.minuteHand = new PIXI.Graphics();
		p.minuteHand.beginFill(0x000000);
		p.minuteHand.drawRect(2, 0, 46, 10);
		p.minuteHand.pivot = new PIXI.Point(0, 5);
		p.minuteHand.rotation = (1/4)*Math.PI;
		p.clock.addChild(p.minuteHand);

		// hour hand
		p.hourHand = new PIXI.Graphics();
		p.hourHand.beginFill(0x000000);
		p.hourHand.drawRect(2, 0, 40, 10);
		p.hourHand.pivot = new PIXI.Point(0, 5);
		p.hourHand.rotation = (3/2)*Math.PI;
		p.clock.addChild(p.hourHand);

		// central screw
		p.centralScrew = new PIXI.Graphics();
		p.centralScrew.beginFill(0x000000);
		p.centralScrew.drawCircle(0, 0, 5);
		p.clock.addChild(p.centralScrew);
	}
	
	/**
	 * Animate
	 */
	 p.animate = function() {
		requestAnimFrame(p.animate);

		p.renderer.render(p.stage);
	};

	window.Clock = Clock;
})();
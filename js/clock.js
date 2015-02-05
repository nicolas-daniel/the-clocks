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
	p.minuteSpeed = 0.04;
	p.hourSpeed = 0.02;
	p.clocksArray = [];

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

		p.createClockGroup(50, 50);

		requestAnimFrame(p.animate);
	};

	/**
	 * Create clock group (2x3 clocks to make 1 number) 
	 */
	p.createClockGroup = function(x, y) {
		// clock group container
		p.clockGroup = new PIXI.DisplayObjectContainer();
		p.clockGroup.x = x;
		p.clockGroup.y = y;
		p.stage.addChild(p.clockGroup);

		// create 2x3 clocks
		for ( var j=0 ; j<3 ; ++j ) {
			for ( var i=0 ; i<2 ; ++i ) {
				p.createClock(p.clockGroup, i, j);
			}
		}
	}

	/**
	 * Create clock
	 */
	p.createClock = function(container, i, j) {
		// clock container
		p.clock = new PIXI.DisplayObjectContainer();
		p.clock.x = 100 * i;
		p.clock.y = 100 * j;
		container.addChild(p.clock);
				
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

		// add minute hand and hour hand into clocks array
		// object 	: (PIXI Graphics Object)
		// speed 	: (Float) speed coef
		// isMoved 	: (Boolean) true if needle curently rotating
		// round 	: (Integer) number of clock round before stop rotating
		// index 	: (Integer) current number of animation
		p.clocksArray.push({
			minute: {
				object: p.minuteHand,
				speed: p.minuteSpeed,
				isMoved: true,
				round: 2,
				index: 1
			},
			hour: {
				object: p.hourHand,
				speed: p.hourSpeed,
				isMoved: true,
				round: 1,
				index: 1
			}
		});
	}
	
	/**
	 * Animate
	 */
	 p.animate = function() {
		requestAnimFrame(p.animate);

		p.updateTime();

		p.renderer.render(p.stage);
	};

	/**
	 * Update time
	 */
	 p.updateTime = function() {
		// make a 2
		for ( var i=0 ; i<p.clocksArray.length ; ++i ) {
			if ( i == 0 ) {
				p.setEastDirection(p.clocksArray[i].hour);
				p.setEastDirection(p.clocksArray[i].minute);
			}
			if ( i == 1 ) {
				p.setSouthDirection(p.clocksArray[i].hour);
				p.setWestDirection(p.clocksArray[i].minute);
			}
			if ( i == 2 ) {
				p.setEastDirection(p.clocksArray[i].hour);
				p.setSouthDirection(p.clocksArray[i].minute);
			}
			if ( i == 3 ) {
				p.setWestDirection(p.clocksArray[i].hour);
				p.setNorthDirection(p.clocksArray[i].minute);
			}
			if ( i == 4 ) {
				p.setEastDirection(p.clocksArray[i].hour);
				p.setNorthDirection(p.clocksArray[i].minute);
			}
			if ( i == 5 ) {
				p.setWestDirection(p.clocksArray[i].hour);
				p.setWestDirection(p.clocksArray[i].minute);
			}
		}
	};	

	/**
	 * Set direction of the needle
	 */
	p.setDirection = function(clock, formule) {
		if ( clock.isMoved && clock.object.rotation < 2 * ( clock.index + clock.round - 1 ) * Math.PI + formule ) {
			clock.object.rotation += clock.speed;
		} else {
			if ( clock.isMoved ) {
				clock.object.rotation = 2 * clock.index * Math.PI + formule;
				clock.index++;
			}
			clock.isMoved = false;
		}	
	}

	/**
	 * Set direction to East
	 */
	p.setEastDirection = function(clock) {
		p.setDirection(clock, 0);
	}

	/**
	 * Set direction to South
	 */
	p.setSouthDirection = function(clock) {
		p.setDirection(clock, Math.PI / 2);
	}

	/**
	 * Set direction to West
	 */
	p.setWestDirection = function(clock) {
		p.setDirection(clock, Math.PI);
	}

	/**
	 * Set direction to North
	 */
	p.setNorthDirection = function(clock) {
		p.setDirection(clock, (3/2)*Math.PI);
	}

	/**
	 * Set direction to North-West
	 */
	p.setNorthWestDirection = function(clock) {
		p.setDirection(clock, (3/4)*Math.PI);
	}

	window.Clock = Clock;
})();
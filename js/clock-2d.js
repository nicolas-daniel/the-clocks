(function() {
	'use strict';

	var Clock2d = function() { this.init(); };
	var p = Clock2d.prototype;

	/**
	 * DOM elements
	 */

	/**
	 * Parameters
	 */
	p.minuteSpeed = 0.04;
	p.hourSpeed = 0.02;
	p.firstHourArray = [];
	p.secondHourArray = [];
	p.firstMinuteArray = [];
	p.secondMinuteArray = [];
	p.currentFirstMinute = 0;
	p.currentSecondMinute = 0;
	p.currentFirstHour = 0;
	p.currentSecondHour = 0;

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

		// create first h ([h]h:mm) : firstHour
		p.createClockGroup(50, 50, p.firstHourArray);

		// create second h (h[h]:mm) : secondHour
		p.createClockGroup(250, 50, p.secondHourArray);
		
		// create first m (hh:[m]m) : firstMinute
		p.createClockGroup(450, 50, p.firstMinuteArray);

		// create second m (hh:m[m]) : secondMinute
		p.createClockGroup(650, 50, p.secondMinuteArray);

		requestAnimFrame(p.animate);
	};

	/**
	 * Create clock group (2x3 clocks to make 1 number) 
	 */
	p.createClockGroup = function(x, y, array) {
		// clock group container
		p.clockGroup = new PIXI.DisplayObjectContainer();
		p.clockGroup.x = x;
		p.clockGroup.y = y;
		p.stage.addChild(p.clockGroup);

		// create 2x3 clocks
		for ( var j=0 ; j<3 ; ++j ) {
			for ( var i=0 ; i<2 ; ++i ) {
				p.createClock(p.clockGroup, i, j, array);
			}
		}
	}

	/**
	 * Create clock
	 */
	p.createClock = function(container, i, j, array) {
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
		p.minuteHand.rotation = (3/4)*Math.PI;
		p.clock.addChild(p.minuteHand);

		// hour hand
		p.hourHand = new PIXI.Graphics();
		p.hourHand.beginFill(0x000000);
		p.hourHand.drawRect(2, 0, 40, 10);
		p.hourHand.pivot = new PIXI.Point(0, 5);
		p.hourHand.rotation = (3/4)*Math.PI;
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
		array.push({
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
		p.time = new Date();
		p.minutes = p.time.getMinutes();
		p.hours = p.time.getHours();
		
		if ( p.minutes !== p.currentMinute ) {
			p.currentMinute = p.minutes;
			
			if ( p.minutes.toString().length > 1 ) {
				p.currentFirstMinute = parseInt(p.minutes.toString().slice(0,1));	
				p.currentSecondMinute = parseInt(p.minutes.toString().slice(1,2));	
			} else {
				if ( p.minutes == 0 ) {
					p.currentFirstMinute = p.minutes;
				}
				p.currentSecondMinute = p.minutes;
			}

			for ( var i=0 ; i<6 ; ++i ) {
				p.secondMinuteArray[i].minute.isMoved = true;
				p.secondMinuteArray[i].hour.isMoved = true;
				p.firstMinuteArray[i].minute.isMoved = true;
				p.firstMinuteArray[i].hour.isMoved = true;
				p.secondHourArray[i].minute.isMoved = true;
				p.secondHourArray[i].hour.isMoved = true;
				p.firstHourArray[i].minute.isMoved = true;
				p.firstHourArray[i].hour.isMoved = true;
			}
		}

		if ( p.hours !== p.currentHour ) {
			p.currentHour = p.hours;
			
			if ( p.hours.toString().length > 1 ) {
				p.currentFirstHour = parseInt(p.hours.toString().slice(0,1));	
				p.currentSecondHour = parseInt(p.hours.toString().slice(1,2));	
			} else {
				if ( p.hours == 0 ) {
					p.currentFirstHour = p.hours;
				}
				p.currentSecondHour = p.hours;
			}

			for ( var i=0 ; i<6 ; ++i ) {
				p.secondMinuteArray[i].minute.isMoved = true;
				p.secondMinuteArray[i].hour.isMoved = true;
				p.firstMinuteArray[i].minute.isMoved = true;
				p.firstMinuteArray[i].hour.isMoved = true;
				p.secondHourArray[i].minute.isMoved = true;
				p.secondHourArray[i].hour.isMoved = true;
				p.firstHourArray[i].minute.isMoved = true;
				p.firstHourArray[i].hour.isMoved = true;
			}
		}

		p.setNumber(p.currentFirstMinute, p.firstMinuteArray);
		p.setNumber(p.currentSecondMinute, p.secondMinuteArray);
		p.setNumber(p.currentFirstHour, p.firstHourArray);
		p.setNumber(p.currentSecondHour, p.secondHourArray);
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
	 * Set direction to South-West
	 */
	p.setSouthWestDirection = function(clock) {
		p.setDirection(clock, (3/4)*Math.PI);
	}

	/**
	 * Set number
	 */
	p.setNumber = function(number, array) {
		if ( number == 0 ) p.setNumberZero(array);
		if ( number == 1 ) p.setNumberOne(array);
		if ( number == 2 ) p.setNumberTwo(array);
		if ( number == 3 ) p.setNumberThree(array);
		if ( number == 4 ) p.setNumberFour(array);
		if ( number == 5 ) p.setNumberFive(array);
		if ( number == 6 ) p.setNumberSix(array);
		if ( number == 7 ) p.setNumberSeven(array);
		if ( number == 8 ) p.setNumberEight(array);
		if ( number == 9 ) p.setNumberNine(array);
	}

	/**
	 * Set number 0
	 */
	p.setNumberZero = function(array) {
		for ( var i=0 ; i<array.length ; ++i ) {
			if ( i == 0 ) {
				p.setEastDirection(array[i].hour);
				p.setSouthDirection(array[i].minute);
			}
			if ( i == 1 ) {
				p.setSouthDirection(array[i].hour);
				p.setWestDirection(array[i].minute);
			}
			if ( i == 2 ) {
				p.setSouthDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 3 ) {
				p.setSouthDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 4 ) {
				p.setEastDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 5 ) {
				p.setWestDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
		}
	}

	/**
	 * Set number 1
	 */
	p.setNumberOne = function(array) {
		for ( var i=0 ; i<array.length ; ++i ) {
			if ( i == 0 || i == 2 || i == 4 ) {
				p.setSouthWestDirection(array[i].hour);
				p.setSouthWestDirection(array[i].minute);
			}
			if ( i == 1 ) {
				p.setSouthDirection(array[i].hour);
				p.setSouthDirection(array[i].minute);
			}
			if ( i == 3 ) {
				p.setSouthDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 5 ) {
				p.setNorthDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
		}
	}

	/**
	 * Set number 2
	 */
	p.setNumberTwo = function(array) {
		for ( var i=0 ; i<array.length ; ++i ) {
			if ( i == 0 ) {
				p.setEastDirection(array[i].hour);
				p.setEastDirection(array[i].minute);
			}
			if ( i == 1 ) {
				p.setSouthDirection(array[i].hour);
				p.setWestDirection(array[i].minute);
			}
			if ( i == 2 ) {
				p.setEastDirection(array[i].hour);
				p.setSouthDirection(array[i].minute);
			}
			if ( i == 3 ) {
				p.setWestDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 4 ) {
				p.setEastDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 5 ) {
				p.setWestDirection(array[i].hour);
				p.setWestDirection(array[i].minute);
			}
		}
	}

	/**
	 * Set number 3
	 */
	p.setNumberThree = function(array) {
		for ( var i=0 ; i<array.length ; ++i ) {
			if ( i == 0 ) {
				p.setEastDirection(array[i].hour);
				p.setEastDirection(array[i].minute);
			}
			if ( i == 1 ) {
				p.setSouthDirection(array[i].hour);
				p.setWestDirection(array[i].minute);
			}
			if ( i == 2 ) {
				p.setEastDirection(array[i].hour);
				p.setEastDirection(array[i].minute);
			}
			if ( i == 3 ) {
				p.setWestDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 4 ) {
				p.setEastDirection(array[i].hour);
				p.setEastDirection(array[i].minute);
			}
			if ( i == 5 ) {
				p.setWestDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
		}
	}

	/**
	 * Set number 4
	 */
	p.setNumberFour = function(array) {
		for ( var i=0 ; i<array.length ; ++i ) {
			if ( i == 0 ) {
				p.setSouthDirection(array[i].hour);
				p.setSouthDirection(array[i].minute);
			}
			if ( i == 1 ) {
				p.setSouthDirection(array[i].hour);
				p.setSouthDirection(array[i].minute);
			}
			if ( i == 2 ) {
				p.setEastDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 3 ) {
				p.setWestDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 4 ) {
				p.setSouthWestDirection(array[i].hour);
				p.setSouthWestDirection(array[i].minute);
			}
			if ( i == 5 ) {
				p.setNorthDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
		}
	}

	/**
	 * Set number 5
	 */
	p.setNumberFive = function(array) {
		for ( var i=0 ; i<array.length ; ++i ) {
			if ( i == 0 ) {
				p.setEastDirection(array[i].hour);
				p.setSouthDirection(array[i].minute);
			}
			if ( i == 1 ) {
				p.setWestDirection(array[i].hour);
				p.setWestDirection(array[i].minute);
			}
			if ( i == 2 ) {
				p.setEastDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 3 ) {
				p.setSouthDirection(array[i].hour);
				p.setWestDirection(array[i].minute);
			}
			if ( i == 4 ) {
				p.setEastDirection(array[i].hour);
				p.setEastDirection(array[i].minute);
			}
			if ( i == 5 ) {
				p.setWestDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
		}
	}

	/**
	 * Set number 6
	 */
	p.setNumberSix = function(array) {
		for ( var i=0 ; i<array.length ; ++i ) {
			if ( i == 0 ) {
				p.setEastDirection(array[i].hour);
				p.setSouthDirection(array[i].minute);
			}
			if ( i == 1 ) {
				p.setWestDirection(array[i].hour);
				p.setWestDirection(array[i].minute);
			}
			if ( i == 2 ) {
				p.setSouthDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 3 ) {
				p.setSouthDirection(array[i].hour);
				p.setWestDirection(array[i].minute);
			}
			if ( i == 4 ) {
				p.setEastDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 5 ) {
				p.setWestDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
		}
	}

	/**
	 * Set number 7
	 */
	p.setNumberSeven = function(array) {
		for ( var i=0 ; i<array.length ; ++i ) {
			if ( i == 0 ) {
				p.setEastDirection(array[i].hour);
				p.setEastDirection(array[i].minute);
			}
			if ( i == 1 ) {
				p.setSouthDirection(array[i].hour);
				p.setWestDirection(array[i].minute);
			}
			if ( i == 2 ) {
				p.setSouthWestDirection(array[i].hour);
				p.setSouthWestDirection(array[i].minute);
			}
			if ( i == 3 ) {
				p.setSouthDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 4 ) {
				p.setSouthWestDirection(array[i].hour);
				p.setSouthWestDirection(array[i].minute);
			}
			if ( i == 5 ) {
				p.setNorthDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
		}
	}

	/**
	 * Set number 8
	 */
	p.setNumberEight = function(array) {
		for ( var i=0 ; i<array.length ; ++i ) {
			if ( i == 0 ) {
				p.setEastDirection(array[i].hour);
				p.setSouthDirection(array[i].minute);
			}
			if ( i == 1 ) {
				p.setSouthDirection(array[i].hour);
				p.setWestDirection(array[i].minute);
			}
			if ( i == 2 ) {
				p.setEastDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 3 ) {
				p.setWestDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 4 ) {
				p.setEastDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 5 ) {
				p.setWestDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
		}
	}

	/**
	 * Set number 9
	 */
	p.setNumberNine = function(array) {
		for ( var i=0 ; i<array.length ; ++i ) {
			if ( i == 0 ) {
				p.setEastDirection(array[i].hour);
				p.setSouthDirection(array[i].minute);
			}
			if ( i == 1 ) {
				p.setSouthDirection(array[i].hour);
				p.setWestDirection(array[i].minute);
			}
			if ( i == 2 ) {
				p.setEastDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 3 ) {
				p.setSouthDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
			if ( i == 4 ) {
				p.setEastDirection(array[i].hour);
				p.setEastDirection(array[i].minute);
			}
			if ( i == 5 ) {
				p.setWestDirection(array[i].hour);
				p.setNorthDirection(array[i].minute);
			}
		}
	}

	window.Clock2d = Clock2d;
})();
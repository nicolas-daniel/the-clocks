(function() {
	'use strict';

	var Clock3d = function(callback) { this.init(function(){callback();}); };
	var p = Clock3d.prototype;

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
	p.init = function(callback) {
		p.initScene(function(){callback();});

		p.initEventListeners();
	};

	/**
	 * Initialisation of event listeners
	 */
	p.initEventListeners = function() {
		document.addEventListener('mousedown', p.onMouseDown);
		document.addEventListener('mousemove', p.onMouseMove);
		document.addEventListener('mouseup', p.onMouseUp);
		window.addEventListener('DOMMouseScroll', p.mousewheel, false);
		window.addEventListener('mousewheel', p.mousewheel, false);
	}

	/**
	 * Init scene
	 */
	p.initScene = function(callback) {
		p.scene = new THREE.Scene();
		p.initCamera();
		p.initLights();
		p.initRenderer(function(){callback();});

		// create first h ([h]h:mm) : firstHour
		p.createClockGroup(-360, 0, p.firstHourArray);

		// create second h (h[h]:mm) : secondHour
		p.createClockGroup(-120, 0, p.secondHourArray);
		
		// create first m (hh:[m]m) : firstMinute
		p.createClockGroup(120, 0, p.firstMinuteArray);

		// create second m (hh:m[m]) : secondMinute
		p.createClockGroup(360, 0, p.secondMinuteArray);

		p.render();
	};

	p.initCamera = function() {
		p.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		p.camera.position.y = 50;
		p.camera.position.z = 650;
		p.camera.updateProjectionMatrix();
		p.camera.lookAt(this.scene.position);
	};

	p.initRenderer = function(callback) {
		p.renderer = new THREE.WebGLRenderer({antialias: true});
		p.renderer.setSize( window.innerWidth, window.innerHeight );
		p.renderer.setClearColor( 0xf0f0f0, 1 );
		p.renderer.domElement.id = "canvas3d";
		p.renderer.domElement.style.display = "none";
		p.renderer.domElement.style.opacity = 0;
		document.body.appendChild(p.renderer.domElement);
		callback();
	};

	p.initLights = function() {
		var light = new THREE.DirectionalLight( 0xffffff, 1.2 );
		light.position.set( -55, 10, 40 );
		p.scene.add( light );
		var light = new THREE.DirectionalLight( 0xffffff, 0.6 );
		light.position.set( 55, -55, 55 );
		p.scene.add( light );
		var light = new THREE.DirectionalLight( 0xffffff, 0.8 );
		light.position.set( 0, 0, -100 );
		p.scene.add( light );
	};

	/**
	 * Create clock group (2x3 clocks to make 1 number) 
	 */
	p.createClockGroup = function(x, y, array) {
		// clock group container
		p.clockGroup = new THREE.Group();
		p.clockGroup.position.x = x;
		p.clockGroup.position.y = y;
		p.scene.add(p.clockGroup);

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
		p.clock = new THREE.Group();
		p.clock.position.x = (i-0.5) * 120;
		p.clock.position.y = (j-1) * (-120);
		container.add(p.clock);
		
		// clock base
		p.geometry = new THREE.CylinderGeometry( 60, 60, 40, 20 );
		p.material = new THREE.MeshPhongMaterial({color : 0xf6f6f6, shading: THREE.FlatShading});
		p.base = new THREE.Mesh(p.geometry, p.material);
		p.base.rotation.x = Math.PI/2;
		p.clock.add(p.base);

		// clock ring
		var pts = [
			new THREE.Vector3(60,0,6),//top left
			new THREE.Vector3(56,0,6),//top right
			new THREE.Vector3(56,0,-6),//bottom right
			new THREE.Vector3(60,0,-6),//bottom left
			new THREE.Vector3(60,0,6)//back to top left - close square path
		];
		p.geometry = new THREE.LatheGeometry( pts, 20 );
		p.material = new THREE.MeshPhongMaterial({color : 0xffffff, shading: THREE.FlatShading});
		p.ring = new THREE.Mesh(p.geometry, p.material);
		p.ring.position.z = 24;
		p.ring.overdraw = true;
		p.ring.doubleSided = true;
		p.clock.add(p.ring);
		
		// minute hand
		p.geometry = new THREE.BoxGeometry( 50, 10, 2 );
		p.material = new THREE.MeshPhongMaterial({color : 0x000000, shading: THREE.FlatShading});
		p.minuteHand = new THREE.Mesh(p.geometry, p.material);
		p.minuteHand.position.z = 24;
		p.minuteHand.position.x = 25;
		p.clock.add(p.minuteHand);
		p.geometry = new THREE.CylinderGeometry( 5, 5, 2, 10 );
		p.material = new THREE.MeshPhongMaterial({color : 0x000000, shading: THREE.FlatShading});
		p.minuteHandBase = new THREE.Mesh(p.geometry, p.material);
		p.minuteHandBase.rotation.x = Math.PI/2;
		p.minuteHandBase.position.z = 24;
		p.clock.add(p.minuteHandBase);
		// minute hand rotation pivot
		p.minuteHandPivot = new THREE.Object3D();
		p.clock.add( p.minuteHandPivot );
		p.minuteHandPivot.add(p.minuteHand);
		p.minuteHandPivot.rotation.z = (3/2)*Math.PI;

		// hour hand
		p.geometry = new THREE.BoxGeometry( 46, 10, 2 );
		p.hourHand = new THREE.Mesh(p.geometry, p.material);
		p.hourHand.position.z = 26;
		p.hourHand.position.x = 23;
		p.clock.add(p.hourHand);
		p.geometry = new THREE.CylinderGeometry( 5, 5, 2, 10 );
		p.material = new THREE.MeshPhongMaterial({color : 0x000000, shading: THREE.FlatShading});
		p.hourHandBase = new THREE.Mesh(p.geometry, p.material);
		p.hourHandBase.rotation.x = Math.PI/2;
		p.hourHandBase.position.z = 26;
		p.clock.add(p.hourHandBase);
		// hour hand rotation pivot
		p.hourHandPivot = new THREE.Object3D();
		p.clock.add( p.hourHandPivot );
		p.hourHandPivot.add(p.hourHand);
		p.hourHandPivot.rotation.z = Math.PI/4;

		// central screw
		p.geometry = new THREE.CylinderGeometry( 3, 3, 2, 10 );
		p.material = new THREE.MeshPhongMaterial({color : 0x222222, shading: THREE.FlatShading});
		p.centralScrew = new THREE.Mesh(p.geometry, p.material);
		p.centralScrew.rotation.x = Math.PI/2;
		p.centralScrew.position.z = 28;
		p.clock.add(p.centralScrew);

		// add minute hand and hour hand into clocks array
		// object 	: (PIXI Graphics Object)
		// speed 	: (Float) speed coef
		// isMoved 	: (Boolean) true if needle curently rotating
		// round 	: (Integer) number of clock round before stop rotating
		// index 	: (Integer) current number of animation
		array.push({
			minute: {
				object: p.minuteHandPivot,
				speed: p.minuteSpeed,
				isMoved: true,
				round: 2,
				index: 1
			},
			hour: {
				object: p.hourHandPivot,
				speed: p.hourSpeed,
				isMoved: true,
				round: 1,
				index: 1
			}
		});
	}

	p.render = function() {
		requestAnimationFrame(p.render);

		p.updateTime();
		
		p.renderer.render(p.scene, p.camera);
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
		if ( clock.isMoved && clock.object.rotation.z > - ( 2 * ( clock.index + clock.round - 1 ) * Math.PI + formule ) ) {
			clock.object.rotation.z -= clock.speed;
		} else {
			if ( clock.isMoved ) {
				clock.object.rotation.z = - ( 2 * clock.index * Math.PI + formule );
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

	/**
	 * Event listener mouse move
	 */
	p.onMouseMove = function(e) {
		if (!p.mouseDown) {
			return;
		}

		e.preventDefault();

		var deltaX = e.clientX - p.mouseX,
			deltaY = e.clientY - p.mouseY;
		p.mouseX = e.clientX;
		p.mouseY = e.clientY;
		p.rotateScene(deltaX, deltaY);
	}

	/**
	 * Event listener mouse down
	 */
	p.onMouseDown = function(e) {
		e.preventDefault();

		p.mouseDown = true;
		p.mouseX = e.clientX;
		p.mouseY = e.clientY;
	}

	/**
	 * Event listener mouse up
	 */
	p.onMouseUp = function(e) {
		e.preventDefault();

		p.mouseDown = false;
	}

	/**
	 * Rotate scene
	 */
	p.rotateScene = function(deltaX, deltaY) {
		p.scene.rotation.y += deltaX / 100;
		p.scene.rotation.x += deltaY / 100;
	}

	/**
	 * Event listener mouse wheel
	 */
	p.mousewheel = function(e) {
		var fovMAX = 160;
		var fovMIN = 1;

		p.camera.fov -= event.wheelDeltaY * 0.05;
		p.camera.fov = Math.max( Math.min( p.camera.fov, fovMAX ), fovMIN );
		p.camera.projectionMatrix = new THREE.Matrix4().makePerspective(p.camera.fov, window.innerWidth / window.innerHeight, p.camera.near, p.camera.far);
	}

	window.Clock3d = Clock3d;
})();
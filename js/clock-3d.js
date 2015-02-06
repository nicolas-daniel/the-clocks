(function() {
	'use strict';

	var Clock3d = function() { this.init(); };
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
	p.init = function() {
		p.initScene();	
	};

	/**
	 * Init scene
	 */
	p.initScene = function() {
		p.scene = new THREE.Scene();
		p.initCamera();
		p.initLights();
		p.initRenderer();

		// create first h ([h]h:mm) : firstHour
		p.createClockGroup(0, 0, p.firstHourArray);

		p.render();
	};

	p.initCamera = function() {
		p.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		p.camera.position.x = -100;
		p.camera.position.y = 50;
		p.camera.position.z = 400;
		p.camera.updateProjectionMatrix();
		p.camera.lookAt(this.scene.position);
	};

	p.initRenderer = function() {
		p.renderer = new THREE.WebGLRenderer({antialias: true});
		p.renderer.setSize( window.innerWidth, window.innerHeight );
		p.renderer.setClearColor( 0xf0f0f0, 1 );
		document.body.appendChild(p.renderer.domElement);
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
		p.clockGroup.x = x;
		p.clockGroup.y = y;
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
	}

	p.render = function() {
		requestAnimationFrame(p.render);

		
		p.renderer.render(p.scene, p.camera);
	};

	window.Clock3d = Clock3d;
})();
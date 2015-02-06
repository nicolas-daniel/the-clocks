document.addEventListener('DOMContentLoaded', function() {
	var App = function() {};
	var p = App.prototype;

	p.canvas2d = null;
	p.canvas3d = null;
	p.btn2d = null;
	p.btn3d = null;
	p.animationDuration = 0.6;
	
	// ------------------------------
	// @function init()
	// ------------------------------
	p.init = function() {
		console.log('%c Hi developers! %c  http://nicolasdaniel.fr  ', 'background: #121212; color: #fff;', 'background: #EEEEEE; color: #121212;');
		
		p.clock2d = new Clock2d();
		p.clock3d = new Clock3d(function(){
			p.initParameters();

			p.btn2d.addEventListener('click', p.onClick2d);
			p.btn3d.addEventListener('click', p.onClick3d);
		});
	};

	p.initParameters = function() {
		p.canvas2d = document.getElementById('canvas2d');
		p.canvas3d = document.getElementById('canvas3d');
		p.btn2d = document.getElementById('button2d');
		p.btn3d = document.getElementById('button3d');
	};

	p.onClick2d = function(e) {
		e.preventDefault();

		p.btn3d.className = "switcher-button";
		p.btn2d.className += " is-active";
		
		TweenMax.to(p.canvas3d, p.animationDuration, {opacity: 0, onComplete: function(){
			p.canvas3d.style.display = "none";
		}});
		p.canvas2d.style.display = "block";
		TweenMax.to(p.canvas2d, p.animationDuration, {opacity: 1, delay: p.animationDuration-0.2});

		return false;
	};

	p.onClick3d = function(e) {
		e.preventDefault();

		p.btn2d.className = "switcher-button";
		p.btn3d.className += " is-active";

		TweenMax.to(p.canvas2d, p.animationDuration, {opacity: 0, onComplete: function(){
			p.canvas2d.style.display = "none";
		}});
		p.canvas3d.style.display = "block";
		TweenMax.to(p.canvas3d, p.animationDuration, {opacity: 1, delay: p.animationDuration-0.2});

		return false;
	};

	window.app = new App();
	app.init();
})
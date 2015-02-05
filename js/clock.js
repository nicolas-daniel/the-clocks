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
		console.log('init');
	};

	window.Clock = Clock;
})();
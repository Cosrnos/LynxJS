/*
 *    Lynx Project
 *    Started August 2013
 *    ------------------------------------------------------
 *    This file is covered under the LynxJS Game Library
 *    License. Please read license.txt for more information
 *    on usage of this library.
 *    ------------------------------------------------------
 *    File Name: EventEmitter.js
 *    Description: The central event processor in Lynx.
 *    Global Variables: Lynx.EventEmitter(), Lynx.Emitter{}, Lynx.Emit(pEvent, pSender)
 */

Lynx.EventEmitter = function () {
	var that = {};

	var events = [];

	/**
	 * Descripton: Subscribes the event listener to the given event
	 *
	 * @this {Lynx.EventEmitter}
	 * @param {String} <pEvent> name of event to subscribe to
	 * @param {Lynx.EventListener} <pEventListener> Listener to subscribe
	 */
	that.Subscribe = (function (pEvent, pEventListener) {
		if (typeof events[pEvent] == 'undefined') {
			events[pEvent] = [];
		}

		events[pEvent].push(pEventListener);
		this.Notify("EventEmitter.Subscribe", this);
	}).bind(that);

	/**
	 * Description: Notifies all listeners of an event
	 *
	 * @this {Lynx.EventEmitter}
	 * @param {String} <pEvent> name of event to notify of
	 * @param {Object} <pSender> object that is sending the event.
	 */
	that.Notify = (function (pEvent, pSender) {
		if (typeof events[pEvent] == 'undefined') {
			return;
		}

		var nextCallback = true;

		for (var i = 0;
			(i < events[pEvent].length && nextCallback); i++) {
			nextCallback = events[pEvent][i].Notify(pEvent, pSender) || true;
		}

		if (!nextCallback) {
			//Assume the event was interrupted
			this.Notify(pEvent + ".Break", this);
		}
	}).bind(that);

	/**
	 * Description: Defines a given event to be emitted later.
	 *
	 * @depreciated
	 * @this {Lynx.EventEmitter}
	 * @param {String} <pEvent> Event to add
	 */
	that.Define = (function (pEvent) {
		if (typeof events[pEvent] != 'undefined') {
			return false;
		}

		events[pEvent] = [];
	}).bind(that);

	return that;
};

Lynx.Emitter = new Lynx.EventEmitter();

Lynx.Emit = function (pEvent, pSender) {
	Lynx.Emitter.Notify(pEvent, pSender);
};
